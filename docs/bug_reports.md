# Relatório de Bugs - Desafio QA

## Resumo dos Testes

### Estatísticas
* **Total de Bugs Encontrados:** 38
* **Bugs Críticos:** 11
* **Bugs de Alta Severidade:** 11
* **Bugs de Média Severidade:** 11
* **Bugs de Baixa Severidade:** 5

### Categorias
* **Segurança:** 19 bugs
* **Lógica de Negócio:** 10 bugs
* **UX/UI:** 8 bugs
* **Performance:** 1 bug

### Áreas Testadas
[X] Login
[X] Registro
[X] Reset de Senha
[X] Dashboard
[X] Logout
[X] Segurança (SQL Injection, XSS, etc.)
[X] Validações
[X] Autorização
[X] APIs

---

## Detalhamento dos Bugs

### Bug #1: Exposição de Senha em Texto Plano
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A senha do usuário é exposta no Local Storage e no front-end após o login.
**Ambiente:**
* Navegador: Chrome 124 (Headless/Cypress)
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Acessar a página de login.
2. Inserir credenciais válidas e entrar no sistema.
3. Pressionar F12, acessar a aba Application > Local Storage e inspecionar a chave `user`.

**Resultado Esperado:** A sessão deve usar métodos seguros (JWT/HttpOnly) e não expor a senha no front-end.
**Resultado Atual:** A API retorna a senha em texto plano, que é salva no Local Storage.
**Evidências:** Relatório Mochawesome apontando senha no JSON (`cypress/reports/html/index.html`).
**Impacto:** Permite que qualquer script malicioso (XSS) ou pessoa com acesso à máquina capture a credencial do usuário.
**Sugestão de Correção:** Omitir a propriedade `password` na resposta da API.

---

### Bug #2: Vulnerabilidade de SQL Injection no Login
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A API de login é vulnerável à injeção de comandos SQL, permitindo bypass da autenticação.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Inserir o payload `admin' OR '1'='1` no campo de usuário.
2. Inserir qualquer valor na senha e clicar em "Entrar".

**Resultado Esperado:** O sistema deve sanitizar a entrada e negar o acesso.
**Resultado Atual:** O backend executa a query concatenada e concede acesso de administrador.
**Evidências:** Falha no teste E2E de segurança no Mochawesome.
**Impacto:** Comprometimento total da base de dados e controle de acesso.
**Sugestão de Correção:** Utilizar Prepared Statements no backend.

---

### Bug #3: Rate Limiting ineficaz permite força bruta irrestrita
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O sistema permite 1000 tentativas de login erradas antes de aplicar qualquer bloqueio.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Realizar tentativas de login com senha incorreta repetidamente.
2. Observar o status code de retorno da API.

**Resultado Esperado:** Bloquear ou limitar as requisições (429) após 5 falhas consecutivas.
**Resultado Atual:** O sistema retorna 401 para quase 1000 tentativas consecutivas sem mitigação.
**Evidências:** Logs do Cypress documentando múltiplas requisições sem rate limit no Mochawesome.
**Impacto:** Permite ataques automatizados de força bruta e credential stuffing.
**Sugestão de Correção:** Limitar para 5 tentativas por IP e implementar backoff exponencial.

---

### Bug #4: Autenticação Não-Determinística
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O sistema autentica o usuário com senha errada aleatoriamente em 10% das tentativas.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Tentar logar 10 ou mais vezes com a mesma senha incorreta.

**Resultado Esperado:** Retornar 401 Unauthorized em 100% das vezes.
**Resultado Atual:** Ocasionalmente (1 em 10), a API retorna 200 OK.
**Evidências:** Logs do Mochawesome mostrando status `200` para payload inválido.
**Impacto:** Destrói a confiabilidade da autenticação, permitindo invasão por repetição de tentativas.
**Sugestão de Correção:** Remover aleatoriedades no serviço de validação de hash/senha.

---

### Bug #5: Função "Lembrar-me" Inoperante
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A sessão não é mantida após recarregar a página, mesmo com a opção "Lembrar-me" ativa.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Logar marcando a opção "Lembrar-me".
2. No Dashboard, pressionar F5 para atualizar a página.

**Resultado Esperado:** Manter o estado de autenticado.
**Resultado Atual:** O usuário é deslogado e redirecionado para o `/login`.
**Evidências:** Asserção falhando no Mochawesome após `cy.reload()`.
**Impacto:** Péssima experiência do usuário, forçando logins repetitivos.
**Sugestão de Correção:** Armazenar o token em storage persistente quando a flag for `true`.

