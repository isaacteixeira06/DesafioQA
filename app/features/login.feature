language: pt
  
Funcionalidade: Login de Usuário
  Como um usuário
  Eu quero fazer login no sistema
  Para acessar meu dashboard

  Pano de Fundo:
    Dado que estou na página de login
    E os seguintes usuários estão cadastrados:
      | username | password | email         | role  |
      | admin    | admin123 | admin@test.com | admin |
      | user     | user123  | user@test.com  | user  |
      | teste    | 123456   | teste@test.com | user  |

  Cenário: Login bem-sucedido com credenciais válidas
    Quando eu insiro "admin" no campo de usuário
    E eu insiro "admin123" no campo de senha
    E eu clico no botão "Entrar"
    Então eu devo ser redirecionado para o dashboard
    E eu devo ver as informações do meu perfil

  Cenário: Login falhado com senha incorreta
    Quando eu insiro "admin" no campo de usuário
    E eu insiro "senhaerrada" no campo de senha
    E eu clico no botão "Entrar"
    Então eu devo ver uma mensagem de erro
    E eu não devo ser redirecionado para o dashboard

  Cenário: Login falhado com usuário inexistente
    Quando eu insiro "usuarioinexistente" no campo de usuário
    E eu insiro "qualquersenha" no campo de senha
    E eu clico no botão "Entrar"
    Então eu devo ver uma mensagem de erro
    E eu não devo ser redirecionado para o dashboard

  Cenário: Login falhado com campos vazios
    Quando eu deixo o campo de usuário vazio
    E eu deixo o campo de senha vazio
    E eu clico no botão "Entrar"
    Então eu devo ver uma mensagem de validação

  Cenário: Tentativa de SQL Injection
    Quando eu insiro "admin' OR '1'='1" no campo de usuário
    E eu insiro "qualquersenha" no campo de senha
    E eu clico no botão "Entrar"
    Então eu devo ver uma mensagem de erro
    E nenhum acesso não autorizado deve ser concedido

  Cenário: Bypass de autenticação via parâmetro de query
    Quando eu navego para "/dashboard?bypass=true"
    Então eu devo ser redirecionado para a página de login
    E eu não devo acessar o dashboard sem autenticação

  Cenário: Login com diferentes combinações de espaços
    Quando eu insiro "  admin  " no campo de usuário
    E eu insiro "  admin123  " no campo de senha
    E eu clico no botão "Entrar"
    Então a validação deve rejeitar ou aceitar consistentemente
