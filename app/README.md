# Sistema de Login com Bugs - QA Test

Este é um projeto de teste para avaliar habilidades de QA. O sistema possui funcionalidades de login, registro e autenticação, mas **contém bugs intencionais** que devem ser encontrados e documentados.

## 🎯 Objetivo

Testar a capacidade de um QA em identificar bugs de segurança, lógica, UX e funcionais em um sistema de autenticação.

## 🚀 Como Executar

### Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- (Opcional) Docker e Docker Compose para execução containerizada

### Instalação e Execução (Método 1: Direto com Node.js)

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor:

```bash
npm start
```

3. Acesse no navegador:

```
http://localhost:3000
```

### Instalação e Execução (Método 2: Com Docker)

1. Certifique-se de ter Docker e Docker Compose instalados

2. Execute com Docker Compose:

```bash
docker-compose up
```

3. O servidor estará disponível em:

```
http://localhost:3000
```

Para parar os containers:

```bash
docker-compose down
```

### Health Check (Verificação de Status)

Para verificar se o servidor está rodando corretamente:

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "timestamp": "2026-03-02T10:30:45.123Z",
  "uptime": 12345.67
}
```

## 👥 Usuários de Teste

O sistema já vem com usuários pré-cadastrados para facilitar os testes:

| Usuário | Senha    | Role  |
| ------- | -------- | ----- |
| admin   | admin123 | admin |
| user    | user123  | user  |
| teste   | 123456   | user  |

## 📋 Funcionalidades

- ✅ Login de usuários
- ✅ Registro de novos usuários
- ✅ Reset de senha
- ✅ Dashboard de usuário
- ✅ Painel administrativo
- ✅ Logout
- ✅ **Coleta de Dados (Módulo Principal)**
  - Coleta individual de indicadores de desempenho
  - Upload em lote de beneficiários
  - Histórico de coletas realizadas
  - Pré-visualização de dados antes de submissão

## 🔍 Tarefa do QA

Objetivo: Encontrar o máximo de bugs possível no sistema.

### Categorias de Bugs a Procurar:

1. **Segurança**
   - Validação de dados
   - Autenticação e autorização
   - Exposição de informações sensíveis
   - Vulnerabilidades comuns (SQL Injection, XSS, etc.)

2. **Lógica de Negócio**
   - Validações incorretas
   - Fluxos que não funcionam como esperado
   - Condições que permitem comportamentos inesperados

3. **UX/UI**
   - Campos sem validação apropriada
   - Mensagens de erro inadequadas
   - Comportamentos inconsistentes

4. **Performance e Boas Práticas**
   - Código inseguro
   - Práticas não recomendadas
   - Problemas de performance

## 📝 Como Reportar Bugs

Para cada bug encontrado, documente:

1. **Título do Bug**: Descrição curta e clara
2. **Severidade**: Crítica / Alta / Média / Baixa
3. **Categoria**: Segurança / Lógica / UX / Performance
4. **Passos para Reproduzir**: Como encontrar o bug
5. **Resultado Esperado**: O que deveria acontecer
6. **Resultado Atual**: O que realmente acontece
7. **Evidência**: Screenshot, log ou código relacionado
8. **Sugestão de Correção**: (Opcional) Como corrigir

## 🎓 Dicas para Teste

- Teste com dados válidos e inválidos
- Tente casos extremos (edge cases)
- Teste a segurança do sistema
- Verifique o código fonte
- Use as ferramentas de desenvolvedor do navegador
- Teste diferentes fluxos de usuário
- Verifique as APIs no Network tab

## 📊 Módulo de Coleta de Dados

O sistema possui um módulo completo de coleta de dados de beneficiários, acessível via `/coleta` após autenticação.

### Funcionalidades do Módulo

1. **Coleta Individual**
   - Formulário para registrar dados de um beneficiário
   - Campos: ID, Nome, Taxa de Conclusão, Frequência, Nota, Progresso
   - Observações e Status de avaliação
   - Pré-visualização em JSON antes de submissão

2. **Coleta em Lote**
   - Upload de arquivo CSV/Excel
   - Validação (ou não) de duplicatas
   - Importação em massa de beneficiários

3. **Histórico**
   - Visualizar todas as coletas realizadas
   - Informações de quem fez cada coleta
   - Datas e indicadores de desempenho

### Bugs Conhecidos no Módulo (Documentados)

| ID  | Descrição                                               | Severidade | Tipo          |
| --- | ------------------------------------------------------- | ---------- | ------------- |
| 43  | Campo ID aceita qualquer valor sem validação numérica   | Média      | Lógica        |
| 44  | Não valida comprimento mínimo/máximo do nome            | Média      | Lógica        |
| 45  | Aceita valores negativos em Taxa de Conclusão           | Alta       | Validação     |
| 46  | Aceita valores acima de 100 em Frequência (%)           | Alta       | Validação     |
| 47  | Não limita Nota de Avaliação ao máximo de 10            | Alta       | Validação     |
| 48  | Sem limite de caracteres em Observações (XSS potencial) | Alta       | Segurança     |
| 49  | Sem validação padrão de Status                          | Média      | Lógica        |
| 50  | Não valida tipo de arquivo realmente                    | Média      | Segurança     |
| 51  | Validação de duplicatas não funciona                    | Média      | Lógica        |
| 52  | Histórico visível para todos os usuários                | Crítica    | Segurança     |
| 53  | Usa == ao invés de === na validação                     | Média      | Lógica        |
| 54  | Não valida que indicadores são números                  | Média      | Validação     |
| 55  | Aceita valores negativos sem validação                  | Alta       | Validação     |
| 56  | Não valida tamanho de observações                       | Média      | Validação     |
| 57  | Não sanitiza entrada de observações                     | Crítica    | Segurança/XSS |
| 58  | Mensagem de sucesso desaparece muito rápido             | Baixa      | UX            |
| 59  | Mensagem de erro expõe detalhes técnicos                | Média      | Segurança     |
| 60  | Não valida tipo de arquivo no cliente                   | Média      | Segurança     |
| 61  | Sem limite de tamanho de arquivo                        | Média      | Performance   |
| 62  | Quantidade inserida pode estar incorreta                | Baixa      | Lógica        |
| 63  | Não filtra coletas por usuário                          | Crítica    | Segurança     |
| 64  | Mostra dados de coletas de outros usuários              | Crítica    | Segurança     |
| 65  | Expõe nome do usuário em histórico                      | Média      | Segurança     |
| 66  | Rota de coleta sem autenticação validada corretamente   | Crítica    | Segurança     |
| 67  | API de coleta aceita campos sem validação               | Alta       | Segurança     |
| 68  | Validação fraca de campos obrigatórios                  | Média      | Validação     |
| 69  | Não valida tipo de dados dos indicadores                | Média      | Validação     |
| 70  | Não valida faixa de valores (0-100)                     | Alta       | Validação     |
| 71  | Não valida limite máximo da nota (0-10)                 | Alta       | Validação     |
| 72  | Não valida fuso horário do timestamp                    | Baixa      | Lógica        |
| 73  | Retorna dados sensíveis em resposta de sucesso          | Média      | Segurança     |
| 74  | Retorna histórico sem filtrar por usuário               | Crítica    | Segurança     |
| 75  | Expõe coletas de todos os usuários                      | Crítica    | Segurança     |
| 76  | Expõe informação de usuarioColeta                       | Média      | Segurança     |
| 77  | Upload em lote sem validação real                       | Média      | Segurança     |
| 78  | Não processa arquivo enviado realmente                  | Média      | Lógica        |
| 79  | Simula sucesso sem validar dados reais                  | Alta       | Lógica        |
| 80  | Não valida campos obrigatórios do CSV                   | Média      | Validação     |
| 81  | Não registra qual usuário fez upload                    | Média      | Segurança     |
| 82  | Não valida integridade de dados                         | Media      | Segurança     |
| 83  | Health check sem validação de integridade               | Baixa      | Monitoramento |
| 84  | Menu de navegação sem proteção de acesso                | Média      | Segurança     |

## 🤖 Testes Automatizados com Cypress

O projeto inclui testes automatizados usando Cypress para automação E2E.

### Instalação de Dependências de Teste

```bash
npm install --save-dev
```

### Executar Testes Automatizados

#### Modo Headless (CLI):

```bash
npm test
```

#### Modo Interativo (UI):

```bash
npm run test:open
```

### Estrutura dos Testes

Os testes estão organizados em:

- `cypress/e2e/` - Testes End-to-End
  - `login.cy.js` - Testes de login (7 testes)
  - `register.cy.js` - Testes de registro (5 testes)
  - `coleta.cy.js` - Testes do módulo de coleta (25+ testes)
  - `pages/LoginPage.js` - Page Object pattern

### Cenários BDD (Gherkin)

Cenários de teste em formato BDD estão disponíveis em `features/`:

- `login.feature` - Cenários de autenticação (7 cenários)
- `registro.feature` - Cenários de registro (8 cenários)
- `seguranca.feature` - Cenários de segurança (10 cenários)
- `coleta.feature` - Cenários do módulo de coleta (20+ cenários)

### Seletores para Automação

O projeto utiliza `data-testid` para automação robusta:

```html
<!-- Exemplo de uso -->
<input type="text" data-testid="login-username" />
<button data-testid="login-button">Entrar</button>
```

Use estes seletores nas automações Cypress para melhor resiliência.

## ⚠️ Avisos

- Este é um projeto de teste e **NÃO deve ser usado em produção**
- Os bugs são intencionais para fins educacionais
- Não contém banco de dados real (usa array em memória)

## 📁 Estrutura do Projeto

```
qa-test/
├── server.js              # Backend Node.js/Express (com endpoints de coleta)
├── package.json          # Dependências (Cypress, nodemon)
├── dockerfile            # Configuração Docker (Node.js 18)
├── docker-compose.yml    # Orquestração de containers
├── cypress.config.js     # Configuração Cypress
├── public/              # Frontend
│   ├── index.html       # Página de login/registro
│   ├── dashboard.html   # Dashboard do usuário (com link para coleta)
│   ├── coleta.html      # Página de coleta de dados
│   ├── style.css        # Estilos
│   ├── script.js        # Lógica de login/registro
│   ├── dashboard.js     # Lógica do dashboard
│   └── coleta.js        # Lógica do módulo de coleta
├── cypress/             # Testes automatizados
│   ├── e2e/             # Testes End-to-End
│   │   ├── login.cy.js      # Testes de login (7 testes)
│   │   ├── register.cy.js   # Testes de registro (5 testes)
│   │   ├── coleta.cy.js     # Testes de coleta (25+ testes)
│   │   └── pages/           # Page Objects
│   │       └── LoginPage.js
│   └── support/         # Suporte e comandos customizados
│       ├── commands.js  # Comandos customizados (login, register, logout)
│       └── e2e.js       # Setup de testes
├── features/            # Cenários BDD (Gherkin)
│   ├── login.feature        # Cenários de login (7 cenários)
│   ├── registro.feature     # Cenários de registro (8 cenários)
│   ├── seguranca.feature    # Cenários de segurança (10 cenários)
│   └── coleta.feature       # Cenários de coleta (20+ cenários)
├── BUGS_GABARITO.md     # Lista completa de bugs (documentados)
├── README.md           # Este arquivo
└── ...
```

## 🏆 Meta

Há **mais de 84 bugs** intencionais neste sistema. Quantos você consegue encontrar?

Destes, **42 bugs** estão no módulo de coleta de dados (BUGs 43-84).

```

Boa sorte! 🚀
```
