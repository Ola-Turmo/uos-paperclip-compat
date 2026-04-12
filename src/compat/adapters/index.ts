/**
 * Registry of all compatibility adapters for Paperclip SDK versions.
 * 
 * Adapters translate upstream Paperclip changes into shapes that
 * downstream UOS consumers expect. Adding a new adapter here
 * enables the compatibility layer to absorb that change.
 */

import type { CompatibilityAdapter, SupportedSdkVersion } from "../types.js";
import { IdentityAdapter } from "./base.js";

/**
 * All registered compatibility adapters.
 * The first adapter that supports a given version handles that version.
 */
const adapters: CompatibilityAdapter[] = [
  // Identity adapter for 2026.325.0 - current stable version
  new IdentityAdapter(["2026.325.0"]),
];

/**
 * Get the adapter for a specific SDK version.
 * Returns null if no adapter can handle that version.
 */
export function getAdapterForVersion(
  version: SupportedSdkVersion
): CompatibilityAdapter | null {
  for (const adapter of adapters) {
    if (adapter.supportsVersion?.(version) ?? false) {
      return adapter;
    }
  }
  return null;
}

/**
 * Get all registered adapter IDs.
 */
export function getRegisteredAdapterIds(): string[] {
  return adapters.map((a) => a.id);
}

/**
 * Check if a version is supported by any registered adapter.
 */
export function isVersionAdaptable(version: SupportedSdkVersion): boolean {
  return getAdapterForVersion(version) !== null;
}

/**
 * Adapt an input using the appropriate adapter for the given version.
 * Returns null if adaptation is not possible.
 */
export function adaptForVersion<TInput, TOutput>(
  input: TInput,
  version: SupportedSdkVersion
): TOutput | null {
  const adapter = getAdapterForVersion(version);
  if (!adapter) {
    return null;
  }
  return adapter.adapt?.(input, version) as TOutput | null;
}

/**
 * Supported SDK versions as a tuple for type safety.
 */
export const SUPPORTED_ADAPTER_VERSIONS: SupportedSdkVersion[] = ["2026.325.0"];

// Re-export base adapter types
export { IdentityAdapter } from "./base.js";
