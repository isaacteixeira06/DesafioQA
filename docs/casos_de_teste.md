# Casos de Teste - Desafio QA

Este documento contém a especificação dos casos de teste (CTs) elaborados para validar as regras de negócio, a usabilidade e a segurança da aplicação. Eles refletem a cobertura exata da suíte de testes E2E automatizada via Cypress.

---

## Módulo 1: Autenticação (Login)

### CT-001: Realizar login com credenciais válidas e manter sessão
* **Objetivo:** Garantir o acesso ao sistema e o funcionamento da flag "Lembrar-me".
* **Passos de Execução:**
  1. Acessar `/login`.
  2. Preencher credenciais corretas e marcar "Lembrar-me" (opcional).
  3. Clicar em "Entrar".
  4. Recarregar a página após acessar o Dashboard.
* **Resultado Esperado:** O usuário é autenticado, a sessão é criada de forma segura (sem expor senha no body da API ou no localStorage) e a sessão persiste após o reload.

### CT-002: Impedir login com credenciais incorretas
* **Objetivo:** Validar a recusa de acesso para usuários inexistentes ou senhas erradas de forma determinística.
* **Passos de Execução:**
  1. Tentar logar com usuário inexistente.
  2. Tentar logar com usuário válido e senha incorreta (repetir 10 vezes).
* **Resultado Esperado:** O sistema exibe erro genérico (sem revelar se o usuário existe), não autentica em nenhuma das tentativas (sem falsos positivos) e mantém o usuário na tela de login.

### CT-003: Mitigar ataques automatizados (Rate Limiting e Múltiplos Submits)
* **Objetivo:** Testar a resiliência da tela de login contra força bruta e cliques acidentais.
* **Passos de Execução:**
  1. Realizar 5 tentativas inválidas seguidas.
  2. Clicar no botão "Entrar" múltiplas vezes rapidamente em uma única requisição.
* **Resultado Esperado:** A API retorna `429 Too Many Requests` após a 5ª falha e o frontend envia apenas 1 requisição mesmo com múltiplos cliques.

### CT-004: Bloquear injeções (SQLi, XSS) e Backdoors
* **Objetivo:** Garantir a sanitização da tela de autenticação e bloqueio de rotas abertas.
* **Passos de Execução:**
  1. Inserir payload SQL (`' OR 1=1 --`) no usuário.
  2. Inserir payload XSS (`<script>alert("XSS")</script>`) no usuário.
  3. Tentar acessar `/?admin=true`.
* **Resultado Esperado:** SQLi retorna `401`, XSS não reflete no HTML e backdoor paramétrico é ignorado.

---

## Módulo 2: Registro de Usuários

### CT-005: Registrar novo usuário e bloquear duplicidades
* **Objetivo:** Validar o caminho feliz e a restrição de contas duplicadas.
* **Passos de Execução:**
  1. Preencher todos os campos com dados únicos e fortes; submeter.
  2. Tentar registrar novamente utilizando o usuário `admin`.
* **Resultado Esperado:** O registro válido redireciona e loga automaticamente. O registro duplicado exibe erro.

### CT-006: Validar consistência visual e de UX do formulário
* **Objetivo:** Verificar a presença de atributos HTML nativos e instruções de tela.
* **Passos de Execução:**
  1. Inspecionar o campo de E-mail e as instruções de Senha.
* **Resultado Esperado:** E-mail possui `type="email"` e a tela exibe explicitamente os requisitos de senha.

### CT-007: Barrar formatações e dados inválidos (Frontend e Backend)
* **Objetivo:** Submeter a API a uma bateria de validações (Edge cases, injeções, formatos).
* **Passos de Execução:**
  1. Enviar e-mails malformados (`a@b`, `teste.com`).
  2. Enviar senhas fracas ou divergentes.
  3. Enviar usernames com espaços, arrobas, emojis ou com tamanhos extremos (1 ou 1000 chars).
  4. Enviar injeções XSS e SQL nos campos.
* **Resultado Esperado:** A API (`POST /register`) recusa os dados, não retorna Status 200 e nenhuma conta inválida ou maliciosa é persistida no banco.

---

## Módulo 3: Dashboard e Controle de Acesso

### CT-008: Proteger rotas contra acesso anônimo
* **Objetivo:** Validar que o sistema exige sessão ativa e limpa dados ao deslogar.
* **Passos de Execução:**
  1. Fazer logout e verificar LocalStorage.
  2. Acessar `/dashboard` diretamente via URL.
