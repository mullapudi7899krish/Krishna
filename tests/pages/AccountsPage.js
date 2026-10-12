const { expect } = require('@playwright/test');

class AccountsPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /Accounts/i }).click();
    await expect(this.page.getByRole('heading', { name: 'My Accounts' })).toBeVisible();
    await this.page.locator('body').evaluate((body) => {
      body.scrollIntoView({ block: 'end', inline: 'nearest' });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
  }

  async expectAccountList() {
    const accountsTable = this.page.getByRole('table', { name: 'Accounts' });

    await expect(accountsTable).toBeVisible();
    await expect(accountsTable.getByRole('row', { name: /Everyday Checking/ })).toBeVisible();
    await expect(accountsTable.getByRole('row', { name: /High-Yield Savings/ })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Add Account' })).toBeVisible();
  }
}

module.exports = { AccountsPage };
