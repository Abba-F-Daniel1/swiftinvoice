# Hardening Verification

This document defines measurable checks for the auth and integration hardening slice.

## Outcome Targets

1. All API routes are protected by middleware ordering.
2. Health endpoint remains publicly reachable.
3. Services routes are present for frontend parity.
4. Backend Clerk config uses server secret key.
5. Frontend token synchronization and interceptor fallback stay intact.
6. Environment files remain ignored by git.
7. Frontend and backend env example files are present.
8. Deployment provider configs (Vercel and Render) are present.
9. Vercel SPA rewrites, Vercel install/build commands, Render auto-deploy trigger, and backend health check configuration are enforced.
10. Deployment runbook remains present and references verification command.

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
