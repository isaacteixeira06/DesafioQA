# 📦 Resumo do Projeto - Sistema de Login para Testes QA

## 🎯 O que foi criado?

Um sistema completo de autenticação web com **bugs intencionais** para testar habilidades de QA.

---

## 📂 Estrutura de Arquivos

```
qa-test/
│
├── 📄 server.js                    # Backend com 24 bugs principais
├── 📄 package.json                 # Dependências do projeto
├── 📄 start.bat                    # Script para iniciar no Windows
├── 📄 .env.example                 # Exemplo de variáveis de ambiente
├── 📄 .gitignore                   # Arquivos ignorados pelo Git
│
├── 📁 public/                      # Frontend
│   ├── index.html                  # Página de login/registro (9 bugs)
│   ├── dashboard.html              # Dashboard autenticado (2 bugs)
│   ├── style.css                   # Estilos (1 bug)
│   ├── script.js                   # Lógica login/registro (15 bugs)
│   └── dashboard.js                # Lógica dashboard (10 bugs)
│
├── 📘 README.md                    # ✅ COMPARTILHAR com QA
├── 📘 TEMPLATE_RELATORIO.md        # ✅ COMPARTILHAR com QA
├── 📘 CHECKLIST_TESTES.md          # ✅ COMPARTILHAR com QA
│
├── 🔒 BUGS_GABARITO.md            # ⛔ NÃO compartilhar (gabarito completo)
├── 🔒 GUIA_AVALIACAO.md           # ⛔ NÃO compartilhar (critérios)
└── 🔒 PROJETO_RESUMO.md           # Este arquivo
```

---

## 🐛 Categorização dos Bugs

### Total: 60+ bugs intencionais

| Categoria            | Quantidade | Severidade  |
| -------------------- | ---------- | ----------- |
| 🔴 Segurança Crítica | 25         | Crítica     |
| 🟠 Lógica de Negócio | 20         | Alta/Média  |
| 🟡 UX/UI             | 10         | Média/Baixa |
| 🟢 Boas Práticas     | 5+         | Baixa       |

---

## 🔴 Bugs Críticos Principais

1. **Senhas em texto plano** - Armazenadas e enviadas sem hash
2. **SQL Injection** - Vulnerável a ataques de injeção
3. **Lógica aleatória no login** - 10% de chance de aceitar senha errada
4. **Exposição de dados** - Senhas visíveis em responses e tela
5. **Backdoor administrativo** - `?admin=true` bypassa autenticação
6. **Reset de senha sem verificação** - Qualquer um pode resetar qualquer senha
7. **Rate limiting ineficaz** - Permite 1000 tentativas antes de bloquear
8. **Mensagens de erro reveladoras** - Enumeration de usuários
9. **Sessão insegura** - Secret fraco, cookies não protegidos
10. **Dados sensíveis no localStorage** - Senhas armazenadas no browser

---

## 🎓 Como Usar Este Projeto

### Para Instrutor/Avaliador:

1. **Antes do Teste**:
   - Leia `BUGS_GABARITO.md` (gabarito completo)
   - Leia `GUIA_AVALIACAO.md` (critérios de avaliação)
   - Defina tempo de teste (2-4 horas recomendado)

2. **Fornecer ao QA**:
   - ✅ `README.md` - Instruções do projeto
   - ✅ `CHECKLIST_TESTES.md` - Guia de testes
   - ✅ `TEMPLATE_RELATORIO.md` - Template para documentar bugs

3. **NÃO Fornecer**:
   - ⛔ `BUGS_GABARITO.md`
   - ⛔ `GUIA_AVALIACAO.md`
   - ⛔ `PROJETO_RESUMO.md`

4. **Após o Teste**:
   - Compare com o gabarito
   - Use critérios do GUIA_AVALIACAO.md
   - Forneça feedback construtivo

---

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start
# OU
start.bat

