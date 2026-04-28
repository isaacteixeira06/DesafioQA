# 📋 Guia de Avaliação do QA - Para Instrutores

## 🎯 Como Usar Este Projeto

Este projeto foi criado para avaliar as habilidades de um profissional de QA através de testes práticos em um sistema com bugs intencionais.

---

## 🚀 Setup Rápido

### Para o Instrutor:

1. **Preparação**:
   ```bash
   npm install
   npm start
   ```
2. **Verificar** que o sistema está funcionando em `http://localhost:3000`

3. **Fornecer ao QA**:
   - Acesso ao README.md
   - Acesso ao TEMPLATE_RELATORIO.md
   - ⚠️ **NÃO fornecer** o arquivo BUGS_GABARITO.md

4. **Definir tempo**: Recomendado 2-4 horas de teste

---

## ⏱️ Formato do Teste

### Opção 1: Teste Prático Individual

- **Duração**: 3-4 horas
- **Formato**: QA trabalha sozinho
- **Entrega**: Relatório escrito de bugs

### Opção 2: Teste com Apresentação

- **Duração**: 2 horas teste + 30 min apresentação
- **Formato**: QA apresenta bugs encontrados
- **Avaliação**: Comunicação + achados técnicos

### Opção 3: Teste em Dupla/Time

- **Duração**: 2-3 horas
- **Formato**: QAs trabalham juntos
- **Avaliação**: Colaboração + cobertura de testes

---

## 📊 Critérios de Avaliação

### 1. Cobertura de Bugs (40 pontos)

| Bugs Encontrados | Pontuação | Nível     |
| ---------------- | --------- | --------- |
| 0-10 bugs        | 0-10 pts  | Iniciante |
| 11-20 bugs       | 11-18 pts | Júnior    |
| 21-35 bugs       | 19-28 pts | Pleno     |
| 36-50 bugs       | 29-36 pts | Sênior    |
| 51-60+ bugs      | 37-40 pts | Expert    |

### 2. Priorização (15 pontos)

- **Excelente (13-15 pts)**: Identificou e priorizou bugs críticos primeiro
- **Bom (10-12 pts)**: Encontrou bugs críticos mas misturou prioridades
- **Regular (7-9 pts)**: Bugs críticos não foram destacados
- **Fraco (0-6 pts)**: Não priorizou adequadamente

### 3. Qualidade da Documentação (20 pontos)

- **Excelente (17-20 pts)**:
  - Passos claros de reprodução
  - Screenshots/evidências
  - Resultado esperado vs atual
  - Sugestões de correção
- **Bom (13-16 pts)**:
  - Boa descrição
  - Passos reproduzíveis
  - Faltam algumas evidências
- **Regular (9-12 pts)**:
  - Descrição básica
  - Passos incompletos
- **Fraco (0-8 pts)**:
  - Descrição vaga
  - Difícil reproduzir

### 4. Pensamento Crítico (15 pontos)

- **Encontrou variações de bugs** (+5 pts)
- **Testou edge cases** (+5 pts)
- **Usou ferramentas adequadas** (+3 pts)
- **Pensou em aspectos de segurança** (+2 pts)

### 5. Comunicação (10 pontos)

- **Clareza** (0-4 pts): Reports fáceis de entender
- **Objetividade** (0-3 pts): Vai direto ao ponto
- **Profissionalismo** (0-3 pts): Tom apropriado

---

## 🎓 Análise de Desempenho

### Por Categoria de Bugs:

**Excelente QA encontra**:

- ✅ 80%+ dos bugs de segurança críticos
- ✅ 60%+ dos bugs de lógica
- ✅ 50%+ dos bugs de UX
- ✅ Alguns bugs de boas práticas

**Bom QA encontra**:

- ✅ 50-70% dos bugs de segurança
- ✅ 40-60% dos bugs de lógica
- ✅ 30-50% dos bugs de UX

**QA em desenvolvimento encontra**:

- ✅ 20-40% dos bugs de segurança
- ✅ 20-40% dos bugs de lógica
- ✅ Maioria dos bugs óbvios de UX

---

## 🔍 O Que Observar Durante o Teste

### Sinais Positivos:

1. **Abordagem Sistemática**:
   - Testa todas as funcionalidades
   - Segue fluxos completos
   - Documenta enquanto testa

2. **Uso de Ferramentas**:
   - DevTools do navegador
   - Network tab para ver requests
   - Inspecting de código fonte
   - Console do navegador

