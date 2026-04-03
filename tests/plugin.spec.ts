import { describe, expect, it } from "vitest";
import { createTestHarness } from "@paperclipai/plugin-sdk/testing";
import manifest from "../src/manifest.js";
import plugin from "../src/worker.js";

describe("plugin scaffold", () => {
  it("registers data, actions, and event handling", async () => {
    const harness = createTestHarness({ manifest, capabilities: [...manifest.capabilities, "events.emit"] });
    await plugin.definition.setup(harness.ctx);

    await harness.emit("issue.created", { issueId: "iss_1" }, { entityId: "iss_1", entityType: "issue" });
    expect(harness.getState({ scopeKind: "issue", scopeId: "iss_1", stateKey: "seen" })).toBe(true);

    const healthData = await harness.getData<{ status: string; checkedAt: string }>("health");
    expect(healthData.status).toBe("ok");

    const pingAction = await harness.performAction<{ pong: boolean; at: string }>("ping");
    expect(pingAction.pong).toBe(true);
  });

  it("registers compatibility data endpoints", async () => {
    const harness = createTestHarness({ manifest, capabilities: manifest.capabilities });
    await plugin.definition.setup(harness.ctx);

    const summary = await harness.getData<{
      version: string;
      overallStatus: string;
      supportedConsumers: string[];
      blockedConsumers: string[];
      consumerCount: number;
    }>("compat:summary");
    
    expect(summary.version).toBe("2026.325.0");
    expect(summary.consumerCount).toBeGreaterThan(0);
    expect(Array.isArray(summary.supportedConsumers)).toBe(true);
    expect(Array.isArray(summary.blockedConsumers)).toBe(true);

    const consumers = await harness.getData<{
      knownConsumers: string[];
      supportedVersions: string[];
    }>("compat:consumers");
    
    expect(consumers.knownConsumers).toContain("uos-plugin-setup-studio");
    expect(consumers.supportedVersions).toContain("2026.325.0");
  });

  it("registers compatibility impact action", async () => {
    const harness = createTestHarness({ manifest, capabilities: manifest.capabilities });
    await plugin.definition.setup(harness.ctx);

    const impact = await harness.performAction<{
      generatedAt: string;
      affectedRepos: string[];
      consumerImpact: { consumerId: string; impactLevel: string; notes: string }[];
      migrationRequired: boolean;
      releaseBlockers: string[];
    }>("compat:impact", {
      changeDescription: "Test upstream change",
      affectedContracts: ["uos-plugin-setup-studio"],
    });
    
    expect(impact.affectedRepos).toContain("uos-plugin-setup-studio");
    expect(impact.migrationRequired).toBe(false);
  });

  it("verifies compatibility version support", async () => {
    const harness = createTestHarness({ manifest, capabilities: manifest.capabilities });
    await plugin.definition.setup(harness.ctx);

    const supported = await harness.getData<{ version: string; isSupported: boolean; checkedAt: string }>(
      "compat:isSupported",
      { version: "2026.325.0" }
    );
    expect(supported.isSupported).toBe(true);

    const unsupported = await harness.getData<{ version: string; isSupported: boolean; checkedAt: string }>(
      "compat:isSupported",
      { version: "2099.999.999" }
    );
    expect(unsupported.isSupported).toBe(false);
  });
});