# Acessar no navegador
http://localhost:3000
```

---

## 👥 Usuários Pré-cadastrados

| Username | Password | Role  |
| -------- | -------- | ----- |
| admin    | admin123 | admin |
| user     | user123  | user  |
| teste    | 123456   | user  |

---

## 📊 Níveis de Avaliação

| Bugs Encontrados | Nível     | Avaliação                       |
| ---------------- | --------- | ------------------------------- |
| 0-10             | Iniciante | Precisa desenvolver habilidades |
| 11-20            | Júnior    | Encontra bugs óbvios            |
| 21-35            | Pleno     | Boa capacidade analítica        |
| 36-50            | Sênior    | Excelente QA                    |
| 51-60+           | Expert    | QA excepcional                  |

---

## 🎯 Objetivos de Aprendizado

Este projeto ensina/avalia:

### Para QA:

1. **Segurança**: Identificar vulnerabilidades comuns (OWASP)
2. **Pensamento Crítico**: Testar além do happy path
3. **Documentação**: Escrever reports claros
4. **Ferramentas**: Usar DevTools efetivamente
5. **Priorização**: Classificar bugs por severidade

### Para Instrutores:

1. Avaliar habilidades técnicas
2. Avaliar capacidade de documentação
3. Identificar gaps de conhecimento
4. Medir experiência real vs declarada

---

## 🔧 Tecnologias Utilizadas

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Session**: Express-Session
- **Body Parser**: Para JSON/form data

**Nota**: Intencionalmente simples para focar nos bugs de lógica e segurança.

---

## 📚 Conceitos Cobertos

### Segurança:

- ✅ SQL Injection
- ✅ XSS (Cross-Site Scripting)
- ✅ CSRF (Cross-Site Request Forgery)
- ✅ Autenticação e Autorização
- ✅ Gestão de Sessões
- ✅ Exposição de Dados Sensíveis
- ✅ Rate Limiting
- ✅ Validação de Input
- ✅ Armazenamento de Senhas

### Lógica:

- ✅ Validações de negócio
- ✅ Fluxos de autenticação
- ✅ Edge cases
- ✅ Condições e comparações

### UX:

- ✅ Validação de formulários
- ✅ Mensagens de erro
- ✅ Feedback ao usuário
- ✅ Usabilidade

---

## 🎁 Extras Incluídos

1. **Template de Relatório**: Estrutura profissional para documentar bugs
2. **Checklist de Testes**: Guia sistemático de áreas para testar
3. **Gabarito Completo**: Todos os 60+ bugs documentados
4. **Guia de Avaliação**: Critérios objetivos de pontuação
5. **Script de Início**: Facilita start do projeto (start.bat)

---

## 💡 Dicas de Uso

### Para Processos Seletivos:

- Teste técnico para vagas de QA
- Avaliar nível de experiência
- Comparar candidatos objetivamente

### Para Treinamento:

- Ensinar conceitos de segurança
- Praticar documentação de bugs
- Desenvolver pensamento crítico

### Para Entrevistas:

- Discussão pós-teste sobre achados
- Avaliar comunicação
- Entender processo de pensamento

---

## ⚠️ Avisos Importantes

1. **Não usar em produção**: Este código é intencionalmente inseguro
2. **Manter gabarito em segredo**: Não compartilhar com candidatos
3. **Ser consistente**: Mesmo tempo/instruções para todos
4. **Dar feedback**: Ajudar candidatos a melhorar
5. **Documentar**: Registrar avaliações para referência

---

## 🔄 Possíveis Melhorias Futuras

- [ ] Adicionar banco de dados real
- [ ] Criar versão com bugs de performance
- [ ] Adicionar testes automatizados de exemplo
- [ ] Criar variações do teste (fácil/difícil)
- [ ] Adicionar bugs de acessibilidade
- [ ] Criar versão mobile/responsiva
- [ ] Adicionar métricas de teste

---

## 📈 Estatísticas de Uso

Recomendações baseadas em experiência:

- **Tempo médio júnior**: 3-4 horas
- **Tempo médio pleno**: 2-3 horas
- **Tempo médio sênior**: 2 horas
- **Bugs médios encontrados júnior**: 15-20
- **Bugs médios encontrados pleno**: 30-40
- **Bugs médios encontrados sênior**: 50+

---

## 🏆 Cases de Sucesso

Este tipo de teste ajuda a:

1. **Reduzir falsos positivos** em entrevistas
2. **Identificar talentos reais** vs currículos inflados
3. **Avaliar múltiplas competências** simultaneamente
4. **Proporcionar experiência prática** ao candidato
5. **Dar feedback objetivo** para desenvolvimento

---

## 📞 Suporte e Customização

Este projeto é **totalmente customizável**:

- Adicione mais bugs
- Modifique severidades
- Adapte para sua stack
- Ajuste tempo de teste
- Crie variações

---

## ✅ Checklist Pré-Uso

Antes de usar com um candidato:

- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor testado (`npm start`)
- [ ] Gabarito atualizado
- [ ] Critérios de avaliação definidos
- [ ] Tempo de teste definido
- [ ] Template de feedback preparado
- [ ] Instruções claras para o candidato

---

## 🎓 Licença de Uso

Este projeto é livre para uso em:

- Processos seletivos
- Treinamentos internos
- Educação e ensino
- Prática pessoal

**Não é permitido**:

- Vender este projeto
- Usar o código em produção (é inseguro por design)
- Compartilhar gabarito com candidatos

---

## 📝 Versão

**Versão**: 1.0.0
**Data de Criação**: 02/03/2026
**Última Atualização**: 02/03/2026

---

## 🎯 Objetivo Final

> **Criar uma ferramenta justa, técnica e educacional para avaliar e desenvolver profissionais de QA.**

Este projeto simula situações reais de forma controlada, permitindo avaliar como um QA:

- Pensa sistematicamente
- Identifica vulnerabilidades
- Documenta problemas
- Prioriza trabalho
- Comunica descobertas

---

**Boa sorte usando este projeto!** 🚀

Que ele ajude a identificar e desenvolver grandes profissionais de QA!
