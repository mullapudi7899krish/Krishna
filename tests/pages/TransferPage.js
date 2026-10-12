const { expect } = require('@playwright/test');

class TransferPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /^Transfer$/i }).click();
    await expect(this.page.getByRole('heading', { name: 'Transfer Money' })).toBeVisible();
    await this.page.locator('body').evaluate((body) => {
      body.scrollIntoView({ block: 'end', inline: 'nearest' });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
  }

  async expectForm() {
    await expect(this.page.getByRole('combobox', { name: 'From Account' })).toBeVisible();
    await expect(this.page.getByRole('combobox', { name: 'To Account' })).toBeVisible();
    await expect(this.page.getByRole('spinbutton', { name: 'Amount' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Review Transfer' })).toBeVisible();
  }
}

module.exports = { TransferPage };
