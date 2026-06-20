const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = process.cwd();
const ignoredPrefixes = [
  '.git/',
  'node_modules/',
  'test-artifacts/',
  'playwright-report/',
  'test-results/html-report/',
  'test-results/results.json',
  'test-results/readable-summary.txt'
];

let timer = null;
let busy = false;

function normalize(relPath) {
  return relPath.replace(/\\/g, '/');
}

function isIgnored(relPath) {
  const p = normalize(relPath || '');
  if (!p) return true;
  return ignoredPrefixes.some((prefix) => p === prefix || p.startsWith(prefix));
}

function run(cmd) {
  return execSync(cmd, { cwd: repoRoot, stdio: 'pipe' }).toString().trim();
}

function hasStagedChanges() {
  try {
    run('git diff --cached --quiet');
    return false;
  } catch {
    return true;
  }
}

function commitAndPush() {
  if (busy) return;
  busy = true;

  try {
    run('git add -A');
    if (!hasStagedChanges()) {
      return;
    }

    const stamp = new Date().toISOString();
    const message = `auto-save: ${stamp}`;
    run(`git commit -m "${message}"`);

    try {
      execSync('git push -u origin main', { cwd: repoRoot, stdio: 'inherit' });
    } catch {
      console.error('Auto-push failed. Ensure authentication is configured locally.');
    }
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    console.error('Auto-commit error:', msg);
  } finally {
    busy = false;
  }
}

function schedule() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(commitAndPush, 1200);
}

console.log('Watching files for save events. Press Ctrl+C to stop.');
console.log('Changes are auto-committed and pushed to origin/main.');

fs.watch(repoRoot, { recursive: true }, (_, filename) => {
  if (!filename || isIgnored(filename)) return;
  schedule();
});
