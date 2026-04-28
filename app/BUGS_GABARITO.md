# 🐛 LISTA COMPLETA DE BUGS - GABARITO PARA O INSTRUTOR

⚠️ **ATENÇÃO: Este arquivo contém o gabarito completo de todos os bugs intencionais.**
**NÃO compartilhe este arquivo com o QA que será testado!**

---

## 📊 Resumo

- **Total de Bugs**: 60+
- **Críticos (Segurança)**: 25
- **Altos (Lógica)**: 20
- **Médios (UX)**: 10
- **Baixos (Boas Práticas)**: 5+

---

## 🔴 BUGS CRÍTICOS DE SEGURANÇA (25)

### Backend (server.js)

**BUG #1**: Session com secret fraco e hardcoded

- **Local**: server.js:16
- **Código**: `secret: '123456'`
- **Impacto**: Fácil de quebrar sessões
- **Correção**: Usar variável de ambiente com secret forte

**BUG #2**: Senhas armazenadas em texto plano

- **Local**: server.js:27-31
- **Impacto**: Se houver vazamento de dados, todas as senhas são expostas
- **Correção**: Usar bcrypt ou similar para hash de senhas

**BUG #6**: Vulnerável a SQL Injection

- **Local**: server.js:47-49
- **Código**: Concatenação direta de strings SQL
- **Impacto**: Ataque SQL Injection (ex: username: `admin' OR '1'='1`)
- **Correção**: Usar prepared statements ou ORM

**BUG #7**: Mensagem de erro revela informação sensível

- **Local**: server.js:54-58
- **Código**: `Usuário '${username}' não encontrado no sistema`
- **Impacto**: Atacante pode enumerar usuários válidos
- **Correção**: Usar mensagem genérica "Usuário ou senha incorretos"

**BUG #8**: Lógica de validação aceita senha errada

- **Local**: server.js:63-64
- **Código**: `randomFactor < 0.1` = 10% de chance de aceitar senha errada
- **Impacto**: Bypass de autenticação
- **Correção**: Remover lógica aleatória

**BUG #10**: Expõe email no response

- **Local**: server.js:75
- **Impacto**: Vazamento de informação
- **Correção**: Não enviar dados desnecessários

**BUG #11**: NUNCA enviar senha no response

- **Local**: server.js:76
- **Código**: `password: user.password`
- **Impacto**: CRÍTICO - Expõe senha
- **Correção**: Nunca incluir senha em responses

**BUG #13**: Rate limiting não funciona

- **Local**: server.js:87-92
- **Código**: Bloqueia após 1000 tentativas (deveria ser 3-5)
- **Impacto**: Permite ataques de força bruta
- **Correção**: Limitar a 3-5 tentativas e implementar timeout

**BUG #14**: Validação de email muito fraca

- **Local**: server.js:103-105
- **Código**: Só verifica se tem '@'
- **Impacto**: Aceita emails inválidos como "a@b"
- **Correção**: Usar regex apropriado ou biblioteca de validação

**BUG #16**: Não valida força da senha

- **Local**: server.js:115-116
- **Impacto**: Aceita senhas fracas como "1", "a"
- **Correção**: Validar mínimo 8 caracteres, letras, números

**BUG #18**: Não sanitiza input antes de salvar

- **Local**: server.js:127
- **Impacto**: Possível XSS ou injeção de código
- **Correção**: Sanitizar e validar todos os inputs

**BUG #20**: Backdoor com query parameter

- **Local**: server.js:137
- **Código**: `req.query.admin === 'true'`
- **Impacto**: Qualquer um pode acessar com ?admin=true
- **Correção**: Remover backdoor, validar sessão corretamente

**BUG #22**: Aceita userId por query parameter

- **Local**: server.js:149
- **Código**: `req.query.userId`
- **Impacto**: Qualquer um pode ver dados de qualquer usuário
- **Correção**: Usar apenas sessão para identificar usuário

**BUG #23**: Rota admin sem proteção

