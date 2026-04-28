class LoginPage {
  visit() {
    cy.visit("/");
  }

  enterUsername(username) {
    cy.get('[data-testid="login-username"]').type(username);
  }

  enterPassword(password) {
    cy.get('[data-testid="login-password"]').type(password);
  }

  clickLoginButton() {
    cy.get('[data-testid="login-button"]').click();
  }

  clickRegisterTab() {
    cy.get('[data-testid="tab-register"]').click();
  }

  clickResetTab() {
    cy.get('[data-testid="tab-reset"]').click();
  }

  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
  }

  getErrorMessage() {
    return cy.get('[data-testid="message-error"]');
  }

  getSuccessMessage() {
    return cy.get('[data-testid="message-success"]');
  }
}

export default new LoginPage();
