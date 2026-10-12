const { expect, test: base } = require('@playwright/test');
const { testConfig } = require('../config/test-config');
const { LoginPage } = require('./pages/LoginPage');

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(testConfig.credentials.username, testConfig.credentials.password);
    await expect(page).toHaveURL(/\/bank\/dashboard/);
    await use(page);
  },
});

module.exports = { test, expect };
