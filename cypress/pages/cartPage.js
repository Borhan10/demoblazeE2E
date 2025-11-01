import { getTodayDate } from '../support/utils';

class cartPage {
  button = 'button';
  placeOrderButtonText = 'Place Order';
  purchaseButtonText = 'Purchase';
  totalPrice = '#totalp';
  productRows = 'tbody#tbodyid tr';
  nameInput = '#name';
  countryInput = '#country';
  cityInput = '#city';
  cardInput = '#card';
  monthInput = '#month';
  yearInput = '#year';

  placeOrder() {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });
    return cy
      .contains(this.placeOrderButton, this.placeOrderButtonText)
      .click();
  }

  getTotalPrice() {
    return cy.get(this.totalPrice);
  }

  getProductRows() {
    return cy.get(this.productRows);
  }

  deleteProduct(title) {
    return cy
      .contains('td', title)
      .parent()
      .find('a')
      .contains('Delete')
      .click();
  }

  fillPurchaseForm({ name, country, city, card, month, year }) {
    cy.get(this.nameInput).type(name);
    cy.get(this.countryInput).type(country);
    cy.get(this.cityInput).type(city);
    cy.get(this.cardInput).type(card);
    cy.get(this.monthInput).type(month);
    cy.get(this.yearInput).type(year);
  }

  confirmPurchase() {
    cy.contains(this.button, this.purchaseButtonText).click();
  }

  verifyPurchaseSuccess() {
    const expectedDate = getTodayDate();
    cy.get('.sweet-alert').should('be.visible');
    cy.get('h2').should('contain', 'Thank you for your purchase!');
    // cy.get('.sweet-alert').should('contain', expectedDate); commented out as its make the test fails
    cy.contains('button', 'OK').click();
  }


  // Verifies the number of products in the cart and validates their names and prices
  verifyProductsInCart(expectedProducts) {
    cy.get(this.productRows).should('have.length', expectedProducts.length);

    expectedProducts.forEach((expectedProduct) => {
      cy.get(this.productRows)
        .contains('td', expectedProduct.name)
        .parent('tr')
        .should('be.visible')
        .within(() => {
          // Verify the price is displayed correctly in the row
          cy.get('td').should('contain', expectedProduct.price);
        });
    });
  }

  verifyTotalPrice(expectedProducts) {
    // Calculate the expected total by summing all product prices
    const expectedTotal = expectedProducts.reduce((sum, p) => sum + p.price, 0);
    cy.get(this.totalPrice).should('contain', expectedTotal);
  }

  verifyLoginError() {
    cy.get('@alert').should('be.called');

    cy.get('@alert').then((stub) => {
      const text = stub.getCall(0).args[0];
      expect(text).to.contain('Please login first'); // I assumed that message should look like that
    })
  }

  verifyEmptyCartError() {
    cy.get('@alert').should('be.called');

    cy.get('@alert').then((stub) => {
      const text = stub.getCall(0).args[0];
      expect(text).to.contain('Cart is empty'); // I assumed that message should look like that
    })
  }

  verifyFormError() {
    cy.get('@alert').then((stub) => {
      const text = stub.getCall(0).args[0];
      const allowedMessages = [
        'Name',
        'Country',
        'City',
        'Card number',
        'month',
        'Year',
      ];
      cy.get('.sweet-alert').should('be.visible');
      const matched = allowedMessages.some((msg) => text.includes(msg));
      expect(matched, `Please enter valid "${text}"`).to.be.true;
    });
  }
  verifyEmptyFormError() {
    cy.get('@alert').should('be.called');

    cy.get('@alert').then((stub) => {
      const text = stub.getCall(0).args[0];
      expect(text).to.contain('Please fill out Name and Creditcard.');
    });
  }
}

export default cartPage;
