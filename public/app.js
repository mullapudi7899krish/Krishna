const accounts = [
  { name: 'Everyday Checking', type: 'Checking', balance: '$4,250.00' },
  { name: 'High-Yield Savings', type: 'Savings', balance: '$12,800.00' },
  { name: 'Travel Fund', type: 'Savings', balance: '$1,250.00' },
];

const transactions = [
  { description: 'Whole Foods Market', type: 'debit', amount: '-$68.42', date: '2025-08-08' },
  { description: 'Direct Deposit', type: 'credit', amount: '+$2,400.00', date: '2025-08-07' },
  { description: 'Netflix', type: 'debit', amount: '-$15.99', date: '2025-08-05' },
  { description: 'Paycheck', type: 'credit', amount: '+$3,200.00', date: '2025-08-02' },
];

const loans = [
  { type: 'Auto Loan', amount: '$18,500', status: 'Approved' },
  { type: 'Home Improvement', amount: '$12,000', status: 'In review' },
];

const appRoot = document.getElementById('app');

const state = {
  authenticated: false,
  filter: 'all',
  search: '',
};

function normalizePath() {
  const pathname = window.location.pathname.replace(/\/+$/, '');
  if (!pathname || pathname === '/') {
    return '/bank/login';
  }
  return pathname.startsWith('/bank') ? pathname : `/bank${pathname}`;
}

function setRoute(path) {
  const nextPath = path.startsWith('/bank') ? path : `/bank${path}`;
  window.history.pushState({}, '', nextPath);
  render();
}

function renderShell(content) {
  return `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark">S</span>
          <span>SecureBank</span>
        </div>
        <nav class="nav" aria-label="Main navigation">
          <a href="/bank/dashboard">Dashboard</a>
          <a href="/bank/accounts">Accounts</a>
          <a href="/bank/transactions">Transactions</a>
          <a href="/bank/transfer">Transfer</a>
          <a href="/bank/send-money">Send Money</a>
          <a href="/bank/bill-pay">Bill Pay</a>
          <a href="/bank/apply-loan">Apply Loan</a>
        </nav>
      </header>
      <main class="page">${content}</main>
    </div>
  `;
}

function renderLogin() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <p class="eyebrow">SecureBank</p>
        <h1>Welcome back</h1>
        <p class="subtitle">Access your banking dashboard securely.</p>

        <form id="signInForm" aria-label="Sign in form" class="form-grid">
          <div class="field">
            <label for="username">Username</label>
            <input id="username" name="username" type="text" placeholder="Enter username" />
          </div>

          <div class="field">
            <div class="label-row">
              <label for="password">Password</label>
              <button type="button" class="ghost-btn password-toggle" id="togglePasswordBtn">Show password</button>
            </div>
            <input id="password" name="password" type="password" placeholder="Enter password" />
          </div>

          <button type="submit" class="primary-btn">Sign in</button>
          <p id="loginError" class="error-message" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `;
}

function renderDashboard() {
  return renderShell(`
    <section>
      <h1>Welcome back, Alex</h1>
      <div class="summary-grid">
        <div class="summary-card">
          <div class="muted">Available balance</div>
          <div class="balance-display">$17,050.00</div>
        </div>
        <div class="summary-card">
          <div class="muted">Monthly income</div>
          <div class="balance-display">$4,900.00</div>
        </div>
        <div class="summary-card">
          <div class="muted">Bills due</div>
          <div class="balance-display">$1,280.00</div>
        </div>
      </div>

      <section class="panel" aria-label="Quick actions">
        <h2>Quick actions</h2>
        <div class="quick-actions">
          <a class="quick-action" href="/bank/transfer">Transfer Money</a>
          <a class="quick-action" href="/bank/send-money">Send Money</a>
          <a class="quick-action" href="/bank/bill-pay">Pay a Bill</a>
          <a class="quick-action" href="/bank/apply-loan">Apply for Loan</a>
        </div>
      </section>

      <div class="panel" style="margin-top: 24px;">
        <h2>Recent activity</h2>
        <table aria-label="Recent transactions">
          <thead>
            <tr>
              <th>Description</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map((transaction) => `
              <tr>
                <td>${transaction.description}</td>
                <td>${transaction.date}</td>
                <td><span class="status-pill">${transaction.type === 'credit' ? 'Credit' : 'Debit'}</span></td>
                <td>${transaction.amount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `);
}

