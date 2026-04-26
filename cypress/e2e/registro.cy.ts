import registerPage from '../pages/RegisterPage';

describe('Testes de Sistema (E2E) - Tela de Registro', () => {
    
    beforeEach(() => {
        registerPage.acessarAbaRegistro();
    });

    it('Deve registrar um novo usuário com dados válidos com sucesso, e fazer login automaticamente', () => {
        
        const hashUnico = Date.now();
        const novoUsuario = `qa_user_${hashUnico}`;
        const novoEmail = `qa_${hashUnico}@teste.com`;

        registerPage.preencherFormulario(novoUsuario, novoEmail, 'SenhaForte@123', 'SenhaForte@123');
        registerPage.clicarRegistrar();
        registerPage.verificarRedirecionamentoSucesso(); 
        registerPage.verificarLoginAutomatico();
    });

    it('Deve exibir erro ao tentar registrar um usuário já existente', () => {
        registerPage.preencherFormulario('admin', 'admin@teste.com', 'SenhaForte@123', 'SenhaForte@123');
        registerPage.clicarRegistrar();

        registerPage.verificarMensagemErroVisivel();
    });

    const cenariosInvalidos = [
    
    // email invalido
    { tipo: 'email inválido', usuario: 'teste', email: 'a@b', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'email muito curto' },
    { tipo: 'email inválido', usuario: 'teste', email: 'teste@teste', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'sem domínio válido' },
    { tipo: 'email inválido', usuario: 'teste', email: '@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'sem usuário antes do @' },
    { tipo: 'email inválido', usuario: 'teste', email: 'teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'sem @' },
    { tipo: 'email inválido', usuario: 'teste', email: 'teste@.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'domínio inválido' },

    //senha invalida
    { tipo: 'senha invalida', usuario: 'teste', email: 'teste@teste.com', senha: '1', confirmar: '1', descricao: 'senha com 1 dígito' },
    { tipo: 'senha invalida', usuario: 'teste', email: 'teste@teste.com', senha: 'a', confirmar: 'a', descricao: 'senha com 1 letra' },
    { tipo: 'senha invalida', usuario: 'teste', email: 'teste@teste.com', senha: '1234567', confirmar: '1234567', descricao: 'menos de 8 caracteres' },
    { tipo: 'senha invalida', usuario: 'teste', email: 'teste@teste.com', senha: 'abcdefgh', confirmar: 'abcdefgh', descricao: 'sem números' },
    { tipo: 'senha invalida', usuario: 'teste', email: 'teste@teste.com', senha: '12345678', confirmar: '12345678', descricao: 'sem letras' },
    { tipo: 'senha invalida', usuario: 'teste', email: 'teste@teste.com', senha: 'a', confirmar: 'b', descricao: 'senhas não coincidem' },

    //campos com espaço
    { tipo: 'campos inválidos', usuario: '   ', email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'usuario só com espaços' },
    { tipo: 'campos inválidos', usuario: 'teste', email: '   ', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'email só com espaços' },

    //username invalido
    { tipo: 'username inválido', usuario: 'user name', email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'username com espaço' },
    { tipo: 'username inválido', usuario: 'user@123', email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'username com @' },
    { tipo: 'username inválido', usuario: 'user#$', email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'username com caracteres especiais' },

    //xss injection
    { tipo: 'segurança', usuario: '<script>alert(1)</script>', email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'tentativa de XSS' },    
    { tipo: 'segurança', usuario: 'teste', email: '<img src="x" onerror="alert(1)">@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'tentativa de XSS' },
    { tipo: 'segurança', usuario: 'teste', email: 'teste@teste.com', senha: '"><script>alert(1)</script>', confirmar: '"><script>alert(1)</script>', descricao: 'tentativa de XSS' },

    //sql injection
    { tipo: 'segurança', usuario: "' OR '1'='1", email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'tentativa de SQL injection' },
    { tipo: 'segurança', usuario: "' OR '1'='1", email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'tentativa de SQL injection' },
    { tipo: 'segurança', usuario: "admin'; DROP TABLE usuarios;--", email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'tentativa de SQL injection' },
    { tipo: 'segurança', usuario: 'teste', email: "email@teste.com'--", senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'tentativa de SQL injection' },

    //tamanho max
    { tipo: 'edge case', usuario: 'a'.repeat(256), email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'username muito longo' },
    { tipo: 'edge case', usuario: 'teste', email: 'a'.repeat(246) + '@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'email muito longo' },
    { tipo: 'edge case', usuario: 'teste', email: 'teste@teste.com', senha: 'a'.repeat(1000), confirmar: 'a'.repeat(1000), descricao: 'senha muito longa' },

    //tamanho min
    { tipo: 'edge case', usuario: 'a', email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'username muito curto' },

    //unicode e emojis
    { tipo: 'edge case', usuario: 'usuário_ç_é_á', email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'username com acentuação e cedilha' },
    { tipo: 'edge case', usuario: 'user_🐉_ninja', email: 'teste@teste.com', senha: 'SenhaForte@123', confirmar: 'SenhaForte@123', descricao: 'username contendo emojis' },

];

    cenariosInvalidos.forEach(({ usuario, email, senha, confirmar, descricao }) => {
        it(`Deve validar erro no registro para: ${descricao}`, () => {
            registerPage.preencherFormulario(usuario, email, senha, confirmar);
            registerPage.clicarRegistrar();

            registerPage.verificarMensagemErroVisivel();
        });
    });
});