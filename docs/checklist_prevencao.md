# Estratégia e Checklist de Regressão - Pontos Críticos

Este documento define a estratégia de testes de regressão do sistema. Os itens abaixo representam os fluxos vitais e as regras de negócio reais e mais sensíveis da aplicação. 



**Legenda de Cobertura:**
- [x] Validado via Automação (Cypress)
- [X] Validação Manual Pendente

---

## 1. Regras de Negócio e Validações Críticas
- [x] **Limites Lógicos de Coleta:** Validar se os campos "Taxa de Conclusão (%)" e "Frequência de Presença (%)" continuam bloqueando números negativos ou superiores a 100.
- [x] **Limites de Avaliação:** Garantir que o campo "Nota de Avaliação" não aceite valores acima de 10.
- [x] **Tipagem de Identificadores:** Confirmar que o campo "ID do Beneficiário" está bloqueando caracteres alfabéticos ou especiais (aceitando estritamente números).

## 2. Autenticação e Gestão de Sessão
- [x] **Prevenção de Força Bruta (Rate Limiting):** Garantir que o sistema bloqueia tentativas de login após 5 falhas consecutivas (Status `429`).
- [x] **Redefinição de Senha Segura:** Confirmar que a troca de senha exige a verificação de identidade e bloqueia alterações diretas por terceiros (Status `403`).
- [x] **Limpeza de Sessão:** Verificar se a ação de logout limpa permanentemente os objetos da sessão no `localStorage` e cookies.

## 3. Segurança e Prevenção de Injeções
- [x] **Prevenção contra SQL Injection:** Testar payloads maliciosos (ex: `' OR '1'='1`) nos formulários de "Login", "Registro" e "Esqueci minha senha" para atestar a sanitização no backend.
- [x] **Prevenção contra XSS (Cross-Site Scripting):** Inserir tags de script (ex: `<script>alert(1)</script>`) nos campos longos como "Observações", garantindo que a entrada seja escapada e não reflita no navegador de outros usuários.
- [x] **Sigilo de Credenciais:** Confirmar que endpoints do Dashboard não trafeguem senhas no JSON de resposta e que *secrets* não sejam expostos nas URLs.

## 4. Controle de Acesso e Isolamento de Dados (RBAC/IDOR)
- [x] **Multitenancy no Histórico:** Garantir que usuários comuns (`role: user`) só consigam visualizar as próprias coletas ao acessar a aba de Histórico.
- [x] **Restrição do Painel Administrativo:** Confirmar que contas básicas não visualizem componentes de Admin e que chamadas diretas para a API global de usuários retornem `403 Forbidden`.
- [x] **Proteção de Rotas:** Garantir que acessos diretos à rota `/dashboard` sem um token/sessão válida resultem em redirecionamento imediato para a tela de login.

## 5. Integridade no Upload em Lote
- [x] **Validação Rigorosa de Formato (MIME Type):** Garantir que a API recuse o processamento de arquivos que não sejam `.csv`, `.xls` ou `.xlsx`, mesmo que o usuário burle a interface do frontend.
- [x] **Detecção de Duplicatas:** Validar se o backend identifica e rejeita o arquivo caso contenha IDs repetidos na mesma submissão.