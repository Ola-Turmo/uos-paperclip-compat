/**
 * Compatibility layer types for Paperclip SDK version negotiation.
 * 
 * These types define the contract between upstream Paperclip changes and
 * downstream UOS consumers, enabling explicit adapter-first compatibility.
 */

import type { PaperclipPluginManifestV1 } from "@paperclipai/plugin-sdk";

/**
 * Supported Paperclip SDK version ranges that UOS has validated against.
 */
export const SUPPORTED_SDK_VERSIONS = ["2026.325.0"] as const;
export type SupportedSdkVersion = typeof SUPPORTED_SDK_VERSIONS[number];

/**
 * Known downstream consumers of the paperclip-compat layer.
 * Each entry tracks the minimum compatible version and test status.
 */
export interface ConsumerContract {
  consumerId: string;
  consumerName: string;
  minCompatVersion: SupportedSdkVersion;
  currentStatus: ContractStatus;
  lastVerified: string;
  tests: ConsumerTestResult[];
}

export type ContractStatus = "supported" | "degraded" | "unsupported" | "unknown";

export interface ConsumerTestResult {
  testName: string;
  passed: boolean;
  timestamp: string;
  error?: string;
}

/**
 * A compatibility adapter translates upstream Paperclip changes into
 * shapes that downstream consumers expect.
 */
export interface CompatibilityAdapter<TInput = unknown, TOutput = unknown> {
  id: string;
  description: string;
  adaptedVersions: SupportedSdkVersion[];
  /**
   * Transform input from upstream to the shape expected by consumers.
   * Returns null if this adapter cannot handle the given version.
   */
  adapt?(input: TInput, version: SupportedSdkVersion): TOutput | null;
  /**
   * Check if a given version is supported by this adapter.
   */
  supportsVersion?(version: SupportedSdkVersion): boolean;
}

/**
 * Upstream change that may require adapter intervention.
 */
export interface UpstreamChange {
  changeId: string;
  description: string;
  detectedAt: string;
  severity: "breaking" | "degrading" | "additive";
  affectedContracts: string[];
  adapterId?: string;
  migrationNote?: string;
}

/**
 * Result of a compatibility check run.
 */
export interface CompatibilityCheckResult {
  checkedAt: string;
  sdkVersion: SupportedSdkVersion;
  overallStatus: ContractStatus;
  consumers: ConsumerContract[];
  upstreamChanges: UpstreamChange[];
  adaptersApplied: string[];
  blockedConsumers: string[];
  supportedConsumers: string[];
}

/**
 * Impact report generated before releasing a compatibility change.
 */
export interface ImpactReport {
  generatedAt: string;
  changeId?: string;
  affectedRepos: string[];
  consumerImpact: {
    consumerId: string;
    impactLevel: "none" | "low" | "medium" | "high";
    notes: string;
  }[];
  migrationRequired: boolean;
  migrationSteps?: string[];
  releaseBlockers: string[];
}

/**
 * Contract verification assertion for validation purposes.
 */
export interface ContractAssertion {
  assertionId: string;
  description: string;
  passed: boolean;
  evidence: string[];
  checkedAt: string;
}
