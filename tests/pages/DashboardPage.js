const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /Dashboard/i }).click();
    await expect(this.page.getByRole('heading', { name: /welcome back, alex/i })).toBeVisible();
    await this.page.locator('body').evaluate((body) => {
      body.scrollIntoView({ block: 'end', inline: 'nearest' });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
  }

  async expectSummary() {
    await expect(this.page.getByText('$17,050.00')).toBeVisible();
    await expect(this.page.getByRole('region', { name: 'Quick actions' })).toBeVisible();
    await expect(this.page.getByRole('table', { name: 'Recent transactions' })).toBeVisible();
  }
}

module.exports = { DashboardPage };
