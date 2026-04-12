/**
 * @uos/paperclip-compat UI entrypoint
 *
 * This module is the default export for the plugin's UI bundle.
 * It registers the UI surface that operators interact with when
 * managing the paperclip-compat layer from the Paperclip dashboard.
 */

import React from "react";

/**
 * CompatStatusPanel — shows compatibility summary at a glance.
 * Placeholder UI for the plugin's dashboard slot.
 */
export function CompatStatusPanel() {
  return (
    <div style={{ padding: "1rem", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ margin: "0 0 0.5rem" }}>Paperclip Compatibility Layer</h2>
      <p style={{ margin: 0, color: "#666" }}>
        Manage upstream Paperclip SDK compatibility for UOS.
      </p>
    </div>
  );
}

export default CompatStatusPanel;
