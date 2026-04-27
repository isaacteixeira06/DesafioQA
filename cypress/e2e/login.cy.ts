import loginPage from '../pages/LoginPage';
import loginData from '../fixtures/login.json';

describe('Testes de Sistema (E2E) - Tela de Login', () => {

    before(() => {
        cy.request({
        method: 'POST',
        url: 'http://localhost:3000/register',
        body: {
            username: loginData.valido.usuario,
            email: loginData.valido.email,
            password: loginData.valido.senha
        },
        failOnStatusCode: false
        }).then((response) => {
        cy.log(`Registro de "${loginData.valido.usuario}": status ${response.status}`);
        });
    });

    beforeEach(() => {
        loginPage.acessarPagina();
  } );

    // happy Path 

    it('Deve realizar login com credenciais válidas com sucesso', () => {
        loginPage.interceptarLogin();
        loginPage.realizarLogin(loginData.valido.usuario, loginData.valido.senha);
        loginPage.validarRespostaSucesso();
        loginPage.verificarLoginComSucesso();
        loginPage.verificarSessaoCriada();
    });

    it('Deve manter sessão ao marcar Lembrar-me', () => {
        loginPage.interceptarLogin();
        loginPage.realizarLogin(loginData.valido.usuario, loginData.valido.senha, true);
        loginPage.validarRespostaSucesso();
        loginPage.verificarLoginComSucesso();
    });

    //Credenciais inválidas

    it('Deve exibir erro com usuário inexistente', () => {
        loginPage.interceptarLogin();
        loginPage.realizarLogin('usuario_fake', 'senha_fake');
        loginPage.validarRespostaErro();
        loginPage.verificarErroVisivel();
        loginPage.verificarMensagemErroNaoVazia();
        loginPage.verificarPermaneceNaTelaLogin();
    });

    it('Deve exibir erro com senha incorreta para usuário existente', () => {
        loginPage.interceptarLogin();
        loginPage.realizarLogin(loginData.valido.usuario, 'senha_errada');
        loginPage.validarRespostaErro();
        loginPage.verificarErroVisivel();
        loginPage.verificarPermaneceNaTelaLogin();
    });

    // segurança

    it('Deve rejeitar SQL Injection retornando 401 e não erro de servidor', () => {
        // BUG 03 — este teste falha intencionalmente pois o servidor executa
        // a query com concatenação de strings. Bug documentado em docs/bug_reports.md
        loginPage.interceptarLogin();
        loginPage.realizarLogin("admin' OR '1'='1", 'qualquer');
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
        loginPage.verificarErroVisivel();
        });

    it('Deve exibir mensagem genérica de erro sem revelar se usuário existe', () => {
        loginPage.interceptarLogin();
        loginPage.realizarLogin('usuario_fake', 'qualquer');
        loginPage.validarRespostaErro();
        loginPage.msgErro.invoke('text').then((texto) => {
        expect(texto).not.to.match(/usuário não encontrado|user not found/i);
        expect(texto).not.to.match(/senha incorreta|wrong password/i);
        });
    });

    it('Deve rejeitar senha errada em todas as tentativas sem comportamento aleatório', () => {
        for (let i = 0; i < 10; i++) {
        cy.clearCookies();
        cy.clearLocalStorage();
        loginPage.acessarPagina();
        loginPage.interceptarLogin();
        loginPage.realizarLogin(loginData.valido.usuario, 'senha_completamente_errada');
        cy.wait('@loginRequest').its('response.statusCode').should('not.eq', 200);
        }
    });

    it('Deve omitir a senha no body da resposta da API', () => {
        // BUG 01 — este teste falha intencionalmente, bug documentado em docs/bug_reports.md
        loginPage.interceptarLogin();
        loginPage.realizarLogin(loginData.valido.usuario, loginData.valido.senha);
        cy.wait('@loginRequest').then((interception) => {
        const body = JSON.stringify(interception.response?.body ?? '');
        expect(body).not.to.match(/password|senha/i);
        });
    });

    it('Deve bloquear acesso via backdoor ?admin=true sem autenticação', () => {
        cy.visit('/?admin=true');
        cy.url().should('not.include', '/dashboard');
    });

    it('Deve evitar que a senha seja salva no localStorage após login', () => {
        // BUG 01 — este teste falha intencionalmente, bug documentado em docs/bug_reports.md
        loginPage.interceptarLogin();
        loginPage.realizarLogin(loginData.valido.usuario, loginData.valido.senha);
        loginPage.validarRespostaSucesso();
        cy.window().then((win) => {
        const storage = JSON.stringify(win.localStorage);
        expect(storage).not.to.match(/password|senha|admin123/i);
        });
    });

    // rate limiting

    it('Deve bloquear o usuário após 5 tentativas de login inválidas', () => {
        // BUG 08 — este teste falha intencionalmente pois o sistema só bloqueia
        // após 1000 tentativas. Bug documentado em docs/bug_reports.md
        for (let i = 0; i < 5; i++) {
        cy.clearCookies();
        cy.clearLocalStorage();
        loginPage.acessarPagina();
        loginPage.interceptarLogin();
        loginPage.realizarLogin(loginData.valido.usuario, 'senha_errada');
        cy.wait('@loginRequest');
        }
        loginPage.acessarPagina();
        loginPage.interceptarLogin();
        loginPage.realizarLogin(loginData.valido.usuario, 'senha_errada');
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 429);
    });

    //ux

    it('Deve mascarar a senha no campo de entrada', () => {
        loginPage.inputSenha.should('have.attr', 'type', 'password');
    });

    it('Deve evitar múltiplos submits rápidos no botão de entrar', () => {
        loginPage.inputUsuario.type(loginData.valido.usuario);
        loginPage.inputSenha.type(loginData.valido.senha);
        loginPage.btnEntrar.click();
        loginPage.btnEntrar.click({ force: true });
        loginPage.btnEntrar.click({ force: true });
        loginPage.verificarLoginComSucesso();
    });

});