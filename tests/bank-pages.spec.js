const { test, expect } = require('./fixtures');
const { AccountsPage } = require('./pages/AccountsPage');
const { ApplyLoanPage } = require('./pages/ApplyLoanPage');
const { BillPayPage } = require('./pages/BillPayPage');
const { DashboardPage } = require('./pages/DashboardPage');
const { SendMoneyPage } = require('./pages/SendMoneyPage');
const { TransactionsPage } = require('./pages/TransactionsPage');
const { TransferPage } = require('./pages/TransferPage');

test.describe('QA Playground bank pages', () => {
  test('shows the accounts list and available actions', async ({ authenticatedPage }) => {
    const accounts = new AccountsPage(authenticatedPage);

    await accounts.open();
    await accounts.expectAccountList();
  });

  test('shows dashboard account summary and quick actions', async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);

    await dashboard.open();
    await dashboard.expectSummary();
    await expect(authenticatedPage.getByRole('link', { name: /Transfer Money/ })).toHaveAttribute('href', '/bank/transfer');
  });

  test('filters transactions by search and transaction type', async ({ authenticatedPage }) => {
    const transactions = new TransactionsPage(authenticatedPage);
    await transactions.open();

    await transactions.search('Whole Foods Market');
    await expect(transactions.transactionRow(/Whole Foods Market/)).toBeVisible();
    await expect(transactions.transactionRow(/Direct Deposit/)).toHaveCount(0);

    await transactions.search('');
    await transactions.showCredits();
    await expect(transactions.transactionRow(/Direct Deposit/)).toBeVisible();
    await expect(transactions.transactionRow(/Whole Foods Market/)).toHaveCount(0);

    await transactions.showDebits();
    await expect(transactions.transactionRow(/Whole Foods Market/)).toBeVisible();
    await expect(transactions.transactionRow(/Direct Deposit/)).toHaveCount(0);
  });

  test('shows the internal transfer form', async ({ authenticatedPage }) => {
    const transfer = new TransferPage(authenticatedPage);
    await transfer.open();
    await transfer.expectForm();
  });

  test('shows the external payment form', async ({ authenticatedPage }) => {
    const sendMoney = new SendMoneyPage(authenticatedPage);
    await sendMoney.open();
    await sendMoney.expectForm();
  });

  test('shows the bill payment form', async ({ authenticatedPage }) => {
    const billPay = new BillPayPage(authenticatedPage);
    await billPay.open();
    await billPay.expectForm();
  });

  test('shows the loan application history and actions', async ({ authenticatedPage }) => {
    const loans = new ApplyLoanPage(authenticatedPage);

    await loans.open();
    await loans.expectLoanHistory();
  });
});
