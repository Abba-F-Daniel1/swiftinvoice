# Hardening Verification

This document defines measurable checks for the auth and integration hardening slice.

## Outcome Targets

1. All API routes are protected by middleware ordering.
2. Health endpoint remains publicly reachable.
3. Services routes are present for frontend parity.
4. Backend Clerk config uses server secret key.
5. Frontend token synchronization and interceptor fallback stay intact.
6. Environment files remain ignored by git.

## Gate Test

Run the deterministic gate test:

npm run test:gate

Pass condition: all checks in tests/gate/hardening-regressions.test.mjs pass.

## Eval

Run the scored eval:

npm run eval:hardening

Pass threshold: score must be 1.00 (100%).

The eval report is written to:

/tmp/swiftinvoice-hardening-eval/report.json
