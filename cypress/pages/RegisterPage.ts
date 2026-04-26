class RegisterPage {


    get tabRegistrar() { return cy.get('[data-testid="tab-register"]'); }
    get inputUsuario() { return cy.get('[data-testid="register-username"]'); }
    get inputEmail() { return cy.get('[data-testid="register-email"]'); }
    get inputSenha() { return cy.get('[data-testid="register-password"]'); }
    get inputConfirmarSenha() { return cy.get('[data-testid="register-confirm"]'); }
    get btnRegistrar() { return cy.get('[data-testid="register-button"]'); }
    get msgErro() { return cy.get('[data-testid="message"]'); }

    acessarAbaRegistro() {
        cy.visit('/');
        this.tabRegistrar.click();
    }

    preencherFormulario(usuario: string, email: string, senha: string, confirmarSenha?: string) {
        if (usuario) this.inputUsuario.clear().type(usuario);
        if (email) this.inputEmail.clear().type(email);
        if (senha) this.inputSenha.clear().type(senha);
        if (confirmarSenha) this.inputConfirmarSenha.clear().type(confirmarSenha);
    }

    clicarRegistrar() {
        this.btnRegistrar.click();
    }

    verificarMensagemErroVisivel() {
        this.msgErro.should('be.visible');
    }

    verificarRedirecionamentoSucesso() {
        cy.url().should('not.include', 'register');
    }

    verificarLoginAutomatico() {
        cy.url().should('include', '/dashboard');
        cy.contains('Informações do Usuário').should('be.visible');

        //apenas 'user', pois o 'loggedIn' é um bug da aplicação
        cy.window().its('localStorage').invoke('getItem', 'user').should('exist');
    }
}

export default new RegisterPage();