- **Local**: server.js:163-166
- **Código**: Proteção trivial com secret no query
- **Impacto**: Expõe todos os usuários e senhas
- **Correção**: Validar role do usuário na sessão

**BUG #24**: Reset de senha sem verificação

- **Local**: server.js:171-181
- **Código**: Não requer verificação de identidade
- **Impacto**: Qualquer um pode resetar qualquer senha
- **Correção**: Implementar fluxo com email/token de verificação

**BUG #1.1**: Cookie não seguro

- **Local**: server.js:19
- **Código**: `secure: false, httpOnly: false`
- **Impacto**: Vulnerável a XSS e man-in-the-middle
- **Correção**: secure: true, httpOnly: true

**BUG #1.2**: Tempo de sessão muito longo

- **Local**: server.js:20
- **Código**: `maxAge: 30 * 24 * 60 * 60 * 1000` (30 dias)
- **Impacto**: Sessão pode ser usada por muito tempo se roubada
- **Correção**: Reduzir para 1-2 horas

---

### Frontend

**BUG #37**: Sem menção de HTTPS

- **Local**: script.js:35-40
- **Impacto**: Credenciais podem ser interceptadas
- **Correção**: Usar HTTPS em produção

**BUG #38**: Armazena dados sensíveis no localStorage

- **Local**: script.js:50-51
- **Código**: Armazena objeto user completo (com senha!)
- **Impacto**: Senha acessível via JavaScript
- **Correção**: Nunca armazenar senhas, usar apenas token

**BUG #45**: Armazena senha em localStorage no registro

- **Local**: script.js:90
- **Impacto**: Senha exposta no localStorage
- **Correção**: Não armazenar dados sensíveis

**BUG #52**: Exibe senha do usuário na tela

- **Local**: dashboard.js:20
- **Código**: Mostra senha no HTML
- **Impacto**: Qualquer um olhando a tela vê a senha
- **Correção**: Nunca exibir senhas

**BUG #54**: Hardcoded secret no código do cliente

- **Local**: dashboard.js:31
- **Código**: `secret=admin123`
- **Impacto**: Qualquer um pode ver o secret no código fonte
- **Correção**: Autenticar via sessão, não query params

**BUG #55**: Exibe senhas de todos os usuários

- **Local**: dashboard.js:40-46
- **Impacto**: Exposição massiva de credenciais
- **Correção**: Backend não deve enviar senhas

**BUG #59**: Não há proteção CSRF

- **Local**: Geral
- **Impacto**: Vulnerável a ataques CSRF
- **Correção**: Implementar tokens CSRF

---

## 🟠 BUGS DE LÓGICA (20)

**BUG #3**: Não há validação de força de senha

- **Local**: Backend
- **Impacto**: Aceita senhas fracas
- **Correção**: Validar força da senha

**BUG #4**: Rate limiting não implementado corretamente

- **Local**: server.js:43
- **Impacto**: Contador não é limpo
- **Correção**: Implementar com timeout por IP

**BUG #5**: Não valida campos vazios corretamente

- **Local**: server.js:38-41
- **Impacto**: Pode aceitar strings vazias com espaços
- **Correção**: Usar trim() e validar

**BUG #9**: Não limpa tentativas de login

- **Local**: server.js:67
- **Impacto**: Contador nunca é resetado após sucesso
- **Correção**: Limpar loginAttempts[username] após login

**BUG #12**: Rate limiting nunca bloqueia

- **Local**: server.js:87
- **Impacto**: Condição impossível (> 1000)
- **Correção**: Mudar para 3-5 tentativas

**BUG #15**: Comparação usa == em vez de ===

- **Local**: server.js:108
- **Código**: `u.username == username`
- **Impacto**: Type coercion pode causar bugs
- **Correção**: Usar ===

**BUG #17**: ID gerado pode ser duplicado

- **Local**: server.js:119
- **Código**: `users.length + 1`
- **Impacto**: Se array for manipulado, IDs podem repetir
- **Correção**: Usar UUID ou auto-increment real