* **Resultado Esperado:** Logout limpa as chaves do storage; acesso direto retorna 401 e barra a interface.

### CT-009: Prevenir vazamento de dados sensíveis e credenciais embutidas
* **Objetivo:** Garantir que a aplicação não exponha dados no frontend ou nas requisições.
* **Passos de Execução:**
  1. Inspecionar a interface do Dashboard logado.
  2. Interceptar a chamada de "Carregar Usuários".
* **Resultado Esperado:** A senha do usuário logado não aparece em texto plano no HTML. A query string não contém `secret=admin123`.

### CT-010: Aplicar Controle de Acesso (RBAC) e evitar IDOR
* **Objetivo:** Validar o isolamento de privilégios.
* **Passos de Execução:**
  1. Logar com usuário comum (`role: user`).
  2. Verificar visibilidade do Painel Administrativo.
  3. Tentar chamar a rota de listar todos os usuários.
  4. Chamar `/api/user?userId=1`.
* **Resultado Esperado:** Painel Admin não existe no DOM; listar usuários retorna `403`; chamada por ID de terceiro não retorna os dados de admin.

---

## Módulo 4: Coleta de Dados

### CT-011: Validar limites e tipos nos campos da Coleta Individual
* **Objetivo:** Garantir a integridade dos dados no formulário principal de coleta.
* **Passos de Execução:**
  1. Inserir letras no ID do Beneficiário.
  2. Inserir valor negativo na Taxa de Conclusão.
  3. Inserir Frequência > 100 e Nota > 10.
  4. Submeter sem escolher um Status válido.
* **Resultado Esperado:** Todos os campos devem ativar a pseudo-classe `:invalid` do HTML5 e o sistema deve barrar letras ou envios fora dos limites.

### CT-012: Prevenir XSS e estouro de buffer nas Observações
* **Objetivo:** Proteger o campo de texto longo.
* **Passos de Execução:**
  1. Inserir payload `<script>alert("XSS")</script>` no textarea.
  2. Inspecionar o limite de caracteres.
* **Resultado Esperado:** O input é sanitizado (não retém a tag script) e possui atributo `maxlength`.

### CT-013: Bloquear vulnerabilidades no upload em Lote
* **Objetivo:** Testar validação de arquivos e lógica de duplicatas.
* **Passos de Execução:**
  1. Submeter um arquivo disfarçado como `.txt`.
  2. Marcar "Validar duplicatas" e submeter um CSV com registros repetidos.
* **Resultado Esperado:** O `.txt` deve exibir "Formato inválido". O CSV duplicado não deve exibir mensagem de sucesso.

### CT-014: Garantir isolamento de dados no Histórico (Multitenancy)
* **Objetivo:** Validar se o usuário visualiza apenas as próprias coletas.
* **Passos de Execução:**
  1. Logar com conta recém-criada e carregar histórico.
* **Resultado Esperado:** Não exibir dados contendo "Coletado por: admin" ou de terceiros.

---

## Módulo 5: Redefinição de Senha (Forgot Password)

### CT-015: Acessar a tela de redefinição via link
* **Objetivo:** Garantir que a navegação para a recuperação de senha esteja funcionando.
* **Passos de Execução:**
  1. Na tela de Login, clicar no link "Esqueceu sua senha?".
* **Resultado Esperado:** O formulário de login é ocultado e o de redefinição exibido. O botão "Voltar" reverte o estado.

### CT-016: Validar fluxo de redefinição e UI
* **Objetivo:** Testar o envio de dados básicos e componentes.
* **Passos de Execução:**
  1. Enviar form vazio ou com senha fraca.
  2. Digitar na "Nova Senha" e inspecionar visualmente.
* **Resultado Esperado:** O sistema exige preenchimento forte; o campo aplica máscara (`type="password"`).

### CT-017: Impedir Broken Access e SQLi na API de Reset
* **Objetivo:** Proteger a rota de atualização de credenciais.
* **Passos de Execução:**
  1. Tentar resetar senha para usuário inexistente.
  2. Enviar payload de SQLi (`1=1`) no campo usuário.
  3. Tentar resetar a senha do usuário `admin` diretamente.
* **Resultado Esperado:** Rejeita falsos positivos, neutraliza SQLi e retorna Status `403` para tentativa de alteração direta sem verificação de identidade.