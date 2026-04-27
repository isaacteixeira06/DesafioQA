class DashboardPage {
    // ─── Seletores ──────────────────────────────────────────────────────────────
    get btnSair() { return cy.contains('Sair'); }
    get tabDashboard() { return cy.contains('Dashboard'); }
    get tabColeta() { return cy.contains('Coleta de Dados'); }
    
    get secInfoUsuario() { return cy.contains('Informações do Usuário').parent(); }
    get secPainelAdmin() { return cy.contains('Painel Administrativo').parent(); }
    get btnCarregarUsuarios() { return cy.contains('Carregar Todos os Usuários'); }

    // ─── Ações ──────────────────────────────────────────────────────────────────
    clicarSair() {
        this.btnSair.click();
    }

    clicarCarregarUsuarios() {
        this.btnCarregarUsuarios.click();
    }

    // ─── Asserções Visuais ──────────────────────────────────────────────────────
    verificarDashboardVisivel() {
        cy.url().should('include', '/dashboard');
        this.secInfoUsuario.should('be.visible');
    }

    verificarRedirecionamentoLogin() {
        cy.url().should('not.include', '/dashboard');
    }

    // ─── Interceptações ─────────────────────────────────────────────────────────
    interceptarCarregamentoUsuarios() {
        // Intercepta qualquer chamada que o dashboard faça para buscar usuários
        cy.intercept('GET', '**/users*').as('getUsers');
    }
}

export default new DashboardPage();