3. **Pensamento de Segurança**:
   - Testa SQL injection
   - Verifica exposição de dados
   - Testa autorização
   - Verifica validações

4. **Criatividade**:
   - Testa casos extremos
   - Tenta bypassar validações
   - Pensa como um atacante
   - Testa fluxos não-óbvios

### Sinais de Alerta:

1. **Teste Superficial**:
   - Só testa happy path
   - Não testa segurança
   - Não lê o código

2. **Documentação Fraca**:
   - Bugs vagos
   - Sem passos de reprodução
   - Sem evidências

3. **Falta de Priorização**:
   - Trata todos os bugs igual
   - Foca em bugs triviais

---

## 📈 Benchmarks por Experiência

### QA Júnior (0-2 anos):

- **Esperado**: 15-25 bugs
- **Foco**: Bugs óbvios de UI e validação
- **Tempo**: 3-4 horas

### QA Pleno (2-5 anos):

- **Esperado**: 30-45 bugs
- **Foco**: Segurança básica + lógica
- **Tempo**: 2-3 horas

### QA Sênior (5+ anos):

- **Esperado**: 50-60+ bugs
- **Foco**: Todos os tipos incluindo edge cases
- **Tempo**: 2-3 horas

---

## 💬 Perguntas para Entrevista Pós-Teste

Após o teste, considere perguntar:

1. **Estratégia**:
   - "Como você abordou este teste?"
   - "Por onde começou e por quê?"

2. **Priorização**:
   - "Quais foram os 3 bugs mais críticos que você encontrou?"
   - "Como você priorizou o que testar?"

3. **Ferramentas**:
   - "Quais ferramentas você usou?"
   - "Como você verificou os bugs de segurança?"

4. **Experiência**:
   - "Havia algo que você queria testar mas não teve tempo?"
   - "O que você mudaria se tivesse mais tempo?"

5. **Conhecimento**:
   - "Você encontrou algum padrão comum nos bugs?"
   - "Como evitaria esses bugs em um projeto real?"

---

## 🎯 Critérios de Aprovação

### Para Contratação:

**Júnior**: Mínimo 15 bugs + boa documentação (50+ pontos)

**Pleno**: Mínimo 30 bugs + encontrou bugs críticos (70+ pontos)

**Sênior**: Mínimo 50 bugs + excelente análise (85+ pontos)

---

## 📝 Feedback ao Candidato

### Estrutura Sugerida:

1. **Pontos Fortes**:
   - Liste o que fizeram bem
   - Destaque insights únicos

2. **Áreas de Melhoria**:
   - Bugs importantes que perderam
   - Aspectos de documentação

3. **Recomendações**:
   - Ferramentas para aprender
   - Áreas para estudar

4. **Resultado Final**:
   - Pontuação total
   - Decisão (aprovado/não aprovado)

---

## 🛠️ Customizações Possíveis

### Tornar Mais Fácil:

- Dar mais tempo
- Fornecer lista de áreas para testar
- Permitir consulta a recursos

### Tornar Mais Difícil:

- Reduzir tempo para 1-2 horas
- Exigir automação de alguns testes
- Pedir correções de bugs também

### Adaptar para Especialidades:

- **QA de Segurança**: Enfatizar bugs de segurança
- **QA de Automação**: Pedir scripts de teste
- **QA de Performance**: Adicionar requisitos de carga

---

## 📚 Recursos Adicionais

### Para o Candidato Estudar Depois:

- OWASP Top 10
- SQL Injection
- Cross-Site Scripting (XSS)
- CSRF Protection
- Autenticação vs Autorização
- Validação de input
- Boas práticas de segurança

---

## ⚠️ Avisos Importantes

1. **Não revelar o gabarito** antes ou durante o teste
2. **Manter consistência** entre candidatos (mesmo tempo, mesmas instruções)
3. **Documentar** o processo de avaliação
4. **Ser justo** na pontuação
5. **Dar feedback** construtivo

---

## 📞 Contato e Suporte

Para dúvidas sobre este projeto de avaliação, consulte:

- README.md - Instruções para o candidato
- BUGS_GABARITO.md - Lista completa de bugs
- TEMPLATE_RELATORIO.md - Template para relatório

---

**Boa sorte na avaliação!** 🚀

Este projeto foi criado para ajudar a identificar talentos em QA de forma justa e técnica.