---

### Bug #6: Múltiplos Submits no Botão de Login
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [ ] Segurança [ ] Lógica [ ] UX/UI [X] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** Botão permite cliques múltiplos, gerando requisições duplicadas.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Preencher credenciais no login.
2. Clicar rapidamente várias vezes em "Entrar".

**Resultado Esperado:** O botão deve desabilitar após o primeiro clique (loading state).
**Resultado Atual:** Múltiplas requisições `POST /login` são enviadas à API.
**Evidências:** Cypress interceptou 3+ requisições para a mesma ação (Mochawesome).
**Impacto:** Sobrecarga desnecessária no backend e possível race condition na criação de sessão.
**Sugestão de Correção:** Implementar estado `isSubmitting` no frontend.

---

### Bug #7: XSS Refletido na Mensagem de Erro de Login
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** Payload inserido no campo de usuário é renderizado como script no alerta de erro.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Inserir `<script>alert(1)</script>` no campo de usuário.
2. Inserir qualquer senha e logar.

**Resultado Esperado:** Exibir mensagem genérica ("Credenciais inválidas") ou sanitizar a string.
**Resultado Atual:** O script é executado pelo DOM do navegador.
**Evidências:** Teste `not.contain.text` falhando com a captura do script puro.
**Impacto:** Roubo de sessão, manipulação de DOM e ataques de phishing.
**Sugestão de Correção:** Escapar HTML na renderização de erros de requisição.

---

### Bug #8: Ausência de Validação de Campos Obrigatórios
**Severidade:** [ ] Crítica [ ] Alta [ ] Média [X] Baixa
**Categoria:** [ ] Segurança [ ] Lógica [X] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O formulário de login não utiliza validação HTML5 para campos vazios.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Deixar os campos em branco e clicar em "Entrar".

**Resultado Esperado:** Navegador deve bloquear com aviso de "Campo obrigatório".
**Resultado Atual:** Requisição é disparada com payload vazio.
**Evidências:** Cypress não encontrou atributo `required` nos inputs.
**Impacto:** Requisições inválidas chegam ao servidor atoa (desperdício de processamento).
**Sugestão de Correção:** Adicionar atributo `required`.

---

### Bug #9: Campo de Senha Permite Cópia de Dados
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O texto inserido no input de senha pode ser selecionado e copiado.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Inserir texto na senha, selecionar tudo e pressionar Ctrl+C.

**Resultado Esperado:** Bloqueio da seleção/cópia.
**Resultado Atual:** O dado vai para a área de transferência do SO.
**Evidências:** Falta de `user-select: none` via asserções.
**Impacto:** Risco de exposição em computadores compartilhados.
**Sugestão de Correção:** Bloquear evento `oncopy` no input.

---

### Bug #10: Falha na Limpeza de Sessão (Logout Incompleto)
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O objeto da sessão não é removido do navegador ao clicar em "Sair".
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Logar no sistema.
2. Clicar em "Sair".
3. Inspecionar o Local Storage na tela de login.

**Resultado Esperado:** O Local Storage deve estar limpo.
**Resultado Atual:** Os dados do usuário (e senha) permanecem no storage.
**Evidências:** Mochawesome prova que `localStorage.getItem('user')` não é null após logout.
**Impacto:** Um segundo usuário na mesma máquina pode recuperar a sessão anterior.
**Sugestão de Correção:** Forçar `localStorage.clear()` na rotina de logout.

---

### Bug #11: Inconsistência de Sessão após Registro
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A chave que confirma o login no frontend não é gerada no fluxo de registro.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Registrar novo usuário e ser redirecionado ao Dashboard.
2. Verificar Local Storage.

**Resultado Esperado:** Existência das chaves `user` e `loggedIn: true`.
**Resultado Atual:** O sistema omite `loggedIn`.
**Evidências:** Mochawesome documentando a falha de chave após redirecionamento.
**Impacto:** Quebra de contratos do frontend caso outras telas dependam dessa flag.
**Sugestão de Correção:** Setar a flag `loggedIn` após o retorno 200 do registro.

---

### Bug #12: Aceitação de Espaços e Especiais no Username (UI)
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [ ] Segurança [ ] Lógica [X] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O frontend não barra usernames com espaços ou símbolos no registro.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Tentar criar conta com `user name` ou `user#$`.

