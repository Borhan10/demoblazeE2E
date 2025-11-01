class loginPage {
  usernameInputElement = '#loginusername';
  passwordInputElement = '#loginpassword';
  loginModalButtons = '#logInModal button';
  loginHyperlink = '#login2';
  logoutHyperlink = '#logout2';
  loginText = 'Log in';
  closeText = 'Close';
  usernameDisplayElement = '#nameofuser';

  typeUsername(username) {
    return cy
      .get(this.usernameInputElement)
      .clear()
      .type(username, { delay: 100, force: true });
  }

  typePassword(password) {
    return cy
      .get(this.passwordInputElement)
      .clear()
      .type(password, { delay: 100, force: true });
  }

  pressLogin() {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });
    return cy.get(this.loginModalButtons).contains(this.loginText).click();
  }

  closeLoginModal() {
    return cy.get(this.loginModalButtons).contains(this.closeText);
  }

  login(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.pressLogin();
  }

  logout() {
    cy.get(this.logoutHyperlink).click();
  }

  verifyLoginSuccess(username) {
    cy.get(this.usernameDisplayElement).should(
      'contain',
      `Welcome ${username}`
    );
  }

  verifyLoginError() {
    cy.get('@alert').should('be.called');

    cy.get('@alert').then((stub) => {
      const text = stub.getCall(0).args[0];
      const allowedMessages = [
        'Wrong password',
        'User does not exist',
        'Please fill out Username and Password',
      ];
      const matched = allowedMessages.some((msg) => text.includes(msg));
      expect(matched, `Unexpected alert text: "${text}"`).to.be.true;
    });
  }

  verifyLogoutSuccess() {
    cy.get(this.loginHyperlink).should('be.visible');
    cy.contains(this.loginHyperlink, this.loginText).should('be.visible');
  }
}

export default loginPage;
