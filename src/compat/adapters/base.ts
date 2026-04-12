/**
 * Base adapter providing common functionality for all compatibility adapters.
 */

import type { CompatibilityAdapter, SupportedSdkVersion } from "../types.js";

/**
 * Base class for compatibility adapters with common functionality.
 */
export abstract class BaseAdapter<TInput = unknown, TOutput = unknown>
  implements CompatibilityAdapter<TInput, TOutput>
{
  abstract readonly id: string;
  abstract readonly description: string;
  abstract readonly adaptedVersions: SupportedSdkVersion[];

  supportsVersion(version: SupportedSdkVersion): boolean {
    return this.adaptedVersions.includes(version);
  }

  /**
   * Template method - subclasses implement the actual adaptation.
   */
  abstract adapt(input: TInput, version: SupportedSdkVersion): TOutput | null;

  /**
   * Check if this adapter can handle the given input and version.
   */
  canAdapt(input: unknown, version: SupportedSdkVersion): boolean {
    if (!this.supportsVersion(version)) {
      return false;
    }
    return this.validateInput(input);
  }

  /**
   * Validate that the input is of the expected type for this adapter.
   * Override in subclasses for specific validation.
   */
  protected validateInput(_input: unknown): boolean {
    return true;
  }
}

/**
 * No-op adapter for cases where no translation is needed.
 * This is the default when upstream and downstream shapes match.
 */
export class IdentityAdapter<T = unknown>
  extends BaseAdapter<T, T>
{
  readonly id = "identity";
  readonly description = "Identity adapter - no translation needed";
  readonly adaptedVersions: SupportedSdkVersion[];

  constructor(versions: SupportedSdkVersion[]) {
    super();
    this.adaptedVersions = versions;
  }

  adapt(input: T, _version: SupportedSdkVersion): T {
    return input;
  }
}
