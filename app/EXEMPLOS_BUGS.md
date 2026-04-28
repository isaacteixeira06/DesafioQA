# 📝 Exemplos de Documentação de Bugs

Este arquivo mostra **exemplos bem documentados** de como reportar bugs.
Use como referência para seus próprios relatórios.

---

## ✅ Exemplo 1: Bug Crítico de Segurança

### Bug #1: Senhas Armazenadas em Texto Plano

**Severidade**: ⚠️ **CRÍTICA**

**Categoria**: Segurança

**Status**: Aberto

#### Descrição

O sistema armazena senhas de usuários em texto plano ao invés de usar hash criptográfico. Isso representa um risco crítico de segurança, pois em caso de vazamento de dados, todas as senhas ficam expostas.

#### Ambiente

- **Navegador**: Chrome 121.0
- **Sistema Operacional**: Windows 11
- **Data do Teste**: 02/03/2026

#### Passos para Reproduzir

1. Abrir DevTools (F12)
2. Ir para a aba Network
3. Fazer login com usuário `admin` e senha `admin123`
4. Observar a resposta do endpoint `/login`
5. No JSON de resposta, a senha aparece em texto plano: `"password": "admin123"`

Alternativamente:

1. Registrar um novo usuário
2. Verificar a resposta do endpoint `/register`
3. A senha também aparece em texto plano no response

#### Resultado Esperado

- Senhas devem ser armazenadas usando hash forte (bcrypt, Argon2, PBKDF2)
- Senhas NUNCA devem aparecer em responses da API
- Senhas NUNCA devem ser retornadas ao cliente

#### Resultado Atual

- Senhas são armazenadas e enviadas em texto plano
- Qualquer pessoa com acesso ao response pode ver a senha
- Logs do servidor também mostram senhas em texto plano

#### Evidências

**Response do /login:**

```json
{
  "success": true,
  "message": "Login realizado com sucesso!",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@test.com",
    "role": "admin",
    "password": "admin123" // ❌ SENHA EXPOSTA!
  }
}
```

**Código vulnerável (server.js, linha 70-78):**

```javascript
return res.json({
  success: true,
  message: "Login realizado com sucesso!",
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    password: user.password, // ❌ NUNCA fazer isso!
  },
});
```

#### Impacto

**CRÍTICO**

- Violação grave de segurança e privacidade
- Não está em conformidade com LGPD, GDPR
- Em caso de vazamento, todos os usuários ficam comprometidos
- Usuários que reutilizam senhas ficam vulneráveis em outros sistemas
- Pode resultar em responsabilidade legal para a empresa

#### Sugestão de Correção

1. **Backend (server.js)**:

```javascript
// Instalar bcrypt: npm install bcrypt
const bcrypt = require("bcrypt");

// No registro, fazer hash da senha:
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// No login, compara hash:
const isValidPassword = await bcrypt.compare(password, user.password);

// NUNCA retornar senha no response:
return res.json({
  success: true,
  user: {
    id: user.id,
    username: user.username,
    role: user.role,
    // password NÃO deve estar aqui!
  },
});
```

2. **Migração de dados existentes**:

- Implementar script para fazer hash de senhas existentes
- Forçar reset de senha para todos os usuários (recomendado)

#### Referências