**BUG #19**: Loga automaticamente após registro

- **Local**: server.js:128-129
- **Impacto**: Pode não ser o comportamento desejado
- **Correção**: Pedir login após registro (ou ao menos avisar)

**BUG #21**: Não destrói sessão completamente

- **Local**: server.js:147
- **Código**: `req.session.userId = null`
- **Impacto**: Sessão continua existindo
- **Correção**: Usar `req.session.destroy()`

**BUG #32**: Confirmação de senha não é validada no backend

- **Local**: Backend não recebe passwordConfirm
- **Impacto**: Validação só no cliente (pode ser bypassada)
- **Correção**: Validar no backend também

**BUG #36**: Validação aceita strings com apenas espaços

- **Local**: script.js:25-29
- **Código**: `username.length === 0`
- **Impacto**: " " seria aceito
- **Correção**: Usar trim()

**BUG #43**: Usa != em vez de !==

- **Local**: script.js:75
- **Impacto**: Type coercion pode causar bugs sutis
- **Correção**: Usar !==

**BUG #46**: Não requer confirmação de nova senha

- **Local**: reset-password form
- **Impacto**: Usuário pode errar ao digitar
- **Correção**: Adicionar campo de confirmação

**BUG #47**: Não pede email ou código de verificação

- **Local**: reset-password
- **Impacto**: Qualquer um pode resetar qualquer senha
- **Correção**: Implementar fluxo com verificação

**BUG #49**: Não limpa formulários após submit

- **Local**: script.js
- **Impacto**: Dados ficam visíveis após envio
- **Correção**: Limpar campos após sucesso

**BUG #50**: Não previne múltiplos submits

- **Local**: Forms não têm proteção
- **Impacto**: Double-click pode enviar duas vezes
- **Correção**: Desabilitar botão durante submit

**BUG #51**: Não verifica autenticação antes de request

- **Local**: dashboard.js:9
- **Impacto**: Faz request mesmo sem estar logado
- **Correção**: Verificar localStorage ou redirecionar

**BUG #53**: Não redireciona para login se não autenticado

- **Local**: dashboard.js:23
- **Impacto**: Usuário fica em tela de erro
- **Correção**: Redirecionar para /

**BUG #56**: Não limpa localStorage ao fazer logout

- **Local**: dashboard.js:56-58 (comentado)
- **Impacto**: Dados ficam armazenados
- **Correção**: Descomentar e limpar storage

**BUG #57**: Redireciona mesmo se logout falhar

- **Local**: dashboard.js:62
- **Impacto**: Aparência de logout sem realmente deslogar
- **Correção**: Só redirecionar se logout for bem-sucedido

---

## 🟡 BUGS DE UX/UI (10)

**BUG #25**: Campo não tem validação required

- **Local**: index.html:22
- **Impacto**: UX ruim, permite submit vazio
- **Correção**: Adicionar required attribute

**BUG #26**: Campo de senha permite copiar

- **Local**: index.html:27
- **Impacto**: Senha pode ser copiada e colada
- **Correção**: Depende da política, pode adicionar oncopy="return false"

**BUG #27**: Checkbox "Lembrar-me" não faz nada

- **Local**: index.html:31-33
- **Impacto**: Funcionalidade não implementada
- **Correção**: Implementar persistência de sessão

**BUG #28**: Não valida caracteres especiais no username

- **Local**: Validação ausente
- **Impacto**: Pode aceitar @#$% etc.
- **Correção**: Validar apenas alfanuméricos

**BUG #29**: Permite usuários com espaços

- **Local**: Validação ausente
- **Impacto**: UX ruim e possíveis bugs
- **Correção**: Trim e validar sem espaços

**BUG #30**: Tipo do campo deveria ser "email"

- **Local**: index.html:47
- **Código**: `type="text"`
- **Impacto**: Não usa validação nativa de email
- **Correção**: Mudar para type="email"

**BUG #31**: Não mostra requisitos de senha

