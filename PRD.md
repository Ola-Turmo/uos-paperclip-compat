---
repo: "uos-paperclip-compat"
display_name: "@uos/paperclip-compat"
package_name: "@uos/paperclip-compat"
lane: "shared-compatibility"
artifact_class: "TypeScript package / SDK and model boundary"
maturity: "shared contract boundary"
generated_on: "2026-04-03"
assumptions: "Grounded in the current split-repo contents, package metadata, README/PRD alignment pass, and the Paperclip plugin scaffold presence where applicable; deeper module-level inspection should refine implementation detail as the code evolves."
autonomy_mode: "maximum-capability autonomous work with deep research and explicit learning loops"
---

# PRD: @uos/paperclip-compat

## 1. Product Intent

**Package / repo:** `@uos/paperclip-compat`  
**Lane:** shared-compatibility  
**Artifact class:** TypeScript package / SDK and model boundary  
**Current maturity:** shared contract boundary  
**Source-of-truth assumption:** Compatibility surface between UOS and Paperclip/upstream shared models.
**Runtime form:** Split repo with package code as the source of truth and a Paperclip plugin scaffold available for worker, manifest, UI, and validation surfaces when the repo needs runtime or operator-facing behavior.

@uos/paperclip-compat protects UOS from upstream churn by owning the compatibility layer for Paperclip SDKs, shared models, schemas, and synchronization logic. Its job is to absorb change deliberately so the rest of the workspace can move with confidence.

## 2. Problem Statement

Upstream model and SDK changes are inevitable, but platform-wide breakage is optional. A compatibility boundary only works when it is explicit, versioned, tested, and better documented than the systems it connects.

## 3. Target Users and Jobs to Be Done

- Core and plugin maintainers depending on stable shared contracts.
- Department overlays built on top of Paperclip primitives.
- Maintainers tracking upstream release movement and schema drift.
- Autonomous agents modifying cross-repo data models.

## 4. Outcome Thesis

**North star:** UOS can adopt upstream Paperclip improvements quickly without turning every release into a contract roulette wheel.

### 12-month KPI targets
- Upstream Paperclip releases are assessed and compatibility notes are published within 48 hours.
- Breaking-change detection coverage reaches >= 90% across the contracts consumed by active UOS repos.
- The compatibility matrix covers 100% of maintained consuming repos and current supported Paperclip versions.
- Adapter-first fixes handle >= 80% of upstream changes without forcing simultaneous edits across the workspace.
- Migration notes exist for 100% of compatibility changes that alter public behavior or contract shape.

### Acceptance thresholds for the next implementation wave
- A contract test matrix exists across the currently supported upstream and downstream compatibility combinations.
- Every detected upstream break includes either an adapter, a migration note, or an explicit unsupported decision.
- Release-watch automation or documented manual review covers the upstream sources most likely to break UOS.
- No compatibility change is shipped without proving impact on the current core, plugin, and department consumers.

## 5. In Scope

- Adapter layers for SDK/model/schema compatibility.
- Version negotiation, mapping logic, and migration support.
- Upstream release watch and change impact assessment.
- Contract test suites and compatibility matrices.
- Shared type/model documentation for downstream consumers.

## 6. Explicit Non-Goals

- Owning product workflows above compatibility needs.
- Becoming a dumping ground for arbitrary shared code.
- Hiding breaking changes behind magic without documentation or tests.

## 7. Maximum Tool and Connection Surface

- This repo should assume it may use any connection, API, browser flow, CLI, document surface, dataset, or storage system materially relevant to completing the job, as long as the access pattern is lawful, auditable, and proportionate to risk.
- Do not artificially limit execution to the tools already named in the repo if adjacent systems are clearly required to close the loop.
- Prefer first-party APIs and direct integrations when available, but use browser automation, provider CLIs, structured import/export, and human-review queues when they are the most reliable path to completion.
- Treat communication systems, docs, spreadsheets, issue trackers, code hosts, cloud consoles, dashboards, databases, and admin panels as valid operating surfaces whenever the repo's job depends on them.
- Escalate only when the action is irreversible, privacy-sensitive, financially material, or likely to create external side effects without adequate review.

### Priority surfaces for compatibility work
- Upstream GitHub repos, releases, issues, discussions, changelogs, npm registries, and published SDK artifacts needed to track Paperclip compatibility drift.
- Schema fixtures, test matrices, migration docs, generated type outputs, lockfiles, and comparison tooling required to prove compatibility rather than assume it.
- Browser, git, package-manager, and local build workflows for inspecting upstream behavior when docs, source, and published packages diverge.
- Downstream UOS repos, CI results, and release notes that consume the compatibility layer so breakage risk is evaluated across the actual network, not just in isolation.

