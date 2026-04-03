import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import {
  runCompatibilityCheck,
  generateImpactReport,
  generateVerificationReport,
  getKnownConsumers,
  isVersionSupported,
  SUPPORTED_ADAPTER_VERSIONS,
} from "./compat/index.js";
import type { SupportedSdkVersion, ImpactReport } from "./compat/types.js";

const plugin = definePlugin({
  async setup(ctx) {
    ctx.events.on("issue.created", async (event) => {
      const issueId = event.entityId ?? "unknown";
      await ctx.state.set({ scopeKind: "issue", scopeId: issueId, stateKey: "seen" }, true);
      ctx.logger.info("Observed issue.created", { issueId });
    });

    ctx.data.register("health", async () => {
      return { status: "ok", checkedAt: new Date().toISOString() };
    });

    // Compatibility data endpoints
    ctx.data.register("compat:summary", async () => {
      const check = runCompatibilityCheck("2026.325.0" as SupportedSdkVersion);
      return {
        version: check.sdkVersion,
        overallStatus: check.overallStatus,
        supportedConsumers: check.supportedConsumers,
        blockedConsumers: check.blockedConsumers,
        consumerCount: check.consumers.length,
      };
    });

    ctx.data.register("compat:verification", async () => {
      return generateVerificationReport();
    });

    ctx.data.register("compat:consumers", async () => {
      return {
        knownConsumers: getKnownConsumers(),
        supportedVersions: SUPPORTED_ADAPTER_VERSIONS,
      };
    });

    ctx.data.register("compat:isSupported", async (params: Record<string, unknown>) => {
      const version = params.version as string;
      return {
        version,
        isSupported: isVersionSupported(version),
        checkedAt: new Date().toISOString(),
      };
    });

    ctx.actions.register("ping", async () => {
      ctx.logger.info("Ping action invoked");
      return { pong: true, at: new Date().toISOString() };
    });

    // Compatibility impact action
    ctx.actions.register("compat:impact", async (params: Record<string, unknown>) => {
      const changeDescription = params.changeDescription as string;
      const affectedContracts = params.affectedContracts as string[];
      ctx.logger.info("Computing impact report", { changeDescription, affectedContracts });
      const report: ImpactReport = generateImpactReport(changeDescription, affectedContracts);
      return report;
    });
  },

  async onHealth() {
    const check = runCompatibilityCheck("2026.325.0" as SupportedSdkVersion);
    return {
      status: check.blockedConsumers.length > 0 ? "degraded" : "ok",
      message: `Compat layer running with ${check.supportedConsumers.length} supported consumers`,
      details: {
        version: check.sdkVersion,
        supported: check.supportedConsumers.length,
        blocked: check.blockedConsumers.length,
      },
    };
  }
});

export default plugin;
runWorker(plugin, import.meta.url);
