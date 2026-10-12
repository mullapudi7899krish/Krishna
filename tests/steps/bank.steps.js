const { Before, After, Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');

setDefaultTimeout(30000);
const { LoginPage } = require('../pages/LoginPage');
const { AccountsPage } = require('../pages/AccountsPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { TransactionsPage } = require('../pages/TransactionsPage');
const { TransferPage } = require('../pages/TransferPage');
const { SendMoneyPage } = require('../pages/SendMoneyPage');
const { BillPayPage } = require('../pages/BillPayPage');
const { ApplyLoanPage } = require('../pages/ApplyLoanPage');

let browser;
let context;
let page;

const port = process.env.PORT || '3000';

Before(async function () {
  const headless = process.env.HEADLESS !== 'false';
  const slowMo = Number(process.env.SLOW_MO || '500');
  browser = await chromium.launch({ headless, slowMo });
  context = await browser.newContext({
    baseURL: `http://localhost:${port}/bank/`,
  });
  page = await context.newPage();
});

After(async function () {
  if (browser) {
    await browser.close();
  }
});

async function loginToBank(username = 'standard_user', password = 'bank_sauce') {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(username, password);
}

Given('I am on the login page', async function () {
  const loginPage = new LoginPage(page);
  await loginPage.open();
});

Given('I am logged in to the bank app', async function () {
  await loginToBank();
});

When('I sign in with username {string} and password {string}', async function (username, password) {
  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);
});

When('I enter password {string}', async function (password) {
  await page.getByPlaceholder('Enter password').fill(password);
});

When('I toggle password visibility', async function () {
  await page.getByRole('button', { name: 'Show password' }).click();
});

When('I click the {string} navigation link', async function (label) {
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: new RegExp(label, 'i') }).click();
  await page.locator('body').evaluate((body) => {
    body.scrollIntoView({ block: 'end', inline: 'nearest' });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
  });
});

When('I click the {string} quick action', async function (label) {
  await page.getByRole('region', { name: 'Quick actions' }).getByRole('link', { name: label, exact: true }).click();
});

When('I open the accounts page', async function () {
  const accounts = new AccountsPage(page);
  await accounts.open();
});

When('I open the dashboard', async function () {
  const dashboard = new DashboardPage(page);
  await dashboard.open();
});

When('I open the transactions page', async function () {
  const transactions = new TransactionsPage(page);
  await transactions.open();
});

When('I search for {string}', async function (query) {
  const transactions = new TransactionsPage(page);
  await transactions.search(query);
});

When('I clear the search', async function () {
  const transactions = new TransactionsPage(page);
  await transactions.search('');
});

When('I filter by credits', async function () {
  const transactions = new TransactionsPage(page);
  await transactions.showCredits();
});

When('I filter by debits', async function () {
  const transactions = new TransactionsPage(page);
  await transactions.showDebits();
});

When('I open the transfer page', async function () {
  const transfer = new TransferPage(page);
  await transfer.open();
});

When('I open the send money page', async function () {
  const sendMoney = new SendMoneyPage(page);
  await sendMoney.open();
});

When('I open the bill pay page', async function () {
  const billPay = new BillPayPage(page);
  await billPay.open();
});

When('I open the apply loan page', async function () {
  const loans = new ApplyLoanPage(page);
  await loans.open();
});

Then('I should be on the dashboard', async function () {
  await expect(page).toHaveURL(/\/bank\/dashboard/);
});

Then('I should remain on the login page', async function () {
  await expect(page).toHaveURL(/\/bank\/login/);
});

Then('I should see the welcome message {string}', async function (message) {
  await expect(page.getByRole('heading', { name: new RegExp(message, 'i') })).toBeVisible();
});

Then('I should see the invalid credentials message', async function () {
  const errorMessage = page.locator('#loginError');
  await expect(errorMessage).toHaveText('Invalid username or password. Please try again.');
  console.log(`Login error displayed: ${await errorMessage.innerText()}`);
});

Then('the password field should display as text', async function () {
  await expect(page.getByPlaceholder('Enter password')).toHaveAttribute('type', 'text');
});

Then('I should see the accounts table', async function () {
  const accounts = new AccountsPage(page);
  await accounts.expectAccountList();
});

Then('I should see account rows for {string} and {string}', async function (firstAccount, secondAccount) {
  const table = page.getByRole('table', { name: 'Accounts' });
  await expect(table.getByRole('row', { name: new RegExp(firstAccount) })).toBeVisible();
  await expect(table.getByRole('row', { name: new RegExp(secondAccount) })).toBeVisible();
});

Then('I should see the account summary total {string}', async function (amount) {
  await expect(page.getByText(amount)).toBeVisible();
});

Then('I should see the quick actions region', async function () {
  await expect(page.getByRole('region', { name: 'Quick actions' })).toBeVisible();
});

Then('I should see a link to transfer money', async function () {
  await expect(page.getByRole('link', { name: /Transfer Money/ })).toHaveAttribute('href', '/bank/transfer');
});

Then('I should see the transaction row for {string}', async function (label) {
  const transactions = new TransactionsPage(page);
  await expect(transactions.transactionRow(new RegExp(label))).toBeVisible();
});

Then('I should not see the transaction row for {string}', async function (label) {
  const transactions = new TransactionsPage(page);
  await expect(transactions.transactionRow(new RegExp(label))).toHaveCount(0);
});

Then('I should see the empty transaction results message', async function () {
  await expect(page.getByText('No transactions match your filters.')).toBeVisible();
});

Then('I should see the recent transaction {string}', async function (description) {
  const recentTransactions = page.getByRole('table', { name: 'Recent transactions' });
  await expect(recentTransactions.getByRole('row', { name: new RegExp(description) })).toBeVisible();
});

Then('I should see the account row for {string}', async function (accountName) {
  const accountsTable = page.getByRole('table', { name: 'Accounts' });
  await expect(accountsTable.getByRole('row', { name: new RegExp(accountName) })).toBeVisible();
});

Then('I should see the transfer form fields', async function () {
  const transfer = new TransferPage(page);
  await transfer.expectForm();
});

Then('I should see the send money form fields', async function () {
  const sendMoney = new SendMoneyPage(page);
  await sendMoney.expectForm();
});

Then('I should see the bill pay form fields', async function () {
  const billPay = new BillPayPage(page);
  await billPay.expectForm();
});

Then('I should see the loan application history', async function () {
  const loans = new ApplyLoanPage(page);
  await loans.expectLoanHistory();
});
