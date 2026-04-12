import test from 'node:test';
import assert from 'node:assert/strict';
import { repoId, responsibility } from '../src/index.mjs';

test('repo smoke', () => {
  assert.equal(repoId, '@uos/paperclip-compat');
  assert.ok(responsibility.length > 5);
});

// Note: Detailed compatibility layer tests are in plugin.spec.ts which uses vitest
// and has proper TypeScript compilation. The smoke test above verifies basic
// module exports without requiring a build step.