function renderAccounts() {
  return renderShell(`
    <section>
      <h1>My Accounts</h1>
      <table aria-label="Accounts">
        <thead>
          <tr>
            <th>Account</th>
            <th>Type</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          ${accounts.map((account) => `
            <tr>
              <td>${account.name}</td>
              <td>${account.type}</td>
              <td>${account.balance}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top: 18px;">
        <button class="primary-btn" type="button">Add Account</button>
      </div>
    </section>
  `);
}

function renderTransactions() {
  const visibleTransactions = transactions.filter((transaction) => {
    const matchesType = state.filter === 'all' || transaction.type === state.filter;
    const matchesSearch = transaction.description.toLowerCase().includes(state.search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return renderShell(`
    <section>
      <h1>Transactions</h1>
      <div class="inline-actions" style="margin-bottom: 20px;">
        <label style="display: grid; gap: 8px; min-width: 220px; flex: 1;">
          Search
          <input id="transactionSearch" type="text" value="${state.search}" aria-label="Search" placeholder="Search transactions" />
        </label>
        <button type="button" class="secondary-btn ${state.filter === 'all' ? 'is-active' : ''}" data-filter="all">All</button>
        <button type="button" class="secondary-btn ${state.filter === 'credit' ? 'is-active' : ''}" data-filter="credit">Credits</button>
        <button type="button" class="secondary-btn ${state.filter === 'debit' ? 'is-active' : ''}" data-filter="debit">Debits</button>
      </div>
      <table aria-label="All account transactions">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${visibleTransactions.map((transaction) => `
            <tr>
              <td>${transaction.description}</td>
              <td>${transaction.date}</td>
              <td>${transaction.type === 'credit' ? 'Credit' : 'Debit'}</td>
              <td>${transaction.amount}</td>
            </tr>
          `).join('') || '<tr><td colspan="4">No transactions match your filters.</td></tr>'}
        </tbody>
      </table>
    </section>
  `);
}

function renderTransferForm() {
  return renderShell(`
    <section class="form-card">
      <h1>Transfer Money</h1>
      <div class="form-grid">
        <div class="field">
          <label for="fromAccount">From Account</label>
          <select id="fromAccount" aria-label="From Account">
            <option>Everyday Checking</option>
            <option>High-Yield Savings</option>
          </select>
        </div>
        <div class="field">
          <label for="toAccount">To Account</label>
          <select id="toAccount" aria-label="To Account">
            <option>High-Yield Savings</option>
            <option>Everyday Checking</option>
          </select>
        </div>
        <div class="field">
          <label for="transferAmount">Amount</label>
          <input id="transferAmount" type="number" min="0" step="0.01" aria-label="Amount" placeholder="0.00" />
        </div>
        <button type="button" class="primary-btn">Review Transfer</button>
      </div>
    </section>
  `);
}

function renderSendMoneyForm() {
  return renderShell(`
    <section class="form-card">
      <h1>Send Money</h1>
      <div class="form-grid">
        <div class="field">
          <label for="payFromAccount">From Account</label>
          <select id="payFromAccount" aria-label="From Account">
            <option>Everyday Checking</option>
            <option>High-Yield Savings</option>
          </select>
        </div>
        <div class="field">
          <label for="payee">Payee</label>
          <select id="payee" aria-label="Payee">
            <option>Alex Morgan</option>
            <option>Northside Rent</option>
          </select>
        </div>
        <div class="field">
          <label for="sendAmount">Amount</label>
          <input id="sendAmount" type="number" min="0" step="0.01" aria-label="Amount" placeholder="0.00" />
        </div>
        <button type="button" class="primary-btn">Review &amp; Send</button>
      </div>
    </section>
  `);
}

function renderBillPayForm() {
  return renderShell(`
    <section class="form-card">
      <h1>Pay a Bill</h1>
      <div class="form-grid">
        <div class="field">
          <label for="billFromAccount">From Account</label>
          <select id="billFromAccount" aria-label="From Account">
            <option>Everyday Checking</option>
            <option>High-Yield Savings</option>
          </select>
        </div>
        <div class="field">
          <label for="biller">Biller</label>
          <select id="biller" aria-label="Biller">
            <option>City Utilities</option>
            <option>Internet Provider</option>
          </select>
        </div>
        <div class="field">
          <label for="billAmount">Amount</label>
          <input id="billAmount" type="number" min="0" step="0.01" aria-label="Amount" placeholder="0.00" />
        </div>
        <div class="field">
          <label for="paymentDate">Payment Date</label>
          <input id="paymentDate" type="text" aria-label="Payment Date" placeholder="MM/DD/YYYY" />
        </div>
        <button type="button" class="primary-btn">Review Payment</button>
      </div>
    </section>
  `);
}

function renderLoanPage() {
  return renderShell(`
    <section>
      <h1>Apply for a Loan</h1>
      <table aria-label="Applied loans history">
        <thead>
          <tr>
            <th>Loan Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${loans.map((loan) => `
            <tr>
              <td>${loan.type}</td>
              <td>${loan.amount}</td>
              <td><span class="status-pill">${loan.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="inline-actions" style="margin-top: 16px;">
        <button type="button" class="primary-btn">Apply for Loan</button>
        <button type="button" class="ghost-btn">Reset</button>
      </div>
    </section>
  `);
}

function renderPage() {
  const path = normalizePath();

  if (path === '/bank/login') {
    return renderLogin();
  }

  if (!state.authenticated && path !== '/bank/login') {
    window.history.replaceState({}, '', '/bank/login');
    return renderLogin();
  }

  const routeMap = {
    '/bank/dashboard': renderDashboard,
    '/bank/accounts': renderAccounts,
    '/bank/transactions': renderTransactions,
    '/bank/transfer': renderTransferForm,
    '/bank/send-money': renderSendMoneyForm,
    '/bank/bill-pay': renderBillPayForm,
    '/bank/apply-loan': renderLoanPage,
  };

  return routeMap[path] ? routeMap[path]() : renderDashboard();
}

function attachLoginHandlers() {
  const form = document.getElementById('signInForm');
  const toggleButton = document.getElementById('togglePasswordBtn');
  const passwordInput = document.getElementById('password');
  const errorBox = document.getElementById('loginError');

  if (!form || !toggleButton || !passwordInput || !errorBox) {
    return;
  }

  toggleButton.addEventListener('click', () => {
    const shouldShow = passwordInput.type === 'password';
    passwordInput.type = shouldShow ? 'text' : 'password';
    toggleButton.textContent = shouldShow ? 'Hide password' : 'Show password';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value.trim();

    if (username === 'standard_user' && password === 'bank_sauce') {
      state.authenticated = true;
      window.history.pushState({}, '', '/bank/dashboard');
      render();
      return;
    }

    errorBox.textContent = 'Invalid username or password. Please try again.';
  });
}

function attachTransactionHandlers() {
  const searchInput = document.getElementById('transactionSearch');
  const filterButtons = document.querySelectorAll('[data-filter]');

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      state.search = event.target.value;
      render();
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.filter = button.getAttribute('data-filter');
      render();
    });
  });
}

function bindGlobalHandlers() {
  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = event.currentTarget.getAttribute('href');
      if (!href || !href.startsWith('/bank')) {
        return;
      }
      event.preventDefault();
      window.history.pushState({}, '', href);
      render();
    });
  });
}

function render() {
  if (!appRoot) {
    return;
  }

  appRoot.innerHTML = renderPage();
  attachLoginHandlers();
  attachTransactionHandlers();
  bindGlobalHandlers();
}

window.addEventListener('popstate', render);
render();
