# @uos/paperclip-compat

@uos/paperclip-compat protects UOS from upstream churn by owning the compatibility layer for Paperclip SDKs, shared models, schemas, and synchronization logic. Its job is to absorb change deliberately so the rest of the workspace can move with confidence.

Built as part of the UOS split workspace on top of [Paperclip](https://github.com/paperclipai/paperclip), which remains the upstream control-plane substrate.

## What This Repo Owns

- Adapter layers for SDK/model/schema compatibility.
- Version negotiation, mapping logic, and migration support.
- Upstream release watch and change impact assessment.
- Contract test suites and compatibility matrices.
- Shared type/model documentation for downstream consumers.

## Runtime Form

- Split repo with package code as the source of truth and a Paperclip plugin scaffold available for worker, manifest, UI, and validation surfaces when the repo needs runtime or operator-facing behavior.

## Highest-Value Workflows

- Absorbing upstream changes through adapters rather than platform-wide edits.
- Running contract tests across consuming repos.
- Publishing compatibility notes and migration guidance.
- Mapping or translating versions across boundaries.
- Alerting dependent repos to upcoming contract changes.

## Key Connections and Operating Surfaces

- Upstream GitHub repos, releases, issues, discussions, changelogs, npm registries, and published SDK artifacts needed to track Paperclip compatibility drift.
- Schema fixtures, test matrices, migration docs, generated type outputs, lockfiles, and comparison tooling required to prove compatibility rather than assume it.
- Browser, git, package-manager, and local build workflows for inspecting upstream behavior when docs, source, and published packages diverge.
- Downstream UOS repos, CI results, and release notes that consume the compatibility layer so breakage risk is evaluated across the actual network, not just in isolation.

## KPI Targets

- Upstream Paperclip releases are assessed and compatibility notes are published within 48 hours.
- Breaking-change detection coverage reaches >= 90% across the contracts consumed by active UOS repos.
- The compatibility matrix covers 100% of maintained consuming repos and current supported Paperclip versions.
- Adapter-first fixes handle >= 80% of upstream changes without forcing simultaneous edits across the workspace.

## Implementation Backlog

### Now
- Define the compatibility matrix and identify the contracts that matter most to the split workspace.
- Stand up adapter and translation patterns for the highest-risk upstream seams.
- Create a release-watch and migration-note workflow that is simple enough to keep current.

### Next
- Automate compatibility verification against active downstream repos and release candidates.
- Reduce hidden version coupling by making semantic boundaries and translation layers explicit.
- Capture more upstream behavioral drift in fixtures instead of relying on human memory.

### Later
- Offer version-aware shims and tooling support for long-lived mixed-version workspaces.
- Move compatibility reporting into the operations cockpit and release train by default.

## Local Plugin Use

```bash
curl -X POST http://127.0.0.1:3100/api/plugins/install \
  -H "Content-Type: application/json" \
  -d '{"packageName":"<absolute-path-to-this-repo>","isLocalPath":true}'
```

## Validation

```bash
npm install
npm test
npm run plugin:typecheck
npm run plugin:test
```
