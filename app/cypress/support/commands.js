Cypress.Commands.add("login", (username, password) => {
  cy.visit("/");
  cy.get('[data-testid="login-username"]').type(username);
  cy.get('[data-testid="login-password"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

Cypress.Commands.add("register", (username, email, password) => {
  cy.visit("/");
  cy.get('[data-testid="tab-register"]').click();
  cy.get('[data-testid="register-username"]').type(username);
  cy.get('[data-testid="register-email"]').type(email);
  cy.get('[data-testid="register-password"]').type(password);
  cy.get('[data-testid="register-confirm"]').type(password);
  cy.get('[data-testid="register-button"]').click();
});

Cypress.Commands.add("logout", () => {
  cy.get('[data-testid="logout-button"]').click();
});
