class ForgotPasswordPage {

  // ─── Seletores ──────────────────────────────────────────────────────────────

  get inputUsuario() {
    return cy.get('[data-testid="reset-username"]');
  }

  get inputNovaSenha() {
    return cy.get('[data-testid="reset-password"]');
  }

  get btnResetar() {
    return cy.get('[data-testid="reset-button"]');
  }

  get msgRetorno() {
    return cy.get('#resetMessage');
  }

  get linkVoltarLogin() {
    return cy.get('p.link-text a');
  }

  // ─── Ações ──────────────────────────────────────────────────────────────────

  acessarPagina() {
    cy.visit('/#');
    // Aguarda o form de reset estar visível
    cy.get('#resetPasswordForm').should('have.css', 'display', 'block');
  }

  acessarViaLink() {
    cy.visit('/');
    cy.contains('Esqueceu sua senha?').click();
    cy.get('#resetPasswordForm').should('have.css', 'display', 'block');
  }

  preencherUsuario(usuario: string) {
    this.inputUsuario.clear();
    if (usuario) {
      this.inputUsuario.type(usuario);
    }
  }

  preencherNovaSenha(senha: string) {
    this.inputNovaSenha.clear();
    if (senha) {
      this.inputNovaSenha.type(senha, { log: false });
    }
  }

  clicarResetar() {
    this.btnResetar.click();
  }

  voltarAoLogin() {
    this.linkVoltarLogin.click();
  }

  resetarSenha(usuario: string, novaSenha: string) {
    this.preencherUsuario(usuario);
    this.preencherNovaSenha(novaSenha);
    this.clicarResetar();
  }

  // ─── Interceptações ─────────────────────────────────────────────────────────

  interceptarReset() {
    cy.intercept('POST', '/reset-password').as('resetRequest');
  }

  // ─── Asserções de resposta de rede ──────────────────────────────────────────

  validarRespostaSucesso() {
    cy.wait('@resetRequest').its('response.statusCode').should('eq', 200);
  }

  validarRespostaErro() {
    cy.wait('@resetRequest')
      .its('response.statusCode')
      .should('be.oneOf', [400, 401, 403, 404]);
  }

  // ─── Asserções de UI ────────────────────────────────────────────────────────

  verificarMensagemSucessoVisivel() {
    cy.get('#resetMessage', { timeout: 6000 })
      .invoke('text')
      .should('not.eq', '');
  }

  verificarMensagemErroVisivel() {
    cy.get('#resetMessage', { timeout: 6000 })
      .invoke('text')
      .should('not.eq', '');
  }

  verificarRedirecionamentoLogin() {
    cy.url().should('not.include', '/#');
  }
}

export default new ForgotPasswordPage();