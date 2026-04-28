# Cenários de Teste BDD (Behavior-Driven Development)

Este documento descreve o comportamento esperado da aplicação utilizando a sintaxe Gherkin. Os cenários servem como documentação viva das regras de negócio e base para a automação de testes E2E.

---

## Funcionalidade: Autenticação (Login e Logout)
**Como** um usuário cadastrado
**Quero** poder acessar o sistema de forma segura e sair quando terminar
**Para** proteger minhas informações e acessar o painel do projeto

### Cenário: Login bem-sucedido com credenciais válidas
  Dado que o usuário acessa a página de Login
  Quando ele preenche "Usuário" com credenciais válidas
  E preenche "Senha" com a senha correta
  E clica no botão "Entrar"
  Então ele deve ser redirecionado para a rota "/dashboard"
  E uma sessão segura deve ser estabelecida no navegador

### Cenário: Tentativa de login com senha incorreta
  Dado que o usuário acessa a página de Login
  Quando ele preenche "Usuário" com um usuário cadastrado
  E preenche "Senha" com uma senha incorreta
  E clica no botão "Entrar"
  Então o sistema deve exibir uma mensagem de erro "Credenciais inválidas"
  E o acesso ao dashboard deve ser negado

### Cenário: Prevenção contra tentativa de injeção de SQL
  Dado que o usuário acessa a página de Login
  Quando ele preenche o campo de usuário com o payload "admin' OR '1'='1"
  E clica no botão "Entrar"
  Então a API deve sanitizar a entrada e negar a autenticação
  E o status da resposta da API deve ser 401 Unauthorized

### Cenário: Logout bem-sucedido e limpeza de sessão
  Dado que o usuário está logado e na página do Dashboard
  Quando ele clica no botão "Sair"
  Então ele deve ser redirecionado para a página de Login
  E todos os dados sensíveis da sessão (tokens, senhas) devem ser removidos do Local Storage

---

## Funcionalidade: Registro de Usuários
**Como** um novo visitante
**Quero** criar uma conta no sistema fornecendo meus dados
**Para** poder acessar as funcionalidades restritas de coleta e dashboard

### Cenário: Cadastro bem-sucedido de novo usuário
  Dado que o visitante acessa a aba "Registrar"
  Quando ele preenche "Usuário" e "E-mail" com dados não cadastrados
  E preenche os campos de "Senha" e "Confirmar Senha" com valores iguais e fortes
  E clica em "Registrar"
  Então o sistema deve exibir a mensagem "Usuário registrado com sucesso"
  E o usuário deve ser autenticado automaticamente e redirecionado ao dashboard

### Cenário: Tentativa de registro com senhas divergentes
  Dado que o visitante acessa a aba "Registrar"
  Quando ele preenche os dados cadastrais básicos
  E preenche "Senha" com o valor "SenhaForte123"
  E preenche "Confirmar Senha" com o valor "Diferente123"
  E clica em "Registrar"
  Então o sistema deve impedir o envio do formulário
  E deve exibir uma mensagem de erro informando que as senhas não coincidem

### Cenário: Validação estrita de formato de e-mail na API
  Dado que o visitante tenta registrar uma conta enviando dados diretamente para a API
  Quando o payload da requisição contém o e-mail malformado "usuario@semdominio"
  Então a API deve rejeitar a requisição com o status 400 Bad Request
  E a conta não deve ser criada no banco de dados

### Cenário: Tentativa de cadastro de usuário já existente
  Dado que existe um usuário cadastrado com o nome "admin"
  Quando um visitante tenta se registrar utilizando o nome "admin"
  E clica em "Registrar"
  Então o sistema deve exibir a mensagem de erro "Usuário já existe"
  E o cadastro deve ser bloqueado

---

## Funcionalidade: Coleta de Dados (Formulário Individual)
**Como** um usuário autenticado
**Quero** preencher o formulário individual de coleta
**Para** registrar o progresso e avaliação de um beneficiário no banco de dados

### Cenário: Submissão de dados válidos na coleta individual
  Dado que o usuário autenticado acessa a página "Coleta de Dados"
  Quando ele preenche o "Nome Completo" e um "ID do Beneficiário" numérico
  E insere valores percentuais válidos na "Taxa de Conclusão" e "Frequência"
  E seleciona um "Status da Avaliação" válido
  E clica em "Submeter Coleta"
  Então o sistema deve registrar as informações com sucesso
  E os dados devem aparecer listados na aba "Histórico"

### Cenário: Validação de limite lógico para Taxa de Conclusão
  Dado que o usuário está no formulário de Coleta Individual
  Quando ele insere o valor "-10" no campo "Taxa de Conclusão (%)"
  E tenta submeter o formulário
  Então o formulário deve impedir a ação
  E exibir um alerta indicando que o valor mínimo permitido é 0

### Cenário: Prevenção de XSS no campo de Observações
  Dado que o usuário está no formulário de Coleta Individual
  Quando ele insere o payload malicioso "<script>alert(1)</script>" no campo "Observações"
  E clica em "Submeter Coleta"
  Então o sistema deve sanitizar a string antes de salvar no banco de dados
  E ao exibir no histórico, o script não deve ser executado pelo navegador do cliente

---

## Funcionalidade: Upload de Coleta em Lote
**Como** um usuário autenticado ou administrador
**Quero** enviar um arquivo contendo múltiplas coletas
**Para** registrar dados massivos sem a necessidade de digitação manual

### Cenário: Upload bem-sucedido de arquivo CSV válido
  Dado que o usuário acessa a aba "Coleta em Lote"
  Quando ele anexa um arquivo com a extensão ".csv" contendo cabeçalhos corretos
  E clica em "Fazer Upload"
  Então o sistema deve processar o arquivo no backend
  E exibir uma mensagem de sucesso confirmando a inserção dos registros

### Cenário: Bloqueio de upload de formato de arquivo inválido
  Dado que o usuário acessa a aba "Coleta em Lote"
  Quando ele anexa um arquivo de script com extensão ".txt" ou ".exe"
  E clica em "Fazer Upload"
  Então a API deve recusar o payload com base na validação MIME Type
  E o sistema deve exibir a mensagem de erro "Formato inválido"