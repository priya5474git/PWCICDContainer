const { test, expect } = require('@playwright/test');
const fs = require('fs/promises');
const path = require('path');

test.use({
  browserName: 'chromium',
  channel: 'chrome'
});

test('successful login in chrome using default page credentials', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'This test runs only on Chrome/Chromium.');

  await page.goto('https://rahulshettyacademy.com/loginpagePractise/', { waitUntil: 'domcontentloaded' });

  const credentialsHint = await page.locator('p.text-center.text-white').innerText();

  const userMatch = credentialsHint.match(/username\s*is\s*([\w.-]+)/i);
  const passwordMatch = credentialsHint.match(/password\s*is\s*([\w@#$%^&*!.-]+)/i);

  expect(userMatch, 'Default username should be present on page').toBeTruthy();
  expect(passwordMatch, 'Default password should be present on page').toBeTruthy();

  const username = userMatch[1];
  const password = passwordMatch[1];

  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#signInBtn').click();

  await expect(page).toHaveURL(/.*\/angularpractice\/shop/, { timeout: 15000 });

  const reportDir = path.resolve('test-results');
  const reportFile = path.join(reportDir, 'login-success-report.txt');
  const reportMessage = "login to 'RAHUL SHETTY ACADEMY IS SUCCESSFUL'";

  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(reportFile, `${reportMessage}\n`, 'utf8');

  await test.info().attach('post-login-status', {
    body: reportMessage,
    contentType: 'text/plain'
  });
});
