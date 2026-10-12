# BP Project

A local Express + Playwright bank demo with page-object tests and a Cucumber BDD suite for the SecureBank flows.

## Getting started

```bash
npm install
npm run test:e2e:install
npm start
npm run test:bdd
```

The app runs locally at <http://localhost:3000/bank/> and exercises the bank flows in the bundled `public/app.js` UI. Shared test settings and credentials are in `config/test-config.js`. Set `QA_BANK_USERNAME` and `QA_BANK_PASSWORD` to override the default demo account.

## Available scripts

- `npm start` - run the Express starter app at <http://localhost:3000>
- `npm run dev` - run the Express app with file watching
- `npm run test:bdd` - run the Cucumber feature suite under `tests/features`
- `npm run test:e2e` - run the Playwright suite in all configured browsers
- `npm run test:e2e:chrome` - run all tests in Google Chrome
- `npm run test:e2e:edge` - run all tests in Microsoft Edge
- `npm run test:e2e:headed` - run tests with visible browser windows
- `npm run test:e2e:install` - install the Playwright browser runtime
- `npm test` - syntax check the Express server

## API

- `GET /api/health` returns a JSON status payload.

## Test artifacts

Playwright writes HTML reports to `playwright-report/` and failure artifacts to `test-results/`.
