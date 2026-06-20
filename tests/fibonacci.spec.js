const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function fibonacciSeries(count) {
  if (count <= 0) return [];
  if (count === 1) return [0];

  const series = [0, 1];
  while (series.length < count) {
    const len = series.length;
    series.push(series[len - 1] + series[len - 2]);
  }

  return series;
}

test('should generate first 10 fibonacci numbers correctly', () => {
  const result = fibonacciSeries(10);
  const expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];

  expect(result).toEqual(expected);
});

test('should return [0] when count is 1', () => {
  expect(fibonacciSeries(1)).toEqual([0]);
});

test('should return empty array for non-positive count', () => {
  expect(fibonacciSeries(0)).toEqual([]);
  expect(fibonacciSeries(-3)).toEqual([]);
});

test('should display fibonacci outcome in html and wait for window close', async ({ page }) => {
  const result = fibonacciSeries(10);
  const outputPath = path.resolve('test-results', 'fibonacci-outcome.html');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fibonacci Outcome</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; }
    h1 { color: #1f2937; }
    .value { font-size: 18px; color: #111827; }
  </style>
</head>
<body>
  <h1>Fibonacci Series (First 10 Numbers)</h1>
  <p class="value">${result.join(', ')}</p>
</body>
</html>`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, htmlContent, 'utf8');

  await page.goto(`file:///${outputPath.replace(/\\/g, '/')}`);
  await expect(page.locator('h1')).toHaveText('Fibonacci Series (First 10 Numbers)');
  await expect(page.locator('.value')).toHaveText('0, 1, 1, 2, 3, 5, 8, 13, 21, 34');

  if (test.info().project.use.headless === false) {
    test.setTimeout(0);
    console.log('Close the Fibonacci report browser window to end this test.');
    await page.waitForEvent('close');
  }
});
