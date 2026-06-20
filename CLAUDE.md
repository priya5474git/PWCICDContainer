# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                  # Run all Playwright tests (headless)
npm run test:headed       # Run tests in headed mode with HTML report auto-opened
npm run report            # Open the HTML report from the last test run
npx playwright test tests/fibonacci.spec.js  # Run a single test file
npx playwright test -g "should return"       # Run tests matching a name pattern
```

## Architecture

This is a Playwright test suite. Tests are in `tests/` and use `@playwright/test` directly via CommonJS (`require`). There are two distinct test types:

- **`fibonacci.spec.js`** — pure logic tests; no browser, no network. The function under test is defined inline in the spec.
- **`login.spec.js`** — browser test against `https://rahulshettyacademy.com/loginpagePractise/`. Requires Chrome/Chromium (`channel: 'chrome'`). It reads credentials from the page itself, fills the login form, asserts the post-login URL, and writes `test-results/login-success-report.txt`.

**Reporters** — four reporters run on every test pass:
- `line` (console)
- `html` → `test-results/html-report/`
- `json` → `test-results/results.json`
- `readable-reporter.js` (custom) → `test-results/readable-summary.txt`

The custom reporter in `reporters/readable-reporter.js` hooks `onTestEnd` and `onEnd` to emit a human-readable plain-text summary. Artifacts (screenshots, traces) go to `test-artifacts/`.

Timeout is 30 s per test; retries are disabled.

**`.claude/` layout** — two subdirectories hold data/scripts that are separate from the test suite:
- `.claude/docs/` — JSON data files (e.g. `employee.json`)
- `.claude/Report/` — reporting scripts (e.g. `employeereport.js`) that consume the data files