### Selection rules
- Start by identifying the systems that would let the repo complete the real job end to end, not just produce an intermediate artifact.
- Use the narrowest safe action for high-risk domains, but not the narrowest tool surface by default.
- When one system lacks the evidence or authority needed to finish the task, step sideways into the adjacent system that does have it.
- Prefer a complete, reviewable workflow over a locally elegant but operationally incomplete one.

## 8. Autonomous Operating Model

This PRD assumes **maximum-capability autonomous work**. The repo should not merely accept tasks; it should research deeply, compare options, reduce uncertainty, ship safely, and learn from every outcome. Autonomy here means higher standards for evidence, reversibility, observability, and knowledge capture—not just faster execution.

### Required research before every material task
1. Read the repo README, this PRD, touched source modules, existing tests, and recent change history before proposing a solution.
1. Trace impact across adjacent UOS repos and shared contracts before changing interfaces, schemas, or runtime behavior.
1. Prefer evidence over assumption: inspect current code paths, add repro cases, and study real failure modes before implementing a fix.
1. Use external official documentation and standards for any upstream dependency, provider API, framework, CLI, or format touched by the task.
1. For non-trivial work, compare at least two approaches and explicitly choose based on reversibility, operational safety, and long-term maintainability.

### Repo-specific decision rules
- Compatibility and explicit versioning beat convenience.
- Upstream drift should surface as measurable contract impact, not surprise runtime breakage.
- Shared models must be documented like APIs, not treated like internal trivia.
- Avoid clever bidirectional shims that hide the real migration burden.

### Mandatory escalation triggers
- Any public contract break with no migration path.
- Schema/model changes that affect persisted data or auditability.
- Upstream changes with unclear licensing, policy, or security implications.

## 9. Continuous Learning Requirements

### Required learning loop after every task
- Every completed task must leave behind at least one durable improvement: a test, benchmark, runbook, migration note, ADR, or automation asset.
- Capture the problem, evidence, decision, outcome, and follow-up questions in repo-local learning memory so the next task starts smarter.
- Promote repeated fixes into reusable abstractions, templates, linters, validators, or code generation rather than solving the same class of issue twice.
- Track confidence and unknowns; unresolved ambiguity becomes a research backlog item, not a silent assumption.
- Prefer instrumented feedback loops: telemetry, evaluation harnesses, fixtures, or replayable traces should be added whenever feasible.

### Repo-specific research agenda
- Which upstream changes create the most downstream toil today?
- Where can adapter layers replace copy-pasted compatibility handling?
- What compatibility guarantees should be formalized by version range or feature flag?
- Which contract tests are missing across consuming repos?
- How can upstream release intelligence become proactive instead of reactive?

### Repo-specific memory objects that must stay current
- Compatibility matrix.
- Contract test catalog.
- Schema change log.
- Upstream release watch notes.
- Migration advisory archive.

## 10. Core Workflows the Repo Must Master

1. Absorbing upstream changes through adapters rather than platform-wide edits.
1. Running contract tests across consuming repos.
1. Publishing compatibility notes and migration guidance.
1. Mapping or translating versions across boundaries.
1. Alerting dependent repos to upcoming contract changes.

## 11. Interfaces and Dependencies

- Paperclip plugin scaffold for worker, manifest, UI, and validation surfaces.

- `@uos/core`, plugins, and department overlays consuming shared models.
- Upstream Paperclip SDKs, schemas, and synchronized assets.
- Release and migration workflows that must stay aligned with contract changes.

## 12. Implementation Backlog

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

## 13. Risks and Mitigations

- Compatibility logic becoming opaque technical debt.
- Downstream repos bypassing the adapter boundary.
- Upstream changes landing faster than impact analysis can keep up.
- Schema shifts with hidden state migration consequences.

## 14. Definition of Done

A task in this repo is only complete when all of the following are true:

- The code, configuration, or skill behavior has been updated with clear intent.
- Tests, evals, replay cases, or validation artifacts were added or updated to protect the changed behavior.
- Documentation, runbooks, or decision records were updated when the behavior, contract, or operating model changed.
- The task produced a durable learning artifact rather than only a code diff.
- Cross-repo consequences were checked wherever this repo touches shared contracts, orchestration, or downstream users.

### Repo-specific completion requirements
- Contract changes are versioned, documented, and tested across consumers.
- Migration notes exist whenever behavior differs across versions.
- Upstream assumptions are backed by official docs or release evidence.

## 15. Recommended Repo-Local Knowledge Layout

- `/docs/research/` for research briefs, benchmark notes, and upstream findings.
- `/docs/adrs/` for decision records and contract changes.
- `/docs/lessons/` for task-by-task learning artifacts and postmortems.
- `/evals/` for executable quality checks, golden cases, and regression suites.
- `/playbooks/` for operator runbooks, migration guides, and incident procedures.