**Resultado Esperado:** Alerta de validação HTML/Componente bloqueando o envio.
**Resultado Atual:** O form aceita e envia a requisição.
**Evidências:** Testes de cenários inválidos passando no relatório.
**Impacto:** Criação de usuários fora do padrão, quebrando URLs amigáveis ou rotinas internas.
**Sugestão de Correção:** Utilizar regex de formatação no React.

---

### Bug #13: Input de Email com Tipagem HTML Incorreta
**Severidade:** [ ] Crítica [ ] Alta [ ] Média [X] Baixa
**Categoria:** [ ] Segurança [ ] Lógica [X] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O campo de email usa `type="text"`.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Inspecionar o input de E-mail no formulário de registro.

**Resultado Esperado:** Atributo `type="email"`.
**Resultado Atual:** Atributo `type="text"`.
**Evidências:** Mochawesome capturou erro de atributo.
**Impacto:** Falta de validação nativa do navegador e teclados mobile não otimizados.
**Sugestão de Correção:** Ajustar marcação HTML.

---

### Bug #14: Omissão dos Requisitos de Senha na Interface
**Severidade:** [ ] Crítica [ ] Alta [ ] Média [X] Baixa
**Categoria:** [ ] Segurança [ ] Lógica [X] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O usuário não é informado sobre a complexidade de senha exigida.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Acessar a tela de registro e procurar por dicas de senha.

**Resultado Esperado:** Texto de apoio visível.
**Resultado Atual:** Não há instruções.
**Evidências:** Falha no cypress `cy.contains()`.
**Impacto:** Atrito na experiência do usuário, forçando erros para descobrir as regras.
**Sugestão de Correção:** Adicionar `helper text` no componente de input.

---

### Bug #15: Falha na Validação de "Confirmar Senha"
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O formulário permite submissão com senhas divergentes.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Digitar `senha123` em "Senha" e `senhaABC` em "Confirmar Senha". Clicar em Registrar.

**Resultado Esperado:** Bloqueio e alerta visual.
**Resultado Atual:** Submissão aceita utilizando o valor do primeiro input.
**Evidências:** Cypress validou a falha dessa restrição.
**Impacto:** Usuários criarão contas com erro de digitação na senha e ficarão trancados fora do sistema.
**Sugestão de Correção:** Validar `password === confirmPassword` antes do submit.

---

### Bug #16: Ausência de Validação de Formato de E-mail na API
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** Backend aceita cadastros com strings que não são e-mails válidos.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Enviar payload de registro com `email: "a@b"`.

**Resultado Esperado:** Status 400 (Bad Request).
**Resultado Atual:** Status 200 OK, conta criada.
**Evidências:** Logs do Mochawesome.
**Impacto:** Base de dados suja e falha em futuras rotinas de comunicação (reset de senha, e-mails marketing).
**Sugestão de Correção:** Implementar validação RFC de e-mail no DTO.

---

### Bug #17: Ausência de Validação de Complexidade de Senha no Backend
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A API aceita qualquer string como senha, sem exigência de força.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Enviar requisição `/register` com `password: "1"`.

**Resultado Esperado:** Rejeição por política de segurança fraca.
**Resultado Atual:** Conta criada com sucesso.
**Evidências:** Suíte de Cypress confirmando status 200.
**Impacto:** Facilita imensamente ataques de dicionário e força bruta (contas fáceis de invadir).
**Sugestão de Correção:** Implementar regex de complexidade mínima no backend.

---

### Bug #18: Ausência de Limites de Tamanho na API
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A API de registro aceita campos extremamente longos ou curtos.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Enviar registro contendo username de 1000 caracteres.

**Resultado Esperado:** Erro de validação de `maxLength`.
**Resultado Atual:** A API processa a requisição, podendo estourar o banco de dados.
**Evidências:** Falhas capturadas no grupo "Edge Cases de Tamanho" no Cypress.
**Impacto:** Erros de SQL (data truncation) não tratados ou lentidão na API.
**Sugestão de Correção:** Definir min/max length no schema do backend.

---

### Bug #19: Vulnerabilidades Críticas de Injeção (XSS e SQLi) no Registro
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** API grava inputs com scripts e códigos maliciosos na base de dados.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Registrar com nome de usuário: `<script>alert(1)</script>`.

**Resultado Esperado:** Sanitização ou rejeição do payload.
**Resultado Atual:** Status 200 OK. Dado salvo incorretamente.
**Evidências:** Falhas na asserção de interceptação da API no log do Mocha.
**Impacto:** XSS Armazenado (afetará qualquer usuário que visualizar este nome).
**Sugestão de Correção:** Sanitizar entradas na camada de Controller.

