/**
 * Compatibility matrix tracking SDK versions against downstream consumers.
 * 
 * This module serves as the source of truth for which Paperclip SDK versions
 * are compatible with which UOS consumers, enabling impact assessment before
 * upstream changes land.
 */

import type {
  ConsumerContract,
  ContractStatus,
  SupportedSdkVersion,
  CompatibilityCheckResult,
  ImpactReport,
} from "./types.js";
import { SUPPORTED_SDK_VERSIONS } from "./types.js";

/**
 * The canonical compatibility matrix. This tracks:
 * - Which SDK versions are supported
 * - Which consumers depend on paperclip-compat
 * - The current verification status of each consumer
 * 
 * Updated when:
 * - New consumers are onboarded
 * - SDK version support changes
 * - Consumer contract tests pass/fail
 */
export const COMPATIBILITY_MATRIX: Record<SupportedSdkVersion, ConsumerContract[]> = {
  "2026.325.0": [
    {
      consumerId: "uos-plugin-setup-studio",
      consumerName: "Setup Studio",
      minCompatVersion: "2026.325.0",
      currentStatus: "supported",
      lastVerified: new Date().toISOString(),
      tests: [],
    },
    {
      consumerId: "uos-core",
      consumerName: "Core Control Plane",
      minCompatVersion: "2026.325.0",
      currentStatus: "supported",
      lastVerified: new Date().toISOString(),
      tests: [],
    },
    {
      consumerId: "uos-plugin-connectors",
      consumerName: "Connector Platform",
      minCompatVersion: "2026.325.0",
      currentStatus: "supported",
      lastVerified: new Date().toISOString(),
      tests: [],
    },
    {
      consumerId: "uos-department-product-tech",
      consumerName: "Product Tech Department",
      minCompatVersion: "2026.325.0",
      currentStatus: "supported",
      lastVerified: new Date().toISOString(),
      tests: [],
    },
  ],
} as const;

/**
 * Get all known consumer IDs from the compatibility matrix.
 */
export function getKnownConsumers(): string[] {
  const consumers = new Set<string>();
  for (const version of Object.keys(COMPATIBILITY_MATRIX) as SupportedSdkVersion[]) {
    for (const consumer of COMPATIBILITY_MATRIX[version]) {
      consumers.add(consumer.consumerId);
    }
  }
  return Array.from(consumers);
}

/**
 * Get the compatibility status for a specific consumer across all SDK versions.
 */
export function getConsumerStatus(consumerId: string): ConsumerContract[] {
  const results: ConsumerContract[] = [];
  for (const version of Object.keys(COMPATIBILITY_MATRIX) as SupportedSdkVersion[]) {
    const consumer = COMPATIBILITY_MATRIX[version].find(
      (c) => c.consumerId === consumerId
    );
    if (consumer) {
      results.push(consumer);
    }
  }
  return results;
}

/**
 * Get the overall status of a consumer (worst case across versions).
 */
export function getOverallConsumerStatus(consumerId: string): ContractStatus {
  const statuses = getConsumerStatus(consumerId);
  if (statuses.length === 0) return "unknown";
  
  // Priority order for worst-case: unsupported > degraded > supported > unknown
  const priority: Record<ContractStatus, number> = {
    unsupported: 3,
    degraded: 2,
    supported: 1,
    unknown: 0,
  };
  
  return statuses.reduce((worst, current) => 
    priority[current.currentStatus] > priority[worst] ? current.currentStatus : worst
  , "supported" as ContractStatus);
}

/**
 * Check if a given SDK version is in the supported versions list.
 */
export function isVersionSupported(version: string): version is SupportedSdkVersion {
  return (SUPPORTED_SDK_VERSIONS as readonly string[]).includes(version);
}

/**
 * Get all supported SDK versions.
 */
export function getSupportedVersions(): SupportedSdkVersion[] {
  return [...SUPPORTED_SDK_VERSIONS];
}

/**
 * Generate an impact report for a proposed change.
 * This surfaces affected repos before a compatibility change is released.
 */
export function generateImpactReport(
  changeDescription: string,
  affectedContracts: string[]
): ImpactReport {
  const affectedRepos: string[] = [];
  const consumerImpact: ImpactReport["consumerImpact"] = [];
  let migrationRequired = false;
  const releaseBlockers: string[] = [];

  for (const version of Object.keys(COMPATIBILITY_MATRIX) as SupportedSdkVersion[]) {
    for (const consumer of COMPATIBILITY_MATRIX[version]) {
      if (affectedContracts.includes(consumer.consumerId)) {
        if (!affectedRepos.includes(consumer.consumerId)) {
          affectedRepos.push(consumer.consumerId);
        }
        
        const impactLevel = consumer.currentStatus === "unsupported" 
          ? "high" 
          : consumer.currentStatus === "degraded" 
            ? "medium" 
            : "low";
        
        if (consumer.currentStatus === "unsupported") {
          migrationRequired = true;
          releaseBlockers.push(
            `${consumer.consumerId} is in unsupported state - migration required before release`
          );
        }
        
        consumerImpact.push({
          consumerId: consumer.consumerId,
          impactLevel,
          notes: `Consumer ${consumer.consumerName} has status: ${consumer.currentStatus}`,
        });
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    changeId: changeDescription,
    affectedRepos,
    consumerImpact,
    migrationRequired,
    releaseBlockers,
  };
}

/**
 * Run a full compatibility check against all known consumers.
 */
export function runCompatibilityCheck(
  sdkVersion: SupportedSdkVersion
): CompatibilityCheckResult {
  const consumers = COMPATIBILITY_MATRIX[sdkVersion] ?? [];
  
  const supportedConsumers = consumers
    .filter((c) => c.currentStatus === "supported")
    .map((c) => c.consumerId);
    
  const blockedConsumers = consumers
    .filter((c) => c.currentStatus === "unsupported")
    .map((c) => c.consumerId);

  const overallStatus: ContractStatus = blockedConsumers.length > 0
    ? "unsupported"
    : consumers.some((c) => c.currentStatus === "degraded")
      ? "degraded"
      : "supported";

  return {
    checkedAt: new Date().toISOString(),
    sdkVersion,
    overallStatus,
    consumers,
    upstreamChanges: [],
    adaptersApplied: [],
    blockedConsumers,
    supportedConsumers,
  };
}
