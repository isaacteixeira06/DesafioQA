language: pt

Funcionalidade: Testes de Segurança e Bugs
  Como um QA tester
  Eu quero identificar vulnerabilidades de segurança
  Para garantir que o sistema está protegido

  Pano de Fundo:
    Dado que o sistema está rodando

  Cenário: Verificação de Health Check API
    Quando eu faço uma requisição GET para "/health"
    Então eu devo receber um status 200
    E a resposta deve conter "status": "ok"
    E a resposta deve conter um timestamp válido

  Cenário: Proteção contra XSS via localStorage
    Quando eu faço login com "admin" e "admin123"
    E eu verifico o localStorage
    Então dados sensíveis não devem ser armazenados em texto plano
    E senhas não devem estar visíveis no localStorage

  Cenário: Validação de session timeout
    Quando eu faço login com sucesso
    E a sessão expira após 30 minutos
    Então eu devo ser redirecionado para a página de login
    E meu acesso ao dashboard dever ser bloqueado

  Cenário: Proteção contra acesso direto ao dashboard sem autenticação
    Quando eu navego diretamente para "/dashboard" sem fazer login
    Então eu devo ser redirecionado para a página de login
    E eu não devo conseguir visualizar dados de usuários

  Cenário: Painel administrativo deve ser restrito
    Quando eu faço login como um usuário regular
    E eu estou no dashboard
    Então eu não devo conseguir visualizar a lista de todos os usuários
    E o botão de "Carregar Todos os Usuários" não deve funcionar

  Cenário: Testes de Rate Limiting no login
    Quando eu faço 10 tentativas de login com senha incorreta
    E a senha continua incorreta
    Então o sistema deve bloquear ou alertar sobre múltiplas tentativas
    Ou permitir ataque de força bruta (BUG conhecida)

  Cenário: Validação de campo de email durante registro
    Quando eu navego para a página de registro
    E inspeciono o campo de email
    Então o tipo do campo deve ser "email"
    Ou deve ser "text" (BUG conhecida)

  Cenário: Confirmação de senha não validada
    Quando eu faço registro com senhas diferentes
    E a confirmação não corresponde à senha
    Então o sistema deve rejeitar o registro
    Ou aceitar e causar problemas (BUG conhecida)

  Cenário: Dados sensíveis expostos na resposta do servidor
    Quando eu faço login com sucesso
    E verifico a resposta da API
    Então senhas não devem ser retornadas na resposta
    Ou dados de outros usuários não devem ser expostos

  Cenário: Backdoor via parâmetro de query
    Quando eu faço uma requisição com parâmetros especiais
    E uso "secret=true" na query string
    Então o sistema deve ignorar completamente
    Ou permitir bypass de autenticação (BUG conhecida)