---

### Bug #20: Validação ausente para Emojis no Username
**Severidade:** [ ] Crítica [ ] Alta [ ] Média [X] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** Backend permite emojis no nome de registro.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Registrar com nome `user_🐉_ninja`.

**Resultado Esperado:** Bloqueio de caracteres unicode não textuais.
**Resultado Atual:** O emoji é inserido no banco.
**Evidências:** Captura da API respondendo com sucesso no teste de Edge Cases.
**Impacto:** Quebra em codificações legadas (latin1 vs utf8mb4) no banco.
**Sugestão de Correção:** Limitar os caracteres no backend.

---

### Bug #21: Acesso ao Dashboard sem Autenticação
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A rota `/dashboard` não possui proteção, permitindo navegação anônima.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Limpar Local Storage e cookies.
2. Acessar `http://localhost:3000/dashboard` pela barra de endereços.

**Resultado Esperado:** Redirecionamento 302/401 para `/login`.
**Resultado Atual:** A página carrega a UI restrita com status 200.
**Evidências:** Asserção Cypress esperando 401 e recebendo 200.
**Impacto:** Bypass primário de segurança do frontend.
**Sugestão de Correção:** Adicionar middleware (ex: HOC RequireAuth em React).

---

### Bug #22: Backdoor de acesso administrativo via parâmetro de URL
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O sistema simula um token válido se a URL contiver `?admin=true`.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Acessar `http://localhost:3000/?admin=true`.

**Resultado Esperado:** Ignorar o query parameter.
**Resultado Atual:** Acesso instantâneo ao Dashboard como administrador.
**Evidências:** Vídeo da execução capturado no Cypress.
**Impacto:** Acesso root para qualquer indivíduo que descubra o parâmetro.
**Sugestão de Correção:** Remover completamente lógicas de mock/backdoor de código produtivo.

---

### Bug #23: Quebra de Controle de Acesso (Dados de Terceiros)
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** Usuários de nível básico conseguem carregar a lista completa de contas.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Logar com conta normal (`Role: user`).
2. Acessar Dashboard e clicar em "Carregar Todos os Usuários".

**Resultado Esperado:** Erro 403 Forbidden.
**Resultado Atual:** A API devolve o JSON completo de toda a base.
**Evidências:** Teste validando listagem com credenciais incorretas (Mochawesome).
**Impacto:** Exposição severa de informações sensíveis PII (vazamento de dados massivo).
**Sugestão de Correção:** Implementar RBAC (Role Based Access Control) na rota de usuários do servidor.

---

### Bug #24: Interface Administrativa Visível para User Comum
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [ ] Segurança [ ] Lógica [X] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** Elementos de UI destinados ao Admin aparecem para usuários comuns.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Fazer login com conta de Role "user".
2. Olhar para a tela do Dashboard.

**Resultado Esperado:** O painel "Administrativo" não ser renderizado.
**Resultado Atual:** O componente está visível e clicável no DOM.
**Evidências:** Asserção `.should('not.exist')` falhou.
**Impacto:** Confusão de usabilidade e facilitação de ataques de privilege escalation.
**Sugestão de Correção:** Condicional no JSX: `if(user.role === 'admin') render()`.

---

### Bug #25: Vulnerabilidade de IDOR na API de Usuário
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A API busca dados com base no parâmetro `userId` invés do token.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Chamar `/api/user?userId=1` (ID 1 geralmente é o root/admin) com o token de uma conta secundária.

**Resultado Esperado:** API retorna apenas os dados autorizados pelo token.
**Resultado Atual:** API retorna os dados do usuário requisitado no parâmetro.
**Evidências:** Cypress validou o retorno do "username" de terceiro com sucesso.
**Impacto:** Leitura arbitrária de informações de qualquer conta da plataforma.
**Sugestão de Correção:** Obter o ID internamente no backend descriptografando o JWT/Session.

---

### Bug #26: Credencial Mestre (Secret) Hardcoded no Frontend
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A API é acionada com uma chave estática explícita na URL.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Clicar em "Carregar Todos os Usuários".
2. Inspecionar as requisições na aba Network.

**Resultado Esperado:** Autorização via bearer tokens.
**Resultado Atual:** A chamada é feita usando `?secret=admin123`.
**Evidências:** Captura do Request URL no Mochawesome.
**Impacto:** Qualquer pessoa visualizando o tráfego ou o código fonte obtém poder de administrador.
**Sugestão de Correção:** Migrar para arquitetura de tokens gerados em runtime.

