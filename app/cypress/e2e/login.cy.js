import LoginPage from "./pages/LoginPage";

describe("Login Tests", () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  it("Deve fazer login com credenciais válidas", () => {
    LoginPage.login("admin", "admin123");
    cy.url().should("include", "/dashboard");
  });

  it("Deve rejeitar login com senha inválida", () => {
    LoginPage.login("admin", "wrongpassword");
    cy.get('[data-testid="message"]').should("be.visible");
  });

  it("Deve rejeitar login com usuário inexistente", () => {
    LoginPage.login("nonexistent", "password");
    cy.get('[data-testid="message"]').should("be.visible");
  });

  it("Deve exigir username para login", () => {
    LoginPage.enterPassword("password");
    LoginPage.clickLoginButton();
    // Verificar validação de formulário
    cy.get('[data-testid="login-username"]').should("have.attr", "required");
  });

  it("Deve exigir password para login", () => {
    LoginPage.enterUsername("admin");
    LoginPage.clickLoginButton();
    // Verificar validação de formulário
    cy.get('[data-testid="login-password"]').should("have.attr", "required");
  });

  it("Não deve permitir injeção SQL no campo username", () => {
    LoginPage.login("admin' OR '1'='1", "any");
    cy.get('[data-testid="message"]').should("be.visible");
  });

  it("Não deve permitir login com espaços em branco", () => {
    LoginPage.login("   ", "   ");
    cy.get('[data-testid="message"]').should("be.visible");
  });
});
