import type { PaperclipPluginManifestV1 } from "@paperclipai/plugin-sdk";

/**
 * Paperclip plugin manifest for @uos/paperclip-compat.
 *
 * This manifest declares the plugin's identity, capabilities, and entrypoints.
 * The compat layer absorbs upstream Paperclip churn so downstream UOS repos
 * can move with confidence.
 */
export const manifest: PaperclipPluginManifestV1 = {
  id: "uos.paperclip-compat",
  apiVersion: 1,
  version: "0.1.0",
  displayName: "Paperclip Compatibility Layer",
  description:
    "Compatibility layer for Paperclip SDK, shared models, and host coupling. Absorbs upstream Paperclip changes through adapter-first patterns.",
  author: "UOS Team <team@uos.dev>",
  categories: ["connector"],
  capabilities: [
    "companies.read",
    "projects.read",
    "project.workspaces.read",
    "issues.read",
    "issue.comments.read",
    "issue.documents.read",
    "agents.read",
    "goals.read",
    "goals.create",
    "goals.update",
    "activity.read",
    "costs.read",
    "issues.create",
    "issues.update",
    "issue.comments.create",
    "issue.documents.write",
    "agents.pause",
    "agents.resume",
    "agents.invoke",
    "agent.sessions.create",
    "agent.sessions.list",
    "agent.sessions.send",
    "agent.sessions.close",
    "activity.log.write",
    "metrics.write",
    "plugin.state.read",
    "plugin.state.write",
    "events.subscribe",
    "events.emit",
    "jobs.schedule",
    "webhooks.receive",
    "http.outbound",
    "secrets.read-ref",
    "agent.tools.register",
    "instance.settings.register",
    "ui.sidebar.register",
    "ui.page.register",
    "ui.detailTab.register",
    "ui.dashboardWidget.register",
    "ui.commentAnnotation.register",
    "ui.action.register",
  ],
  entrypoints: {
    worker: "./dist/worker.js",
    ui: "./dist/ui/",
  },
};

export default manifest;