- **Local**: Form de registro
- **Impacto**: Usuário não sabe requisitos
- **Correção**: Adicionar tooltip ou lista de requisitos

**BUG #33**: UI permite resetar sem verificação

- **Local**: index.html:65
- **Impacto**: Aparência de insegurança
- **Correção**: Melhorar UX do fluxo

**BUG #39**: Delay desnecessário de 1 segundo

- **Local**: script.js:54-56
- **Impacto**: Usuário espera sem necessidade
- **Correção**: Redirecionar imediatamente

**BUG #48**: Mensagem desaparece muito rápido

- **Local**: script.js:143-146
- **Código**: setTimeout 3000ms
- **Impacto**: Usuário pode não ler a mensagem
- **Correção**: Aumentar para 5-7 segundos ou exigir dismiss manual

---

## 🟢 BUGS DE BOAS PRÁTICAS (5+)

**BUG #34**: Seção administrativa visível para todos

- **Local**: dashboard.html:18-23
- **Impacto**: Sugere que funcionalidade está disponível
- **Correção**: Mostrar apenas para admins

**BUG #35**: CSS tem classe específica para mostrar senhas

- **Local**: style.css:145-150
- **Impacto**: Design ruim
- **Correção**: Não ter CSS para exibir senhas

**BUG #40**: Usa console.log em vez de console.error

- **Local**: script.js:60
- **Impacto**: Má prática de debug
- **Correção**: Usar console.error para erros

**BUG #44**: Não valida força da senha no cliente

- **Local**: script.js:79
- **Impacto**: Feedback tardio ao usuário
- **Correção**: Validar também no cliente

**BUG #58**: Não há timeout de sessão por inatividade

- **Local**: Geral
- **Impacto**: Sessão fica aberta indefinidamente
- **Correção**: Implementar timeout de inatividade

**BUG #60**: Console.log expõe muita informação

- **Local**: Vários lugares
- **Impacto**: Em produção expõe dados sensíveis
- **Correção**: Remover logs em produção

---

## 🎯 Bugs Adicionais (Edge Cases)

1. **Sem validação de tamanho máximo de campos**: Aceita inputs gigantes
2. **Sem proteção contra bots**: Falta CAPTCHA
3. **Sem política de senha**: Não exige troca periódica
4. **Sem logs de auditoria**: Impossível rastrear acessos
5. **Sem verificação de email**: Aceita emails falsos
6. **Sem 2FA**: Autenticação de apenas um fator
7. **Headers de segurança ausentes**: Faltam CSP, X-Frame-Options, etc.
8. **Sem tratamento de concorrência**: ID pode colidir
9. **Sem backup/recuperação**: Dados só em memória
10. **Sem versionamento de API**: Quebras não controladas

---

## 📈 Níveis de Avaliação do QA

### 🥉 Nível Júnior (10-20 bugs)

Encontra bugs óbvios de UI e validação básica

### 🥈 Nível Pleno (21-40 bugs)

Encontra bugs de segurança comuns e lógica de negócio

### 🥇 Nível Sênior (41-60 bugs)

Encontra todos os bugs incluindo edge cases e boas práticas

### 🏆 Nível Expert (60+ bugs)

Encontra todos os bugs listados + edge cases adicionais não documentados

---

## 💡 Dicas para Avaliação

Ao avaliar o QA, considere:

1. **Completude**: Quantos bugs foram encontrados?
2. **Priorização**: Bugs críticos foram identificados primeiro?
3. **Documentação**: Reports estão bem escritos?
4. **Reprodução**: Passos para reproduzir estão claros?
5. **Sugestões**: QA propôs correções válidas?
6. **Pensamento crítico**: Encontrou variações de bugs?
7. **Ferramentas**: Usou ferramentas de teste adequadas?

---

## ⚠️ IMPORTANTE

Este gabarito deve ser usado apenas pelo instrutor/avaliador.
Nunca compartilhe com o QA que está sendo testado!

---

**Versão**: 1.0
**Última atualização**: 2026-03-02
