class homePage {
  navigationBar = '#navbarExample';
  cart = '#cartur';
  categoryList = '.list-group a';
  loginHyperText = '#login2';
  loginModal = '#logInModal';
  productModal = '.hrefch';

  visit() {
    cy.visit('/');
    cy.get(this.navigationBar).should('be.visible');
  }

  openLoginModal() {
    cy.get(this.loginHyperText).click();
    cy.get(this.loginModal).should('be.visible');
  }

  waitGetCategories(alias) {
    cy.wait(`@${alias}`).then((interception) => {
      expect(interception.request.body).to.deep.equal({ cat: 'notebook' });
    });
  }
  waitCartRequest(alias) {
    cy.wait(`@${alias}`).its('response.statusCode').should('eq', 200);
  }

  selectProductByName(name) {
    cy.contains(this.productModal, name).click();
  }
  categorySelect(category) {
    cy.contains(this.categoryList, category).click();
  }
  selectCart() {
    cy.get(this.cart).click();
  }
}

export default homePage;
