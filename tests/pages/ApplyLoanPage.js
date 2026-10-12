const { expect } = require('@playwright/test');

class ApplyLoanPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /^Apply Loan$/i }).click();
    await expect(this.page.getByRole('heading', { name: 'Apply for a Loan' })).toBeVisible();
    await this.page.locator('body').evaluate((body) => {
      body.scrollIntoView({ block: 'end', inline: 'nearest' });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
  }

  async expectLoanHistory() {
    await expect(this.page.getByRole('table', { name: 'Applied loans history' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Apply for Loan' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Reset' })).toBeVisible();
  }
}

module.exports = { ApplyLoanPage };
