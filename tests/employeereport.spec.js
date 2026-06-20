const { test, expect } = require('@playwright/test');
const { execFileSync } = require('child_process');
const path = require('path');

test.use({ headless: false });

test('should generate and open employee html report', async ({ page }) => {
  test.setTimeout(0);
  const scriptPath = path.resolve('.claude', 'Report', 'employeereport.js');
  const htmlPath = path.resolve('test-results', 'EmployeeDetails.html');

  execFileSync('node', [scriptPath], { stdio: 'pipe' });

  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`);

  await expect(page.locator('h1')).toHaveText('EMPLOYEE DETAILS');
  await expect(page.locator('table tbody tr')).toHaveCount(4);
  await expect(page.locator('th')).toContainText(['Salary', 'Bonus (10%)', 'Salary + Bonus']);

  console.log('Close the EmployeeDetails browser window to end this test.');
  await page.waitForEvent('close');
});