---

### Bug #27: Vazamento de Informações em Comentários HTML
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** Comentários do código fonte expõem falhas estruturais para o cliente.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Pressionar CTRL+U ou inspecionar o HTML de qualquer página.

**Resultado Esperado:** HTML limpo.
**Resultado Atual:** Existem tags `` detalhando bugs e falhas internas para quem quiser ler.
**Evidências:** Cypress buscou e encontrou conteúdo comentado malicioso na DOM.
**Impacto:** Auxilia hackers na fase de Reconhecimento/Information Gathering.
**Sugestão de Correção:** Ajustar processo de Build para minificar e purgar comentários.

---

### Bug #28: Caracteres Alfabéticos no ID do Beneficiário
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O campo não restringe a digitação de letras num identificador numérico.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Na tela de coleta individual, preencher "ABC" no ID.

**Resultado Esperado:** Campo não aceitar digitação.
**Resultado Atual:** O texto entra e é processado.
**Evidências:** Cypress acusou value incorreto no input.
**Impacto:** Dados sujos, quebra de relações entre tabelas no banco de dados.
**Sugestão de Correção:** Usar `type="number"`.

---

### Bug #29: Nome do Beneficiário sem Limites de Tamanho
**Severidade:** [ ] Crítica [ ] Alta [ ] Média [X] Baixa
**Categoria:** [ ] Segurança [ ] Lógica [X] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O campo de nome não tem `minlength` ou `maxlength`.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Inspecionar o DOM no input Nome do Beneficiário.

**Resultado Esperado:** Presença dos limites na tag.
**Resultado Atual:** Atributos ausentes, permite 1 ou infinitos caracteres.
**Evidências:** Falha de asserção de estrutura (Mochawesome).
**Impacto:** Inconsistência de layout e dados.
**Sugestão de Correção:** Adicionar `minlength="3" maxlength="150"`.

---

### Bug #30: Valores Negativos na Taxa de Conclusão
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A interface e API aceitam percentuais negativos.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Inserir "-10" no campo Taxa de Conclusão e enviar.

**Resultado Esperado:** Form inválido.
**Resultado Atual:** Form enviado e registrado com sucesso.
**Evidências:** Cypress detectou ausência do estado `:invalid`.
**Impacto:** Comprometimento dos relatórios métricos da ONG/Projeto.
**Sugestão de Correção:** Atributo `min="0"`.

---

### Bug #31: Frequência de Presença acima de 100%
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O sistema não entende que o limite de um percentual é 100.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Inserir "150" no campo Frequência.

**Resultado Esperado:** O input barrar a submissão.
**Resultado Atual:** Valor 150 processado normalmente.
**Evidências:** Asserção Cypress falhou ao validar o bloqueio do submit.
**Impacto:** Falha em KPIs de painéis analíticos.
**Sugestão de Correção:** Atributo `max="100"`.

---

### Bug #32: Nota de Avaliação acima de 10
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O input de nota aceita números arbitrários além do limite.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Inserir "15" na Nota (0-10) e enviar.

**Resultado Esperado:** Formulário inválido.
**Resultado Atual:** Avaliação 15 salva com sucesso.
**Evidências:** Logs do Mochawesome provando submissão bem-sucedida.
**Impacto:** Descalibração no scoring do projeto.
**Sugestão de Correção:** Atributo `max="10"`.

---

### Bug #33: Submissão com Status Inválido
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O formulário não torna a seleção de status obrigatória.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Deixar o `<select>` na opção neutra ("Selecione...") e clicar em Submeter.

**Resultado Esperado:** O browser ou API exigirem a marcação.
**Resultado Atual:** O placeholder é enviado como valor string da categoria.
**Evidências:** Teste validando o `:invalid` state falhou.
**Impacto:** Entradas na tabela com colunas nulas ou textuais inúteis.
**Sugestão de Correção:** Inserir `required` e `value=""` na option nula.

---

### Bug #34: Observações sem Limite de Caracteres
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [ ] Segurança [ ] Lógica [X] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** O Textarea permite inserção irrestrita de bytes.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Colar payload gigantesco na caixa "Observações".

**Resultado Esperado:** Limite delimitado (ex: 500 ou 1000).
**Resultado Atual:** Nenhum limite implementado.
**Evidências:** Erro `expected <textarea> to have attribute maxlength`.
**Impacto:** Permite ataques de negação de serviço a nível de aplicação (enviando megabytes de texto em uma request).
**Sugestão de Correção:** Propriedade `maxlength`.

