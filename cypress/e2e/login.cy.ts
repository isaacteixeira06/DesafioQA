import loginPage from '../pages/LoginPage';

describe('Testes de Sistema (E2E) - Tela de Login', () => {
    
    beforeEach(() => {
        loginPage.acessarPagina();
    });

    it('Deve realizar login com credenciais válidas com sucesso', () => {
        loginPage.realizarLogin('admin', 'senha123');

        cy.url().should('include', '/dashboard');
    });

    it('Deve exibir mensagem de erro ao tentar logar com credenciais inválidas', () => {
        loginPage.realizarLogin('usuario_fake', 'senha_fake');

        loginPage.msgErro.should('be.visible');
    });
});