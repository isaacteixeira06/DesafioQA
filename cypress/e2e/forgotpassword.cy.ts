import forgotPasswordPage from '../pages/ForgotpasswordPage';

describe('Testes de Sistema (E2E) - Tela de Resetar Senha', () => {

  beforeEach(() => {
    forgotPasswordPage.acessarViaLink();
  });

  // ── Happy Path ──────────────────────────────────────────────────────────────

  it('Deve acessar a tela de reset via link "Esqueceu sua senha?"', () => {
    cy.get('#resetPasswordForm').should('have.css', 'display', 'block');
  });

  it('Deve resetar a senha de um usuário existente com sucesso', () => {
    forgotPasswordPage.interceptarReset();
    forgotPasswordPage.resetarSenha('admin', 'NovaSenha@123');
    forgotPasswordPage.validarRespostaSucesso();
    forgotPasswordPage.verificarMensagemSucessoVisivel();
  });

  it('Deve voltar para a tela de login ao clicar em "Voltar ao login"', () => {
    forgotPasswordPage.voltarAoLogin();
    cy.get('#loginForm').should('have.css', 'display', 'block');
  });

  // ── Segurança ───────────────────────────────────────────────────────────────

  it('Deve exigir verificação de identidade antes de resetar a senha', () => {
    // BUG 24 — este teste falha intencionalmente pois o sistema permite
    // resetar a senha de qualquer usuário sem verificação de identidade.
    // Bug documentado em docs/bug_reports.md
    forgotPasswordPage.interceptarReset();
    forgotPasswordPage.resetarSenha('admin', 'SenhaHacker@123');
    cy.wait('@resetRequest').its('response.statusCode').should('eq', 403);
  });

  it('Deve rejeitar reset de senha para usuário inexistente', () => {
    forgotPasswordPage.interceptarReset();
    forgotPasswordPage.resetarSenha('usuario_que_nao_existe', 'NovaSenha@123');
    forgotPasswordPage.validarRespostaErro();
    forgotPasswordPage.verificarMensagemErroVisivel();
  });

  it('Deve rejeitar tentativa de SQL Injection no campo de usuário', () => {
    forgotPasswordPage.interceptarReset();
    forgotPasswordPage.resetarSenha("1=1", 'NovaSenha@123');
    forgotPasswordPage.validarRespostaErro();
  });

  // ── Validação de campos ─────────────────────────────────────────────────────

  it('Deve rejeitar reset com campos vazios', () => {
    forgotPasswordPage.interceptarReset();
    forgotPasswordPage.resetarSenha('', '');
    forgotPasswordPage.verificarMensagemErroVisivel();
  });

  it('Deve rejeitar nova senha fraca', () => {
    forgotPasswordPage.interceptarReset();
    forgotPasswordPage.resetarSenha('admin', '123');
    forgotPasswordPage.verificarMensagemErroVisivel();
  });

  it('Deve mascarar a nova senha no campo de entrada', () => {
    forgotPasswordPage.inputNovaSenha.should('have.attr', 'type', 'password');
  });

});