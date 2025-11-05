// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

// cypress/support/commands.js
import { userData } from '../fixtures/userData';
import loginPage from '../pages/loginPage';
import homePage from '../pages/homePage';

const homeObject = new homePage();
const loginObject = new loginPage();
Cypress.Commands.add('uiLoginAndCache', () => {
  cy.session(
    `session-${userData.existingUser.username}`,
    () => {
      cy.visit('/');
      homeObject.openLoginModal();
      loginObject.login(
        userData.existingUser.username,
        userData.existingUser.password
      );
      loginObject.verifyLoginSuccess(userData.existingUser.username);
      cy.getCookie('tokenp_')
        .should('exist')
        .then((cookie) => {
          Cypress.env('AUTH_TOKEN', cookie?.value);
          cy.setCookie('tokenp_', cookie?.value); // Ensure cookie is set for future requests
          cy.window().then((win) => {
            win.localStorage.setItem('authToken', cookie?.value);
          });
        });
    },
    {
      cacheAcrossSpecs: true,
    }
  );
});
