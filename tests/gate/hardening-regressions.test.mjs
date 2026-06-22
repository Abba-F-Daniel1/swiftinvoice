import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateHardening } from '../../evals/hardening/checks.mjs';

function formatFailures(failures) {
  return failures
    .map((failure) => `- ${failure.name}: ${failure.details}`)
    .join('\n');
}

test('hardening regression checks pass', () => {
  const checks = evaluateHardening();
  const failures = checks.filter((check) => !check.pass);

  assert.equal(
    failures.length,
    0,
    `Hardening regressions detected:\n${formatFailures(failures)}`
  );
});
