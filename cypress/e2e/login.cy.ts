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
        cy.reload(); 
        cy.url().should('include', '/dashboard'); 
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

    it('Deve rejeitar SQL Injection retornando 401 e não 200 (Login bypass)', () => {
        // BUG 03: Servidor não sanitiza queries
        loginPage.interceptarLogin();
        // O payload clássico "' OR 1=1 --" tenta forçar o login burlando a senha
        loginPage.realizarLogin("' OR 1=1 --", 'qualquer');
        
        // O teste DEVE FALHAR. Esperamos que ele recuse (401), 
        // mas a aplicação vulnerável vai aceitar (200) e fazer o login.
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    });

    it('Não deve refletir código HTML/JS no campo de erro (XSS Refletido)', () => {
        // Nova vulnerabilidade identificada: XSS Refletido
        loginPage.interceptarLogin();
        const payloadXSS = '<script>alert("Vulnerável")</script>';
        
        loginPage.realizarLogin(payloadXSS, 'qualquer');
        loginPage.validarRespostaErro();
        
        // O teste DEVE FALHAR. O sistema não deve renderizar as tags de script na tela.
        loginPage.msgErro.should('not.contain.text', payloadXSS);
    });

    it('Deve impedir que o usuário copie a senha digitada', () => {
        // BUG 26: Campo de senha permite copiar
        loginPage.inputSenha.type('senha_secreta');
        
        // O teste DEVE FALHAR porque o HTML do desenvolvedor não bloqueou a cópia.
        // Esperamos que o evento oncopy retorne false, ou que o CSS impeça a seleção.
        loginPage.inputSenha.should('have.css', 'user-select', 'none');
    });

    it('Deve exigir o preenchimento obrigatório dos campos', () => {
        // BUG 25: Campo não tem validação required
        
        // O teste DEVE FALHAR porque os campos de usuário e senha não têm o atributo "required".
        loginPage.inputUsuario.should('have.attr', 'required');
        loginPage.inputSenha.should('have.attr', 'required');
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
        loginPage.interceptarLogin();
        loginPage.inputUsuario.type(loginData.valido.usuario);
        loginPage.inputSenha.type(loginData.valido.senha);
        loginPage.btnEntrar.click();
        loginPage.btnEntrar.click({ force: true });
        loginPage.btnEntrar.click({ force: true });
        cy.get('@loginRequest.all').should('have.length', 1);
    });

});