- [OWASP - Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [bcrypt documentation](https://www.npmjs.com/package/bcrypt)

---

## ✅ Exemplo 2: Bug de Lógica

### Bug #15: Login Aceita Senha Incorreta Aleatoriamente

**Severidade**: ⚠️ **CRÍTICA**

**Categoria**: Lógica / Segurança

**Status**: Aberto

#### Descrição

O sistema possui uma falha na lógica de validação de senha que permite login bem-sucedido mesmo com senha incorreta. Através de múltiplas tentativas (aproximadamente 1 em 10), o sistema aceita credenciais inválidas.

#### Ambiente

- **Navegador**: Chrome 121.0
- **Sistema Operacional**: Windows 11
- **Data do Teste**: 02/03/2026

#### Passos para Reproduzir

1. Acessar http://localhost:3000
2. Tentar fazer login com:
   - Usuário: `admin`
   - Senha: `SENHA_ERRADA` (qualquer senha incorreta)
3. Repetir a tentativa múltiplas vezes (10-15 vezes)
4. Observar que eventualmente o login é aceito mesmo com senha errada

Ou:

1. Criar um script para automatizar tentativas
2. Fazer 100 tentativas de login com senha errada
3. Aproximadamente 10% das tentativas serão bem-sucedidas

#### Resultado Esperado

- Login deve SEMPRE falhar quando a senha está incorreta
- Validação de senha deve ser determinística (não aleatória)
- Não deve haver margem de erro em autenticação

#### Resultado Atual

- Aproximadamente 10% das tentativas com senha incorreta são aceitas
- O sistema permite bypass de autenticação por tentativa e erro
- Invalidação completa do sistema de segurança

#### Evidências

**Código vulnerável (server.js, linhas 63-65):**

```javascript
// BUG 8: Lógica de validação de senha com falha
const randomFactor = Math.random();
if (user.password === password || randomFactor < 0.1) {
  // ❌ 10% de chance!
  // Login aceito
}
```

**Teste realizado:**

- 100 tentativas com senha "errada123" para usuário "admin"
- Resultado: 11 logins bem-sucedidos (11%)
- Esperado: 0 logins bem-sucedidos

#### Impacto

**CRÍTICO**

- Bypass completo de autenticação
- Atacante pode fazer força bruta com sucesso
- Invalida completamente o propósito do sistema de login
- Qualquer pessoa pode acessar qualquer conta com persistência

#### Sugestão de Correção

```javascript
// server.js - Remover lógica aleatória completamente
if (user.password === password) {
  // Apenas isso!
  // Login aceito
} else {
  // Login rejeitado
}
```

**Correção completa sugerida:**

```javascript
// Usar comparação segura com bcrypt
const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

if (isValidPassword) {
  // Login aceito
} else {
  // Login rejeitado - SEM lógica aleatória!
}
```

---

## ✅ Exemplo 3: Bug de UX/UI

### Bug #27: Checkbox "Lembrar-me" Não Funciona

**Severidade**: 🟡 **MÉDIA**

**Categoria**: UX/UI

**Status**: Aberto

#### Descrição

O formulário de login possui um checkbox "Lembrar-me", mas esta funcionalidade não está implementada. O checkbox é puramente visual e não afeta o comportamento do sistema.

#### Ambiente

- **Navegador**: Chrome 121.0
- **Sistema Operacional**: Windows 11
- **Data do Teste**: 02/03/2026

#### Passos para Reproduzir

1. Acessar a página de login
2. Inserir credenciais válidas
3. Marcar o checkbox "Lembrar-me"
4. Fazer login com sucesso
5. Fechar o navegador completamente
6. Abrir novamente e acessar o site
7. Observar que é necessário fazer login novamente

#### Resultado Esperado

- Quando "Lembrar-me" está marcado, a sessão deve persistir após fechar o navegador
- Ou o campo de usuário deve ser pré-preenchido
- Alguma funcionalidade deve ser implementada

#### Resultado Atual

- Checkbox aparece na interface mas não faz nada
- Comportamento é idêntico com ou sem marcar o checkbox
- Usuário é sempre deslogado ao fechar o navegador

#### Evidências

**HTML (index.html, linhas 30-33):**

```html
<div class="form-group">
  <input type="checkbox" id="rememberMe" />
  <label for="rememberMe">Lembrar-me</label>
</div>
```

**JavaScript (script.js):**

- Não há código que leia o estado do checkbox
- Não há implementação da funcionalidade
- Campo é ignorado no submit do formulário

#### Impacto

**MÉDIO**

- Não representa risco de segurança
- UX ruim - promessa não cumprida
- Usuário pode ficar frustrado
- Aparência de sistema mal implementado

#### Sugestão de Correção

**Opção 1: Implementar a funcionalidade**

```javascript
// script.js - No login
const rememberMe = document.getElementById("rememberMe").checked;

// Enviar ao backend
body: JSON.stringify({
  username,
  password,
  rememberMe,
});

// Backend ajusta duração do cookie baseado no flag
```

**Opção 2: Remover o checkbox**

```html
<!-- Se a funcionalidade não é necessária, remover: -->
<!-- <input type="checkbox" id="rememberMe"> -->
```

**Opção 3: Usar apenas para pré-preencher username**

```javascript
// Salvar username em localStorage quando marcado
if (rememberMe) {
  localStorage.setItem("rememberedUser", username);
} else {
  localStorage.removeItem("rememberedUser");
}

// Pré-preencher no load da página
window.onload = () => {
  const remembered = localStorage.getItem("rememberedUser");
  if (remembered) {
    document.getElementById("loginUsername").value = remembered;
    document.getElementById("rememberMe").checked = true;
  }
};
```

---

## ✅ Exemplo 4: Bug de Validação

### Bug #30: Campo Email com Tipo Incorreto

**Severidade**: 🟢 **BAIXA**

**Categoria**: UX/UI / Validação

**Status**: Aberto

#### Descrição

O campo de email no formulário de registro está configurado com `type="text"` ao invés de `type="email"`, perdendo validações nativas do HTML5 e piorando a experiência em dispositivos móveis.

#### Ambiente

- **Navegador**: Chrome 121.0 / iOS Safari
- **Sistema Operacional**: Windows 11 / iOS 17
- **Data do Teste**: 02/03/2026

#### Passos para Reproduzir

1. Acessar a página de registro
2. Inspecionar o campo de email
3. Observar que o atributo type="text"
4. Testar em dispositivo móvel e notar que o teclado não mostra '@'

#### Resultado Esperado

- Campo deve usar `type="email"`
- Validação HTML5 nativa deve funcionar
- Em mobile, teclado deve incluir '@'

#### Resultado Atual

- Campo usa `type="text"`
- Aceita qualquer texto sem validação nativa
- Em mobile, teclado alfanumérico padrão

#### Evidências

**HTML incorreto (index.html, linha 47):**

```html
<input type="text" id="registerEmail" name="email" />
```

**Deveria ser:**

```html
<input type="email" id="registerEmail" name="email" required />
```

#### Impacto

**BAIXO**

- Não é um risco de segurança grave
- UX piorada especialmente em mobile
- Perde validações automáticas do navegador
- Facilita erros de digitação

#### Sugestão de Correção

```html
<input
  type="email"
  id="registerEmail"
  name="email"
  required
  placeholder="seu@email.com"
  autocomplete="email"
/>
```

---

## 📊 Comparação: Documentação Ruim vs Boa

### ❌ Exemplo de Documentação RUIM:

**Bug**: Login não funciona
**Severidade**: Alta
**Descrição**: Às vezes o login não funciona direito

❌ **Problemas**:

- Título vago
- Sem passos para reproduzir
- Sem evidências
- "Às vezes" não é específico
- Sem informações técnicas

### ✅ Exemplo de Documentação BOA:

**Bug**: Login Aceita Senha Incorreta em 10% das Tentativas
**Severidade**: Crítica - Segurança
**Descrição**: Detalhada com contexto técnico
**Passos**: Reproduzíveis e específicos
**Evidências**: Código fonte + testes realizados
**Impacto**: Claro e quantificado
**Sugestão**: Correção técnica específica

---

## 💡 Checklist para Bug Report de Qualidade

Cada bug deve ter:

- [ ] Título claro e descritivo
- [ ] Severidade correta (Crítica/Alta/Média/Baixa)
- [ ] Categoria (Segurança/Lógica/UX/Performance)
- [ ] Descrição completa do problema
- [ ] Ambiente de teste documentado
- [ ] Passos para reproduzir (numerados e claros)
- [ ] Resultado esperado
- [ ] Resultado atual
- [ ] Evidências (screenshots, código, logs)
- [ ] Análise de impacto
- [ ] Sugestão de correção (quando possível)

---

## 🎯 Dicas Finais

1. **Seja específico**: "Login falha" vs "Login aceita senha errada 10% das vezes"
2. **Forneça contexto**: Sempre inclua ambiente e passos
3. **Use evidências**: Screenshots e código são poderosos
4. **Quantifique**: "Às vezes" vs "10% das tentativas"
5. **Seja profissional**: Tom construtivo, não acusatório
6. **Priorize**: Bugs críticos primeiro
7. **Pense no leitor**: Desenvolvedor deve entender facilmente

---

Use estes exemplos como referência para criar seus próprios relatórios de bugs! 🚀
