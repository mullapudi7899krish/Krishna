const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');

test.describe('QA Playground bank login', () => {
  test('allows a valid user to sign in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'bank_sauce');

    await expect(page).toHaveURL(/\/bank\/dashboard/);
    await expect(page.getByRole('heading', { name: /welcome back, alex/i })).toBeVisible();
  });

  test('shows a validation message for an invalid login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'wrong-password');

    await expect(page).toHaveURL(/\/bank\/login/);
    await loginPage.expectErrorMessage(/invalid|incorrect|try again/i);
  });

  test('can reveal the password while entering credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.togglePasswordVisibility();
  });
});
