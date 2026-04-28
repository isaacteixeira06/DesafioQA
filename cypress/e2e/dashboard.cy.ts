import dashboardPage from '../pages/DashboardPage';
import loginPage from '../pages/LoginPage';
import loginData from '../fixtures/login.json';

describe('Testes de Sistema (E2E) - Dashboard', () => {

    const usuarioDinamico = `dash_user_${Date.now()}`;
    const senhaDinamica = 'SenhaDash123';
    const emailDinamico = `${usuarioDinamico}@teste.com`;

    before(() => {
        cy.request({
            method: 'POST',
            url: '/register',
            body: {
                username: usuarioDinamico,
                email: emailDinamico,
                password: senhaDinamica
            }
        });
    });

    beforeEach(() => {
        loginPage.acessarPagina();
        loginPage.interceptarLogin();
        loginPage.realizarLogin(usuarioDinamico, senhaDinamica);
        loginPage.validarRespostaSucesso();
        dashboardPage.verificarDashboardVisivel();
    });

    // ── 1. Vazamento de Dados (Senhas e Secrets) ──────────────────────────────

    it('Não deve exibir a senha do usuário em texto plano na tela', () => {
        dashboardPage.secInfoUsuario.should('contain', usuarioDinamico);
        dashboardPage.secInfoUsuario.should('not.contain', senhaDinamica);
    });

    it('Não deve enviar credenciais hardcoded (secret) nas requisições da API', () => {
        cy.intercept('GET', '**/*').as('reqDashboard');
        dashboardPage.clicarCarregarUsuarios();

        cy.wait('@reqDashboard').then((interception) => {
            expect(interception.request.url).to.not.include('secret=admin123');
        });
    });

    // ── 2. Controle de Acesso (Broken Access Control) ───────────────────────

    it('Não deve exibir o Painel Administrativo para usuário com role comum', () => {
        dashboardPage.secPainelAdmin.should('not.exist');
    });

    it('Não deve permitir que a API liste todos os usuários para contas comuns', () => {
        dashboardPage.interceptarCarregamentoUsuarios();
        dashboardPage.clicarCarregarUsuarios();
        cy.wait('@getUsers').its('response.statusCode').should('eq', 403);
    });

    it('Não deve permitir acesso a dados de outro usuário manipulando a API (IDOR)', () => {
        cy.request({
            method: 'GET',
            url: '/api/user?userId=1',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.body).to.have.property('username');
            
            expect(response.body.username).to.not.eq('admin');
        });
    });

    // ── 3. Gestão de Sessão e Logout ──────────────────────────────────────────

    it('Deve limpar completamente o localStorage ao fazer logout', () => {
        dashboardPage.clicarSair();
        dashboardPage.verificarRedirecionamentoLogin();
        
        cy.window().its('localStorage').invoke('getItem', 'loggedIn').should('be.null');
        cy.window().its('localStorage').invoke('getItem', 'user').should('be.null');
    });

    it('Não deve permitir acesso direto à rota /dashboard sem estar logado', () => {
    dashboardPage.clicarSair();
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.request({
      url: '/dashboard',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.eq(401);
      
      expect(response.body).to.not.contain('Informações do Usuário');
    });
  });
});