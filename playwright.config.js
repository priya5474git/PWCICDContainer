// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 0,
  outputDir: 'test-artifacts',
  reporter: [
    ['line'],
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['./reporters/readable-reporter.js', { outputFile: 'test-results/readable-summary.txt' }]
  ],
  use: {
    headless: true
  }
});
