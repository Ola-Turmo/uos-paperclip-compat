/**
 * @uos/paperclip-compat - Compatibility layer public API
 * 
 * This module exports the public interface for the compatibility layer,
 * including adapters, matrix, contracts, and verification utilities.
 */

// Types
export type {
  ConsumerContract,
  ContractStatus,
  SupportedSdkVersion,
  CompatibilityAdapter,
  UpstreamChange,
  CompatibilityCheckResult,
  ImpactReport,
  ContractAssertion,
} from "./types.js";

// Matrix
export {
  COMPATIBILITY_MATRIX,
  getKnownConsumers,
  getConsumerStatus,
  getOverallConsumerStatus,
  isVersionSupported,
  getSupportedVersions,
  generateImpactReport,
  runCompatibilityCheck,
} from "./matrix.js";

// Adapters
export {
  getAdapterForVersion,
  getRegisteredAdapterIds,
  isVersionAdaptable,
  adaptForVersion,
  SUPPORTED_ADAPTER_VERSIONS,
  IdentityAdapter,
} from "./adapters/index.js";

// Contracts
export {
  CONTRACT_ASSERTIONS,
  verifyContractAssertions,
  getCompatibilitySummary,
  generateVerificationReport,
  type ContractVerificationReport,
} from "./contracts.js";
