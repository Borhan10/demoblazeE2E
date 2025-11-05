## Demoblaze E2E with Cypress – Beginner-Friendly Setup and Usage

This guide walks you through setting up Cypress from scratch on macOS/Windows/Linux and running the Demoblaze E2E tests (Login and Purchase) via `package.json` scripts. No prior Cypress experience needed.

### 1) Prerequisites

- **Node.js**: Install the Node from `https://nodejs.org` (verify with `node -v` and `npm -v`).
- **Git** (optional): Install from `https://git-scm.com` if you plan to clone the repo.

### 2) Get the project

Option A – clone the repository:

```bash
git clone <your-repo-url>
cd demoblazeE2E
```

Option B – download the project as a ZIP, unzip it, then open a terminal in the folder.

### 3) Install dependencies

```bash
npm install
```

This installs Cypress which is already listed in `package.json`.

### 4) Project structure (key folders)

- `cypress/e2e/`: your test specs (`*.cy.js`)
- `cypress/pages/`: Page Objects (e.g., `loginPage.js`)
- `cypress/support/`: commands and support setup
- `cypress/fixtures/`: test data (e.g., `user.js`)
- `cypress.config.js`: Cypress configuration

### 5) First run – open Cypress app (optional but recommended)

```bash
npx cypress open
```

This launches the Cypress app so you can run tests interactively and see the browser.

### 6) Running from the command line

The repository includes npm scripts to run tests headlessly using Chrome. From the project root:

- Run all specs in `cypress/e2e`:

```bash
npm run allTests
```

- Run only Login tests:

```bash
npm run loginTests
```

- Run only Purchase tests:

```bash
npm run purchaseTests
```

These scripts call Cypress like:

```bash
cypress run --browser chrome --spec 'cypress/e2e/<pattern>.cy.js'
```

### 7) Where do the Login and Purchase specs live?

- By convention, create these files so the scripts above work out-of-the-box:
  - `cypress/e2e/login.cy.js`
  - `cypress/e2e/purchase.cy.js`

If your project currently has a single spec (e.g., `cypress/e2e/spec.cy.js`), you can either:

- Move/split the relevant tests into `login.cy.js` and `purchase.cy.js`, or
- Temporarily change the scripts in `package.json` to point to your actual file name.

### 8) Useful tips

- Base URL is configured in `cypress.config.js` as `https://www.demoblaze.com` so tests can just `cy.visit('/')`.
- Test data lives in `cypress/fixtures/user.js`.
- Custom commands live in `cypress/support/commands.js`.
- If a spec name changes, update the `--spec` path in `package.json` scripts.

### 9) Findings and Issues in Demoblaze Website

During test execution, the following bugs and issues were identified in the Demoblaze:

- **Bug in Laptop Selection**: When selecting a laptop product, there is no visual indication (highlighting or selection marker) on the UI to assert that the item was selected. The only way to verify the selection is through API assertion that confirms the item contains "notebook". This makes it difficult to perform UI-based assertions for product selection.

- **Bug in Purchase Alert Date**: After completing all fields in the purchase form and submitting, the alert message displays a date that is one month before the current date. This is a date calculation or display bug in the checkout completion flow.

- **Empty Basket Checkout Bug**: The website allows users to proceed with checkout even when the basket is empty. This is a validation issue that should prevent checkout attempts when there are no items in the cart.

- **Missing validation over the place order form**: There are no validation over any field of the place order form such card number field accept strings and so on


### 10) what did you consider essential to test, and why?

#### Login/Authentication Tests

The login test suite covers these cases:

1. **Successful Login / logout** **Why?** - Happy scenario that verifies valid credentials work and the user sees a welcome message, critical for core functionality.

2. **Invalid Username** **Why?** - Ensures the system rejects non existent users and displays right error messages to increase the trust in the security for the website 

3. **Invalid Password** **Why?** - Validates that invalid passwords are rejected even when the username valid, preventing hack attempts.

4. **Empty Fields Validation** **Why?** - Validates that user can't access the account without data ensure the security and prevent hack attempts 


#### Purchase/Checkout Tests

The purchase test suite covers these cases:

1. **Single Product Purchase (Happy Path)** **Why?** Its the Core business flow as it verifies the end to end purchase flow from product selection to successful order confirmation also including product details verification, cart validation, and payment processing.

2. **Multiple Products Purchase** **Why?** - Real world scenario that tests cart functionality with multiple items, to verify correct total calculation and that all products are processed correctly.

3. **Empty Cart Validation** **Why?** - Edge case and business logic, that prevents checkout attempts with no items, protecting against data inconsistencies 

4. **Invalid Card Number/ Expired Card Validation** **Why?** - Payment validation to verifies the system checks card number / expiration dates, a critical requirement for payment processing completion.

5. **Missing Form Fields** **Why?**- Input validation to Confirms required fields are validated before submission, preventing incomplete orders and data quality issues.

6. **Purchase Without Login** **Why?** - Security and authorization to ensures users must be authenticated before completing purchases, protecting against unauthorized transactions.

### 11) How did you design the tests, and why?

**Page Object Model (POM) Pattern**: Each page (`loginPage`, `cartPage`, `homePage`, etc.) is a class with reusable methods. This separates test logic from page interactions, making tests maintainable and readable. If UI elements change, updates are made in one place.

**Test Data Separation**: All test data (users, products, cards) is stored in `cypress/fixtures/userData.js`. This centralizes data management, enables easy data-driven testing, and keeps tests focused on behavior rather than hardcoded values.

**Reusable Verification Methods**: Methods like `verifyProductsInCart()` and `verifyTotalPrice()` encapsulate complex assertions and reduces code duplication.

**Alert Stubbing Strategy**: Window alerts are stubbed using `cy.stub()` to capture and verify alert messages. 



### 12) Development Notes

**Note**: 

- The README.md file improved using chatGpt  

- cart page method `verifyProductsInCart` and Alert messages verification by `stubbing` were improved using Cursor.