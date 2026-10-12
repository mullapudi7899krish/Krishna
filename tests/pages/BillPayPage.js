const { expect } = require('@playwright/test');

class BillPayPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /^Bill Pay$/i }).click();
    await expect(this.page.getByRole('heading', { name: 'Pay a Bill' })).toBeVisible();
    await this.page.locator('body').evaluate((body) => {
      body.scrollIntoView({ block: 'end', inline: 'nearest' });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
  }

  async expectForm() {
    await expect(this.page.getByRole('combobox', { name: 'From Account' })).toBeVisible();
    await expect(this.page.getByRole('combobox', { name: 'Biller' })).toBeVisible();
    await expect(this.page.getByRole('spinbutton', { name: 'Amount' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Payment Date' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Review Payment' })).toBeVisible();
  }
}

module.exports = { BillPayPage };
