# ✅ Checklist de Testes - Sugestão para QA

Use este checklist como guia para não esquecer nenhuma área importante do sistema.

---

## 🔐 Autenticação e Login

### Login

- [ ] Testar login com credenciais válidas
- [ ] Testar login com credenciais inválidas
- [ ] Testar login com usuário inexistente
- [ ] Testar login com senha incorreta
- [ ] Testar login com campos vazios
- [ ] Testar login com espaços em branco
- [ ] Testar login com caracteres especiais
- [ ] Testar múltiplas tentativas de login falhadas
- [ ] Verificar mensagens de erro
- [ ] Verificar se sessão é criada corretamente

### Registro

- [ ] Registrar novo usuário com dados válidos
- [ ] Tentar registrar usuário existente
- [ ] Testar com campos vazios
- [ ] Testar com email inválido (ex: "a@b", "email", "email@")
- [ ] Testar com senhas fracas (ex: "1", "a", "123")
- [ ] Testar com senhas que não coincidem
- [ ] Testar com caracteres especiais no username
- [ ] Testar com username muito longo
- [ ] Verificar se faz login automático após registro

### Reset de Senha

- [ ] Resetar senha de usuário válido
- [ ] Tentar resetar senha de usuário inexistente
- [ ] Verificar se requer verificação de identidade
- [ ] Testar com senha nova fraca
- [ ] Verificar se senha é realmente alterada

### Logout

- [ ] Fazer logout e verificar se sessão é destruída
- [ ] Tentar acessar dashboard após logout
- [ ] Verificar se dados são limpos do cliente

---

## 🛡️ Segurança

### Injeção de Código

- [ ] Testar SQL Injection no login (ex: `admin' OR '1'='1`)
- [ ] Testar SQL Injection no registro
- [ ] Testar XSS em campos de texto (ex: `<script>alert('XSS')</script>`)
- [ ] Testar injeção de HTML

### Exposição de Dados

- [ ] Verificar se senhas são expostas em responses
- [ ] Verificar se senhas são exibidas no HTML
- [ ] Verificar localStorage/sessionStorage
- [ ] Verificar cookies e seus atributos
- [ ] Inspecionar Network tab para dados sensíveis

### Autorização

- [ ] Tentar acessar dashboard sem login
- [ ] Tentar acessar dados de outros usuários
- [ ] Verificar se rotas administrativas estão protegidas
- [ ] Testar com query parameters (ex: ?admin=true, ?userId=1)

### Sessões

- [ ] Verificar duração da sessão
- [ ] Verificar se sessão expira
- [ ] Testar múltiplas sessões simultâneas
- [ ] Verificar atributos de cookie (secure, httpOnly)

### Rate Limiting

- [ ] Fazer múltiplas tentativas de login
- [ ] Verificar se há bloqueio por tentativas
- [ ] Testar força bruta

---

## 🔄 Lógica de Negócio

### Validações

- [ ] Campos obrigatórios são validados
- [ ] Formato de email é validado
- [ ] Força de senha é validada
- [ ] Tamanho mínimo/máximo de campos
- [ ] Caracteres permitidos

### Fluxos

- [ ] Fluxo completo: registro → login → dashboard → logout
- [ ] Fluxo de reset de senha
- [ ] Comportamento quando já logado
- [ ] Redirecionamentos corretos

### Edge Cases

- [ ] Inputs com valores extremos (muito longos, muito curtos)
- [ ] Inputs com caracteres unicode
- [ ] Inputs com múltiplos espaços
- [ ] Submits simultâneos (double-click)
- [ ] Navegação com botão voltar do browser

---

## 🎨 UX/UI

### Usabilidade

- [ ] Mensagens de erro são claras
- [ ] Feedback visual para ações
- [ ] Campos têm validação no cliente
- [ ] Botões ficam desabilitados durante submit
- [ ] Loading states são mostrados

### Validação de Formulários

- [ ] Atributos HTML corretos (type="email", required, etc.)
- [ ] Validação acontece antes de enviar
- [ ] Mensagens de erro são específicas
- [ ] Confirmação de senha funciona

### Navegação

- [ ] Tabs de login/registro funcionam
- [ ] Links funcionam corretamente
- [ ] Redirecionamentos são apropriados
- [ ] Voltar ao login funciona

---

## 🔧 APIs e Backend

### Endpoints

- [ ] POST /login
- [ ] POST /register
- [ ] POST /logout
- [ ] POST /reset-password
- [ ] GET /dashboard
- [ ] GET /api/user
- [ ] GET /api/users

### Respostas

- [ ] Status codes corretos (200, 401, 400, 404, etc.)
- [ ] Formato de resposta consistente
- [ ] Mensagens de erro apropriadas
- [ ] Não expõe informações sensíveis

### Segurança da API

- [ ] Aceita apenas Content-Type correto
- [ ] Valida dados no servidor
- [ ] Não confia apenas em validação do cliente
- [ ] Protege contra CSRF

---

## 📱 Compatibilidade

### Browsers

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Responsividade

- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

---

## 🔍 Ferramentas para Usar

### DevTools

- [ ] **Console**: Verificar erros JavaScript
- [ ] **Network**: Inspecionar requests/responses
- [ ] **Application**: Verificar localStorage, cookies
- [ ] **Elements**: Inspecionar HTML/CSS
- [ ] **Sources**: Ler código fonte

### Testes Manuais

- [ ] Diferentes inputs de teste
- [ ] Casos válidos e inválidos
- [ ] Fluxos completos
- [ ] Comportamentos inesperados

---

## 📝 Documentação

Para cada bug encontrado, documente:

- ✅ Título claro e descritivo
- ✅ Severidade (Crítica/Alta/Média/Baixa)
- ✅ Categoria (Segurança/Lógica/UX/Performance)
- ✅ Passos para reproduzir (detalhados)
- ✅ Resultado esperado
- ✅ Resultado atual
- ✅ Screenshots ou evidências
- ✅ Sugestão de correção (opcional)

---

## 🎯 Dicas Importantes

1. **Seja Sistemático**: Teste uma área por vez
2. **Documente Imediatamente**: Registre bugs enquanto testa
3. **Pense em Segurança**: Este é um sistema de autenticação
4. **Leia o Código**: Código fonte pode revelar bugs
5. **Teste Edge Cases**: Não teste apenas o happy path
6. **Priorize**: Bugs críticos primeiro
7. **Seja Criativo**: Tente quebrar o sistema

---

## ⏱️ Gestão de Tempo

Sugestão de distribuição do tempo (para teste de 3 horas):

- **30 min**: Exploração inicial e familiarização
- **90 min**: Testes sistemáticos por funcionalidade
- **45 min**: Testes de segurança e edge cases
- **15 min**: Revisão e documentação final

---

## 🚨 Atenção Especial

Estas áreas geralmente contêm mais bugs:

1. **Validações**: Verifique todas as validações
2. **Autenticação**: Tente bypassar o sistema
3. **Exposição de Dados**: Procure por dados sensíveis
4. **Mensagens de Erro**: Verifique se revelam informações
5. **API Endpoints**: Teste todos os endpoints

---

**Boa sorte nos testes!** 🚀

Lembre-se: O objetivo não é apenas encontrar bugs, mas demonstrar **como você pensa** como QA.
