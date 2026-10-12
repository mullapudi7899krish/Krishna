const testConfig = {
  baseURL: 'http://localhost:3000/bank/',
  credentials: {
    username: process.env.QA_BANK_USERNAME ?? 'standard_user',
    password: process.env.QA_BANK_PASSWORD ?? 'bank_sauce',
  },
  viewport: {
    width: 1440,
    height: 1000,
  },
};

module.exports = { testConfig };
