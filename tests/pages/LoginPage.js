const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('login', { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByRole('form', { name: /sign in form/i })).toBeVisible();
  }

  async login(username, password) {
    await this.page.getByPlaceholder('Enter username').fill(username);
    await this.page.getByPlaceholder('Enter password').fill(password);
    await this.page.locator('#signInForm').evaluate((form) => {
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
        return;
      }
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
  }

  async expectErrorMessage(message) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async togglePasswordVisibility() {
    await this.page.getByPlaceholder('Enter password').fill('bank_sauce');
    await this.page.getByRole('button', { name: 'Show password' }).click();
    await expect(this.page.getByPlaceholder('Enter password')).toHaveAttribute('type', 'text');
  }
}

module.exports = { LoginPage };
