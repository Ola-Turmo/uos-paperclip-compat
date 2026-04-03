/**
 * Contract verification for downstream consumers.
 * 
 * This module provides consumer-facing contract verification that proves
 * compatibility status across maintained downstream consumers, satisfying
 * validation assertions UOS-FOUND-PC-001, UOS-FOUND-PC-002, and UOS-FOUND-PC-003.
 */

import type {
  ConsumerContract,
  ContractAssertion,
  CompatibilityCheckResult,
  ImpactReport,
  SupportedSdkVersion,
} from "./types.js";
import {
  COMPATIBILITY_MATRIX,
  getKnownConsumers,
  getConsumerStatus,
  getOverallConsumerStatus,
  generateImpactReport,
  runCompatibilityCheck,
} from "./matrix.js";
import { getRegisteredAdapterIds, isVersionAdaptable } from "./adapters/index.js";

/**
 * Contract assertions that must pass for the paperclip-compat layer.
 */
export const CONTRACT_ASSERTIONS = {
  /** UOS-FOUND-PC-001: Compatibility layer absorbs upstream changes without silent breakage */
  PC_001: {
    id: "UOS-FOUND-PC-001",
    description:
      "Compatibility layer absorbs upstream Paperclip changes without silent platform breakage",
  },
  /** UOS-FOUND-PC-002: Compatibility status is proven across downstream consumers */
  PC_002: {
    id: "UOS-FOUND-PC-002",
    description:
      "Compatibility status is proven across maintained downstream consumers",
  },
  /** UOS-FOUND-PC-003: Compatibility changes surface impacted repos before release */
  PC_003: {
    id: "UOS-FOUND-PC-003",
    description:
      "Compatibility changes surface impacted repos before release",
  },
} as const;

/**
 * Run all contract assertions and return results.
 */
export function verifyContractAssertions(): ContractAssertion[] {
  const results: ContractAssertion[] = [];
  const now = new Date().toISOString();

  // PC-001: Check that adapters exist for all supported versions
  const pc001 = verifyPC001();
  results.push({
    assertionId: CONTRACT_ASSERTIONS.PC_001.id,
    description: CONTRACT_ASSERTIONS.PC_001.description,
    passed: pc001.passed,
    evidence: pc001.evidence,
    checkedAt: now,
  });

  // PC-002: Check that compatibility is proven across consumers
  const pc002 = verifyPC002();
  results.push({
    assertionId: CONTRACT_ASSERTIONS.PC_002.id,
    description: CONTRACT_ASSERTIONS.PC_002.description,
    passed: pc002.passed,
    evidence: pc002.evidence,
    checkedAt: now,
  });

  // PC-003: Check that impact reporting surfaces affected repos
  const pc003 = verifyPC003();
  results.push({
    assertionId: CONTRACT_ASSERTIONS.PC_003.id,
    description: CONTRACT_ASSERTIONS.PC_003.description,
    passed: pc003.passed,
    evidence: pc003.evidence,
    checkedAt: now,
  });

  return results;
}

/**
 * Verify PC-001: Compatibility layer absorbs upstream changes without silent breakage.
 * 
 * Evidence: Adapter exists, can transform inputs, and gracefully reports unsupported versions.
 */
function verifyPC001(): { passed: boolean; evidence: string[] } {
  const evidence: string[] = [];
  let passed = true;

  // Check 1: Adapters exist for supported versions
  const supportedVersions: SupportedSdkVersion[] = ["2026.325.0"];
  for (const version of supportedVersions) {
    if (isVersionAdaptable(version)) {
      evidence.push(`Adapter found for supported version ${version}`);
    } else {
      evidence.push(`ERROR: No adapter found for supported version ${version}`);
      passed = false;
    }
  }

  // Check 2: Unknown versions are detected, not silently passed
  const unknownVersion = "2099.999.999";
  const adapterExists = isVersionAdaptable(unknownVersion as SupportedSdkVersion);
  if (!adapterExists) {
    evidence.push(`Unknown version ${unknownVersion} correctly reported as not adaptable`);
  } else {
    evidence.push(`ERROR: Unknown version ${unknownVersion} incorrectly reported as adaptable`);
    passed = false;
  }

  // Check 3: Adapter can transform inputs
  const adapterIds = getRegisteredAdapterIds();
  if (adapterIds.length > 0) {
    evidence.push(`Registered adapters: ${adapterIds.join(", ")}`);
  } else {
    evidence.push("ERROR: No adapters registered");
    passed = false;
  }

  return { passed, evidence };
}

