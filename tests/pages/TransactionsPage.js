const { expect } = require('@playwright/test');

class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.table = page.getByRole('table', { name: 'All account transactions' });
  }

  async open() {
    await this.page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /Transactions/i }).click();
    await expect(this.page.getByRole('heading', { name: 'Transactions' })).toBeVisible();
    await expect(this.table).toBeVisible();
    await this.page.locator('body').evaluate((body) => {
      body.scrollIntoView({ block: 'end', inline: 'nearest' });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
  }

  async search(description) {
    await this.page.getByRole('textbox', { name: 'Search' }).fill(description);
  }

  async showCredits() {
    await this.page.getByRole('button', { name: 'Credits' }).click();
  }

  async showDebits() {
    await this.page.getByRole('button', { name: 'Debits' }).click();
  }

  transactionRow(description) {
    return this.table.getByRole('row', { name: description });
  }
}

module.exports = { TransactionsPage };
