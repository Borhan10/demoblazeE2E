class productDetailsPage {
  productTitle = 'h2[class*="name"]';
  productPrice = 'h3[class*="price"]';
  addToCartButton = 'a[class*="btn btn-success"]';

  verifyProductName(productName) {
    cy.contains(this.productTitle, productName).should('be.visible');
  }

  verifyProductPrice(productPrice) {
    cy.contains(this.productPrice, productPrice).should('be.visible');
  }

  verifyAddToCartMessage() {
    // Assert that alert was called and check its text
    cy.get('@alert').should('be.called');

    cy.get('@alert').then((stub) => {
      const text = stub.getCall(0).args[0];
      expect(text).to.contain('Product added');
    });
  }

  addToCart() {
    // Stub the alert before clicking the button
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });
    cy.get(this.addToCartButton).click();
  }
}

export default productDetailsPage;
