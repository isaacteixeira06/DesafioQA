language: pt

Funcionalidade: Registro de Novo Usuário
  Como um novo usuário
  Eu quero me registrar no sistema
  Para criar uma conta e acessar a plataforma

  Pano de Fundo:
    Dado que estou na página de registro
    E os seguintes usuários já estão cadastrados:
      | username | email          |
      | admin    | admin@test.com |
      | user     | user@test.com  |

  Cenário: Registro bem-sucedido com dados válidos
    Quando eu insiro "novousuario" no campo de usuário
    E eu insiro "novo@test.com" no campo de email
    E eu insiro "senha123" no campo de senha
    E eu insiro "senha123" no campo de confirmação de senha
    E eu clico no botão "Registrar"
    Então eu devo ver uma mensagem de sucesso
    E o novo usuário deve estar cadastrado no sistema

  Cenário: Registro falhado com usuário duplicado
    Quando eu insiro "admin" no campo de usuário
    E eu insiro "newemail@test.com" no campo de email
    E eu insiro "senha123" no campo de senha
    E eu insiro "senha123" no campo de confirmação de senha
    E eu clico no botão "Registrar"
    Então eu devo ver uma mensagem de erro
    E o usuário não deve ser registrado

  Cenário: Registro falhado com email duplicado
    Quando eu insiro "novousuario" no campo de usuário
    E eu insiro "admin@test.com" no campo de email
    E eu insiro "senha123" no campo de senha
    E eu insiro "senha123" no campo de confirmação de senha
    E eu clico no botão "Registrar"
    Então eu devo ver uma mensagem de erro

  Cenário: Registro falhado com senhas não correspondentes
    Quando eu insiro "novousuario" no campo de usuário
    E eu insiro "novo@test.com" no campo de email
    E eu insiro "senha123" no campo de senha
    E eu insiro "diferente456" no campo de confirmação de senha
    E eu clico no botão "Registrar"
    Então eu devo ver uma mensagem de erro
    E o usuário não deve ser registrado

  Cenário: Registro falhado com email inválido
    Quando eu insiro "novousuario" no campo de usuário
    E eu insiro "email-invalido" no campo de email
    E eu insiro "senha123" no campo de senha
    E eu insiro "senha123" no campo de confirmação de senha
    E eu clico no botão "Registrar"
    Então eu devo ver uma mensagem de erro de email inválido

  Cenário: Registro falhado com campos obrigatórios vazios
    Quando eu deixo o campo de usuário vazio
    E eu insiro "novo@test.com" no campo de email
    E eu insiro "senha123" no campo de senha
    E eu insiro "senha123" no campo de confirmação de senha
    E eu clico no botão "Registrar"
    Então eu devo ver uma mensagem de validação

  Cenário: Validação de força de senha
    Quando eu insiro "novousuario" no campo de usuário
    E eu insiro "novo@test.com" no campo de email
    E eu insiro "123" no campo de senha
    E eu insiro "123" no campo de confirmação de senha
    E eu clico no botão "Registrar"
    Então pode ser que uma validação de senha fraca seja executada
