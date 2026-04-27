class LoginPage {

    get inputUsuario() { return cy.get('[data-testid="login-username"]'); }
    get inputSenha() { return cy.get('[data-testid="login-password"]'); }
    get btnEntrar() { return cy.get('[data-testid="login-button"]'); }
    get msgErro() { return cy.get('[data-testid="message"]'); } 
    get checkLembrar() { return cy.get('#rememberMe'); }

    acessarPagina() {
        cy.visit('/');
    }

    preencherUsuario(usuario: string) {
        this.inputUsuario.clear();
        if (usuario) this.inputUsuario.type(usuario);
    }

    preencherSenha(senha: string) {
        this.inputSenha.clear();
        if (senha) this.inputSenha.type(senha);
    }

    clicarEntrar() {
        this.btnEntrar.click();
    }

    marcarLembrarMe() {
        this.checkLembrar.check();
    }

    
    realizarLogin(usuario: string, senha: string, lembrar: boolean = false) {
        this.preencherUsuario(usuario);
        this.preencherSenha(senha);

        if (lembrar) {
            this.marcarLembrarMe();
        }

        this.clicarEntrar();
    }

    verificarLoginComSucesso() {
        cy.url().should('include', '/dashboard');
    }

    verificarErroVisivel() {
        this.msgErro.should('be.visible');
    }

    verificarMensagemErroNaoVazia() {
        this.msgErro.invoke('text').should('not.be.empty');
    }

    verificarPermaneceNaTelaLogin() {
        cy.url().should('not.include', '/dashboard');
    }


    
    verificarSessaoCriada() {
        cy.window().then((win) => {
            const user = win.localStorage.getItem('user');
            expect(user).to.not.be.null;
        });
    }

    
    interceptarLogin() {
        cy.intercept('POST', '/login').as('loginRequest');
    }

    validarRespostaSucesso() {
        cy.wait('@loginRequest')
            .its('response.statusCode')
            .should('eq', 200);
    }

    validarRespostaErro() {
        cy.wait('@loginRequest')
            .its('response.statusCode')
            .should('be.oneOf', [400, 401]);
    }


}

export default new LoginPage();