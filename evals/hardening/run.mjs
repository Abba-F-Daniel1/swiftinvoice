import fs from 'node:fs';
import path from 'node:path';
import { evaluateHardening } from './checks.mjs';

const outputDir = '/tmp/swiftinvoice-hardening-eval';
const outputFile = path.join(outputDir, 'report.json');

const checks = evaluateHardening();
const passed = checks.filter((check) => check.pass).length;
const total = checks.length;
const score = total === 0 ? 0 : passed / total;
const threshold = 1;
const failedChecks = checks.filter((check) => !check.pass);

const report = {
  timestamp: new Date().toISOString(),
  suite: 'hardening',
  total,
  passed,
  failed: total - passed,
  score,
  threshold,
  status: score >= threshold ? 'PASS' : 'FAIL',
  checks,
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`[hardening-eval] status=${report.status} passed=${passed}/${total} score=${score.toFixed(2)}`);
console.log(`[hardening-eval] report=${outputFile}`);

if (failedChecks.length > 0) {
  console.log('[hardening-eval] failures:');
  for (const failure of failedChecks) {
    console.log(`- ${failure.name}: ${failure.details}`);
  }
  process.exit(1);
}
