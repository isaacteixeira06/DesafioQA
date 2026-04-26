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

    if (usuario) {
        this.inputUsuario.type(usuario);
    }
}

    preencherSenha(senha: string) {
    this.inputSenha.clear();

    if (senha) {
        this.inputSenha.type(senha);
    }
}

    clicarEntrar() {
        this.btnEntrar.click();
    }

    
    realizarLogin(usuario: string, senha: string) {
        this.preencherUsuario(usuario);
        this.preencherSenha(senha);
        this.clicarEntrar();
    }
}

export default new LoginPage();