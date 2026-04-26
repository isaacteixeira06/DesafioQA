import loginPage from '../pages/LoginPage';

describe('Testes de Sistema (E2E) - Tela de Login', () => {
    
    beforeEach(() => {
        loginPage.acessarPagina();
    });

    it('Deve realizar login com credenciais válidas com sucesso', () => {
        loginPage.realizarLogin('admin', 'admin123');
        cy.url().should('include', '/dashboard');
    });

    it('Deve exibir erro com credenciais inválidas', () => {
        loginPage.realizarLogin('usuario_fake', 'senha_fake');
        loginPage.msgErro.should('be.visible');
    });

    
    const cenariosInvalidos = [
        { usuario: '', senha: '', descricao: 'campos vazios' },
        { usuario: 'admin', senha: '', descricao: 'senha vazia' },
        { usuario: '', senha: 'senha123', descricao: 'usuario vazio' },
        { usuario: '@@@@@', senha: '####', descricao: 'caracteres especiais' },
        { usuario: '123456', senha: '123456', descricao: 'apenas números' },
        { usuario: 'abcdef', senha: 'abcdef', descricao: 'apenas letras' },
        { usuario: 'admin', senha: 'errada', descricao: 'senha incorreta' },
        { usuario: '   ', senha: '   ', descricao: 'apenas espaços' },
    ];

    cenariosInvalidos.forEach(({ usuario, senha, descricao }) => {
        it(`Deve validar erro para: ${descricao}`, () => {
            loginPage.realizarLogin(usuario, senha);
            loginPage.msgErro.should('be.visible');
        });
    });
});