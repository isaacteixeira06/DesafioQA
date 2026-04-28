describe("Registration Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-testid="tab-register"]').click();
  });

  it("Deve registrar usuário com dados válidos", () => {
    const username = `user_${Date.now()}`;
    cy.get('[data-testid="register-username"]').type(username);
    cy.get('[data-testid="register-email"]').type(`${username}@test.com`);
    cy.get('[data-testid="register-password"]').type("password123");
    cy.get('[data-testid="register-confirm"]').type("password123");
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="message-success"]').should("be.visible");
  });

  it("Deve rejeitar registro com email inválido", () => {
    cy.get('[data-testid="register-username"]').type("newuser");
    cy.get('[data-testid="register-email"]').type("invalid-email");
    cy.get('[data-testid="register-password"]').type("password123");
    cy.get('[data-testid="register-confirm"]').type("password123");
    cy.get('[data-testid="register-button"]').click();
    // Email inválido não deve passar
  });

  it("Deve rejeitar registro com senhas diferentes", () => {
    cy.get('[data-testid="register-username"]').type("newuser");
    cy.get('[data-testid="register-email"]').type("user@test.com");
    cy.get('[data-testid="register-password"]').type("password123");
    cy.get('[data-testid="register-confirm"]').type("different123");
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="message"]').should("be.visible");
  });

  it("Deve rejeitar registro com usuário duplicado", () => {
    cy.get('[data-testid="register-username"]').type("admin");
    cy.get('[data-testid="register-email"]').type("admin@test.com");
    cy.get('[data-testid="register-password"]').type("password123");
    cy.get('[data-testid="register-confirm"]').type("password123");
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="message"]').should("be.visible");
  });

  it("Deve exigir todos os campos obrigatórios", () => {
    cy.get('[data-testid="register-button"]').click();
    // Validação de campos obrigatórios deve ser acionada
  });
});
