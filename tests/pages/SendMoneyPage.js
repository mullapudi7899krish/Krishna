const { expect } = require('@playwright/test');

class SendMoneyPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /^Send Money$/i }).click();
    await expect(this.page.getByRole('heading', { name: 'Send Money' })).toBeVisible();
    await this.page.locator('body').evaluate((body) => {
      body.scrollIntoView({ block: 'end', inline: 'nearest' });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
  }

  async expectForm() {
    await expect(this.page.getByRole('combobox', { name: 'From Account' })).toBeVisible();
    await expect(this.page.getByRole('combobox', { name: 'Payee' })).toBeVisible();
    await expect(this.page.getByRole('spinbutton', { name: 'Amount' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Review & Send' })).toBeVisible();
  }
}

module.exports = { SendMoneyPage };
