import {
  userData,
  products,
  categories,
  cards,
  oneProduct,
  twoProducts,
} from '../fixtures/userData';
import { interceptrequest } from '../support/utils';
import homePage from '../pages/homePage';
import cartPage from '../pages/cartPage';
import loginPage from '../pages/loginPage';
import productDetailsPage from '../pages/productDetailsPage';

const homeObject = new homePage();
const cartObject = new cartPage();
const loginObject = new loginPage();
const productDetailsObject = new productDetailsPage();

describe('Demoblaze Purchase Flow - POM (All Test Cases)', () => {
  beforeEach(() => {
    homeObject.visit();
  });

  afterEach(() => {
    cy.getCookie('tokenp_', { timeout: 2000 })
      .then((cookie) => {
        const authToken = cookie?.value || Cypress.env('AUTH_TOKEN');

        if (!authToken) {
          cy.log('No auth token found, skipping cart cleanup');
          return null;
        }

        return cy.request({
          method: 'POST',
          url: 'https://api.demoblaze.com/viewcart',
          body: { cookie: authToken, flag: true },
          headers: { 'Content-Type': 'application/json' },
          failOnStatusCode: false,
        });
      })
      .then((response) => {
        if (!response) return;

        const items = response.body?.Items || [];

        if (items.length === 0) {
          cy.log('Cart is already empty');
          return;
        }
        cy.wrap(items).each((item) => {
          cy.request({
            method: 'POST',
            url: 'https://api.demoblaze.com/deleteitem',
            body: { id: item.id },
            headers: { 'Content-Type': 'application/json' },
            failOnStatusCode: false,
          }).then(() => {
            cy.log(`Deleted item with id: ${item.id}`);
          });
        });
      });
  });

  it('Verify that user can purchase one product successfully', () => {
    // Step 1: Verify user is logged in
    loginObject.verifyLoginSuccess(userData.existingUser.username);

    // Step 2: Navigate to product and verify details
    interceptrequest('POST', 'bycat', 'getCategories');
    homeObject.categorySelect(categories.laptops);
    homeObject.waitGetCategories('getCategories');
    homeObject.selectProductByName(products.laptops.MacBook_Pro.name);
    productDetailsObject.verifyProductName(products.laptops.MacBook_Pro.name);
    productDetailsObject.verifyProductPrice(products.laptops.MacBook_Pro.price);

    // Step 3: Add product to cart
    productDetailsObject.addToCart();

    // Step 4: Verify cart contents and proceed to checkout
    homeObject.selectCart();
    cartObject.verifyProductsInCart(oneProduct);
    cartObject.verifyTotalPrice(oneProduct);
    cartObject.placeOrder();

    // Step 5: Fill purchase form with valid data
    cartObject.fillPurchaseForm({
      name: userData.name,
      country: userData.country,
      city: userData.city,
      card: cards.valid.number,
      month: cards.valid.month,
      year: cards.valid.year,
    });

    // Step 6: Complete purchase and verify success
    cartObject.confirmPurchase();
    cartObject.verifyPurchaseSuccess();
  });

  it('Verify that user can purchase multiple products successfully', () => {
    loginObject.verifyLoginSuccess(userData.existingUser.username);
    interceptrequest('POST', 'bycat', 'getCategories');
    homeObject.categorySelect(categories.laptops);
    homeObject.waitGetCategories('getCategories');
    homeObject.selectProductByName(products.laptops.MacBook_Pro.name);
    productDetailsObject.addToCart();
    cy.visit('/');
    homeObject.categorySelect(categories.laptops);
    homeObject.selectProductByName(products.laptops.MacBook_air.name);
    productDetailsObject.addToCart();
    homeObject.selectCart();
    cartObject.verifyProductsInCart(twoProducts);
    cartObject.verifyTotalPrice(twoProducts);
    cartObject.placeOrder();
    cartObject.fillPurchaseForm({
      name: userData.name,
      country: userData.country,
      city: userData.city,
      card: cards.valid.number,
      month: cards.valid.month,
      year: cards.valid.year,
    });
    cartObject.confirmPurchase();
    cartObject.verifyPurchaseSuccess();
  });

  it('Verify that empty cart disables Place Order', () => {
    homeObject.selectCart();
    cartObject.placeOrder();
    cartObject.verifyEmptyCartError();
  });

  it('Verify that purchase is rejected with invalid card', () => {
    loginObject.verifyLoginSuccess(userData.existingUser.username);
    interceptrequest('POST', 'bycat', 'getCategories');
    homeObject.categorySelect(categories.laptops);
    homeObject.waitGetCategories('getCategories');
    homeObject.selectProductByName(products.laptops.MacBook_Pro.name);
    productDetailsObject.verifyProductName(products.laptops.MacBook_Pro.name);
    productDetailsObject.verifyProductPrice(products.laptops.MacBook_Pro.price);
    productDetailsObject.addToCart();
    homeObject.selectCart();
    cartObject.verifyProductsInCart(oneProduct);
    cartObject.verifyTotalPrice(oneProduct);
    cartObject.placeOrder();

    // Step 5: Fill form with invalid card number
    cartObject.fillPurchaseForm({
      name: userData.name,
      country: userData.country,
      city: userData.city,
      card: cards.invalid.number,
      month: cards.valid.month,
      year: cards.valid.year,
    });

    // Step 6: Attempt purchase and verify error
    cartObject.confirmPurchase();
    cartObject.verifyFormError();
  });

  it('Verify that purchase is rejected with expired card', () => {
    // Step 1: Verify user is logged in
    loginObject.verifyLoginSuccess(userData.existingUser.username);

    // Step 2: Navigate to product and verify details
    interceptrequest('POST', 'bycat', 'getCategories');
    homeObject.categorySelect(categories.laptops);
    homeObject.waitGetCategories('getCategories');
    homeObject.selectProductByName(products.laptops.MacBook_Pro.name);
    productDetailsObject.verifyProductName(products.laptops.MacBook_Pro.name);
    productDetailsObject.verifyProductPrice(products.laptops.MacBook_Pro.price);

    // Step 3: Add product to cart
    productDetailsObject.addToCart();

    // Step 4: Verify cart and proceed to checkout
    homeObject.selectCart();
    cartObject.verifyProductsInCart(oneProduct);
    cartObject.verifyTotalPrice(oneProduct);
    cartObject.placeOrder();

    // Step 5: Fill form with expired card (invalid year)
    cartObject.fillPurchaseForm({
      name: userData.name,
      country: userData.country,
      city: userData.city,
      card: cards.valid.number,
      month: cards.valid.month,
      year: cards.invalid.year,
    });

    // Step 6: Attempt purchase and verify error
    cartObject.confirmPurchase();
    cartObject.verifyFormError();
  });

  it('Verify that purchase is blocked when fields are missing', () => {
    loginObject.verifyLoginSuccess(userData.existingUser.username);
    interceptrequest('POST', 'bycat', 'getCategories');
    homeObject.categorySelect(categories.laptops);
    homeObject.waitGetCategories('getCategories');
    homeObject.selectProductByName(products.laptops.MacBook_Pro.name);
    productDetailsObject.verifyProductName(products.laptops.MacBook_Pro.name);
    productDetailsObject.verifyProductPrice(products.laptops.MacBook_Pro.price);
    productDetailsObject.addToCart();
    productDetailsObject.verifyAddToCartMessage();
    homeObject.selectCart();
    cartObject.verifyProductsInCart(oneProduct);
    cartObject.verifyTotalPrice(oneProduct);
    cartObject.placeOrder();
    cartObject.confirmPurchase();
    cartObject.verifyEmptyFormError();
  });

  it('Verify that user cannot purchase without login', () => {
    loginObject.logout();
    loginObject.verifyLogoutSuccess();
    cy.wait(10000);
    interceptrequest('POST', 'bycat', 'getCategories');
    homeObject.categorySelect(categories.laptops);
    homeObject.waitGetCategories('getCategories');
    homeObject.selectProductByName(products.laptops.MacBook_Pro.name);
    productDetailsObject.verifyProductName(products.laptops.MacBook_Pro.name);
    productDetailsObject.verifyProductPrice(products.laptops.MacBook_Pro.price);
    productDetailsObject.addToCart();
    homeObject.selectCart();
    cartObject.verifyProductsInCart(oneProduct);
    cartObject.verifyTotalPrice(oneProduct);
    cartObject.placeOrder();
    cartObject.fillPurchaseForm({
      name: userData.name,
      country: userData.country,
      city: userData.city,
      card: cards.valid.number,
      month: cards.valid.month,
      year: cards.valid.year,
    });
    cartObject.confirmPurchase();
    cartObject.verifyLoginError();
  });
});