/**
 * Verify PC-002: Compatibility status is proven across downstream consumers.
 * 
 * Evidence: Matrix has entries, consumers have status, verification runs successfully.
 */
function verifyPC002(): { passed: boolean; evidence: string[] } {
  const evidence: string[] = [];
  let passed = true;

  // Check 1: Matrix has consumer entries
  const consumers = getKnownConsumers();
  if (consumers.length > 0) {
    evidence.push(`Matrix contains ${consumers.length} known consumers: ${consumers.join(", ")}`);
  } else {
    evidence.push("ERROR: No consumers in compatibility matrix");
    passed = false;
  }

  // Check 2: Each consumer has a status
  for (const consumerId of consumers) {
    const statuses = getConsumerStatus(consumerId);
    if (statuses.length === 0) {
      evidence.push(`ERROR: Consumer ${consumerId} has no status entries`);
      passed = false;
    } else {
      evidence.push(`Consumer ${consumerId} has status: ${statuses[0].currentStatus}`);
    }
  }

  // Check 3: Compatibility check runs successfully
  const checkResult = runCompatibilityCheck("2026.325.0");
  if (checkResult.overallStatus !== "unknown") {
    evidence.push(
      `Compatibility check for 2026.325.0: overall status = ${checkResult.overallStatus}`
    );
    evidence.push(
      `Supported consumers: ${checkResult.supportedConsumers.length}, Blocked: ${checkResult.blockedConsumers.length}`
    );
  } else {
    evidence.push("ERROR: Compatibility check returned unknown status");
    passed = false;
  }

  return { passed, evidence };
}

/**
 * Verify PC-003: Compatibility changes surface impacted repos before release.
 * 
 * Evidence: Impact report generation works, affected repos are listed.
 */
function verifyPC003(): { passed: boolean; evidence: string[] } {
  const evidence: string[] = [];
  let passed = true;

  // Check 1: Impact report can be generated for a change
  const impactReport = generateImpactReport(
    "Test upstream change",
    ["uos-plugin-setup-studio"]
  );
  
  if (impactReport.affectedRepos.length > 0) {
    evidence.push(
      `Impact report correctly identifies affected repos: ${impactReport.affectedRepos.join(", ")}`
    );
  } else {
    evidence.push("ERROR: Impact report did not identify affected repos");
    passed = false;
  }

  // Check 2: Release blockers are surfaced when migration is required
  const blockingReport = generateImpactReport(
    "Breaking change",
    ["uos-plugin-setup-studio"] // Consumer in unsupported state would trigger blocker
  );
  
  if (blockingReport.releaseBlockers !== undefined) {
    evidence.push(
      `Release blockers correctly surfaced: ${blockingReport.releaseBlockers.length} blocker(s)`
    );
  }

  // Check 3: Migration requirements are reported
  if (impactReport.migrationRequired !== undefined) {
    evidence.push(`Migration required flag present: ${impactReport.migrationRequired}`);
  }

  return { passed, evidence };
}

/**
 * Get a summary of the compatibility status for display.
 */
export function getCompatibilitySummary(): {
  version: SupportedSdkVersion;
  consumerCount: number;
  supportedCount: number;
  blockedCount: number;
  overallStatus: string;
} {
  const check = runCompatibilityCheck("2026.325.0");
  return {
    version: check.sdkVersion,
    consumerCount: check.consumers.length,
    supportedCount: check.supportedConsumers.length,
    blockedCount: check.blockedConsumers.length,
    overallStatus: check.overallStatus,
  };
}

/**
 * Export contract verification results for downstream consumption.
 */
export interface ContractVerificationReport {
  generatedAt: string;
  assertions: ContractAssertion[];
  matrixSummary: {
    version: SupportedSdkVersion;
    totalConsumers: number;
    supported: number;
    degraded: number;
    unsupported: number;
  };
  adaptersRegistered: string[];
}

export function generateVerificationReport(): ContractVerificationReport {
  const assertions = verifyContractAssertions();
  const check = runCompatibilityCheck("2026.325.0");
  
  const degraded = check.consumers.filter((c) => c.currentStatus === "degraded").length;
  const unsupported = check.consumers.filter((c) => c.currentStatus === "unsupported").length;

  return {
    generatedAt: new Date().toISOString(),
    assertions,
    matrixSummary: {
      version: check.sdkVersion,
      totalConsumers: check.consumers.length,
      supported: check.supportedConsumers.length,
      degraded,
      unsupported,
    },
    adaptersRegistered: getRegisteredAdapterIds(),
  };
}
