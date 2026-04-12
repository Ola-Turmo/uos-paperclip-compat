# PRD: uos-paperclip-compat — SDK Compatibility Layer

## Context
Paperclip compatibility plugin — provides compatibility shims and contract definitions between UOS plugins and Paperclip SDK. Minimal actions.

## Vision (April 2026 — World-Class)
The compatibility layer should be the **invariant guardian** of the UOS ecosystem — ensuring all plugins play by the same rules, catching compatibility issues before they ship, and maintaining the contract that keeps the whole system coherent.

## What's Missing / Innovation Opportunities

### 1. Contract Enforcement Engine
Currently: Basic version checking.
**Add**: Automated contract testing for all plugins. Breaking change detection. Contract versioning with migration paths.

### 2. Compatibility Dashboard
Currently: Minimal.
**Add**: Ecosystem compatibility matrix. Plugin health scores. Known issues tracker. Upgrade path visualizer.

### 3. Auto-Fix for Breaking Changes
Currently: Manual.
**Add**: Automated codemods for common breaking changes. Migration assistant. Compatibility shim generator.

## Implementation Phases

### Phase 1: Contract Testing
- Contract test runner (`src/compat/contract-runner.ts`)
- Breaking change detector
- Test suite generator

### Phase 2: Compatibility Dashboard
- Compatibility matrix UI
- Plugin health dashboard
- Upgrade assistant

### Phase 3: Auto-Fix
- Codemod library
- Migration assistant
- Shim generator

## Technical Approach
- TypeScript + Zod
- `@paperclipai/plugin-sdk`
- AST analysis for breaking changes
- Codemod framework

## Success Metrics
- Contract test coverage: 100% of plugins
- Breaking change detection: < 1 minute
- Auto-fix rate: > 60% of common issues