---

### Bug #35: XSS nas Observações
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** Campo não sanitiza tags dinâmicas de Javascript.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Inserir `<script>alert("XSS")</script>` nas Observações.

**Resultado Esperado:** Sanitização no Frontend e Backend.
**Resultado Atual:** Script gravado puro, gerando XSS armazenado no Histórico de Coletas.
**Evidências:** Valor cru persistido confirmado pelo log do Mochawesome.
**Impacto:** Execução de código arbitrário na máquina de quem visualizar o histórico.
**Sugestão de Correção:** DOMPurify ou `escape()` da string.

---

### Bug #36: Upload de Extensão Proibida (.txt) em Lote
**Severidade:** [ ] Crítica [X] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A validação de arquivos depende apenas do frontend (atributo accept).
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Escolher arquivo `.txt` na aba de Coleta em Lote e submeter.

**Resultado Esperado:** O backend ou a lógica recusar o arquivo.
**Resultado Atual:** Mensagem de Sucesso gerada; o arquivo é processado.
**Evidências:** O teste aguardava erro "Formato inválido" mas obteve sucesso.
**Impacto:** Possibilita upload de malwares (ex: web shells, scripts) para o servidor de arquivos.
**Sugestão de Correção:** Validar `mime type` dos Headers/Buffer de envio no backend.

---

### Bug #37: Checkbox de Duplicatas Inoperante
**Severidade:** [ ] Crítica [ ] Alta [X] Média [ ] Baixa
**Categoria:** [ ] Segurança [X] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** A flag "Validar duplicatas" não aciona rotina no backend.
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Marcar a caixa e subir CSV com chaves repetidas.

**Resultado Esperado:** Interromper o processo de loop e gerar log.
**Resultado Atual:** Os dados entram duplicados no banco.
**Evidências:** Cypress apontou fluxo correndo sem nenhuma trava interativa de duplicidade.
**Impacto:** Redundância e sujeira crônica no banco de dados.
**Sugestão de Correção:** Construir condicional que faça verificação de UNIQUE KEY na inserção.

---

### Bug #38: Vazamento de Dados no Histórico (Broken Access Control)
**Severidade:** [X] Crítica [ ] Alta [ ] Média [ ] Baixa
**Categoria:** [X] Segurança [ ] Lógica [ ] UX/UI [ ] Performance
**Status:** [X] Aberto [ ] Em Análise [ ] Corrigido [ ] Fechado

**Descrição:** Rota `/api/coleta/historico` devolve coletas de terceiros (Multitenancy quebrado).
**Ambiente:**
* Navegador: Chrome 124
* Sistema Operacional: Linux
* Data do Teste: 26/04/2026

**Passos para Reproduzir:**
1. Logar como usuário teste 1.
2. Clicar em carregar histórico.

**Resultado Esperado:** O sistema devolver apenas o que o usuário 1 criou.
**Resultado Atual:** O sistema retorna coletas e dados pertencentes ao usuário 'admin' e outros.
**Evidências:** Asserção Cypress identificou texto "Coletado por: admin" indevido na DOM.
**Impacto:** Fere profundamente normativas de segurança e privacidade (GDPR/LGPD).
**Sugestão de Correção:** Filtrar banco de dados utilizando `user_id` extraído do Token Autenticado da sessão, nunca por GET params ou sem filtros.

---

## Recomendações Gerais

* Implementar práticas de *Secure Coding* com urgência, estabelecendo a adoção de um *ORM (Object-Relational Mapping)* para fechar brechas de SQL Injection.
* Reformular a arquitetura de Autenticação substituindo manipulação de Local Storage por *Cookies HttpOnly* assinados e validando as autorizações no backend de todas as rotas de api.
* Validar minuciosamente os DTOs (Data Transfer Objects) na camada de rede da API antes do processamento, nunca confiando unicamente na validação visual do componente Front-end.
* Remover comentários legados, rotas abertas (`/?admin=true`) e secrets embutidos diretamente no código-fonte cliente para evitar exposição fácil.
* Implementar processo obrigatório de `sanitization` nas entradas do cliente, prevenindo ataques maliciosos de XSS na plataforma.

## Observações

A aplicação apresenta uma dependência crítica de validações a nível de Frontend (HTML5 attributes). A falta de bloqueios reais no servidor expõe as regras de negócios a qualquer manipulador de rotas de rede que intercepte as requisições HTTP e cause bypass aos sistemas da empresa. A segurança atual da aplicação é severamente baixa e inaceitável para ir à produção.