# Duplicate Repo Cleanup Decision

## Pair Reviewed

- Canonical repo: `uos-paperclip-compat`
- Cleanup-target repo: `uos-paperclip-compat-sdk-compatibility-layer`

## Result

Keep `uos-paperclip-compat` as the canonical repo and archive
`uos-paperclip-compat-sdk-compatibility-layer`.

## Evidence

- Both repos publish the same package name: `@uos/paperclip-compat`
- Both repos expose the same source tree shape
- Both repos contain the same README content and the same package scripts
- Source comparison showed:
  - `src only in uos-paperclip-compat`: `0`
  - `src only in uos-paperclip-compat-sdk-compatibility-layer`: `0`
  - `shared src`: `10`

## No-Port Decision

No salvage PRD or porting matrix is needed because no additive functionality was
identified in the cleanup-target repo. This is duplicate packaging, not a
distinct product line.

## Archive Trigger

Archive `uos-paperclip-compat-sdk-compatibility-layer` after this decision is
recorded in the canonical repo.

