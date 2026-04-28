language: pt

Funcionalidade: Coleta de Dados de Beneficiários
  Como um QA tester
  Eu quero coletar dados de beneficiários
  Para avaliar o desempenho da plataforma de gestão

  Pano de Fundo:
    Dado que estou autenticado como "admin"
    E estou na página de coleta de dados
    E o sistema está pronto para receber coletas

  Cenário: Submeter coleta individual com dados válidos
    Quando eu preencho o ID do beneficiário com "BEN001"
    E eu preencho o nome do beneficiário com "João Silva"
    E eu preencho taxa de conclusão com "85"
    E eu preencho frequência com "92"
    E eu preencho nota com "8.5"
    E eu seleciono status "Completo"
    E eu submeto a coleta
    Então a coleta deve ser aceita com sucesso
    E o formulário deve ser limpo

  Cenário: Rejeitar coleta sem ID do beneficiário
    Quando eu deixo o campo ID vazio
    E eu preencho o nome com "João Silva"
    E eu preencho taxa de conclusão com "85"
    E eu preencho frequência com "92"
    E eu preencho nota com "8.5"
    E eu submeto a coleta
    Então a coleta deve ser rejeitada
    E uma mensagem de erro deve aparecer

  Cenário: Rejeitar coleta sem Nome do beneficiário
    Quando eu preencho o ID com "BEN002"
    E eu deixo o campo nome vazio
    E eu preencho taxa de conclusão com "85"
    E eu preencho frequência com "92"
    E eu preencho nota com "8.5"
    E eu submeto a coleta
    Então a coleta deve ser rejeitada

  Cenário: Aceitar valores negativos em indicadores (BUG 55)
    Quando eu preencho o ID com "BEN003"
    E eu preencho o nome com "Maria Santos"
    E eu preencho taxa de conclusão com "-50"
    E eu preencho frequência com "85"
    E eu preencho nota com "7"
    E eu submeto a coleta
    Então a coleta pode ser aceita (validação inadequada)
    Ou a coleta é rejeitada (comportamento correto)

  Cenário: Aceitar valores acima de 100 em percentuais (BUG 46)
    Quando eu preencho o ID com "BEN004"
    E eu preencho o nome com "Pedro Oliveira"
    E eu preencho taxa de conclusão com "150"
    E eu preencho frequência com "200"
    E eu preencho nota com "15"
    E eu submeto a coleta
    Então a coleta pode ser aceita (BUG intencional)
    Ou uma mensagem de erro deve aparecer

  Cenário: Aceitar valores com casas decimais
    Quando eu preencho o ID com "BEN005"
    E eu preencho o nome com "Carlos Mendes"
    E eu preencho taxa de conclusão com "87.5"
    E eu preencho frequência com "91.3"
    E eu preencho nota com "8.75"
    E eu submeto a coleta
    Então a coleta deve ser aceita com sucesso

  Cenário: Pré-visualizar dados antes de submeter
    Quando eu preencho o ID com "BEN006"
    E eu preencho o nome com "Ana Costa"
    E eu preencho taxa de conclusão com "88"
    E eu preencho frequência com "91"
    E eu preencho nota com "8"
    E eu clico em pré-visualizar
    Então os dados devem ser mostrados em formato JSON
    E eu devo poder ainda submeter a coleta

  Cenário: Observações muito longas sem limite (BUG 48)
    Quando eu preencho o ID com "BEN007"
    E eu preencho o nome com "Roberto Silva"
    E eu preencho indicadores com valores válidos
    E eu adiciono uma observação muito longa (>10000 caracteres)
    E eu submeto a coleta
    Então a coleta é aceita sem validação de comprimento
    E risco de XSS pode estar presente

  Cenário: Histórico expõe dados de todos os usuários (BUG 63, 64)
    Quando eu faço uma coleta
    E eu vou para a aba de histórico
    E eu carrego o histórico
    Então eu vejo TODAS as coletas do sistema
    Ou apenas minhas coletas (comportamento correto)

  Cenário: Histórico mostra usuarioColeta (BUG 65)
    Quando eu carrego o histórico
    Então eu posso ver qual usuário fez cada coleta
    E isso pode ser informação sensível

  Cenário: Upload em lote sem arquivo
    Quando eu vou para aba de lote
    E eu não seleciono nenhum arquivo
    E eu clico em fazer upload
    Então um erro deve aparecer
    E nenhum arquivo deve ser processado

  Cenário: Upload em lote valida tipo de arquivo (BUG 60)
    Quando eu vou para aba de lote
    E eu seleciono um arquivo .txt inválido
    E eu clico em fazer upload
    Então o upload pode ser aceito (sem validação real)
    Ou rejeitado se validação cliente funcionar

  Cenário: Checkbox de validação de duplicatas não funciona (BUG 51)
    Quando eu vou para aba de lote
    E eu marco a opção "Validar duplicatas"
    E eu faço upload de arquivo com dados duplicados
    Então duplicatas não são validadas realmente
    E o arquivo é processado normalmente

  Cenário: Usar == ao invés de === na validação (BUG 53)
    Quando eu preencho o ID com "0"
    E eu preencho o nome com "Test User"
    E eu preencho indicadores
    E eu submeto
    Então o comportamento depende de == vs ===
    E pode ter comportamento inesperado

  Cenário: Status padrão diferente (BUG 49)
    Quando eu não seleciono nenhum status
    E eu submeto a coleta
    Então um status padrão é atribuído
    Ou nenhum status é definido (erro)

  Cenário: Mensagem de sucesso muito rápida (BUG 58)
    Quando eu submeto uma coleta com sucesso
    Então uma mensagem de sucesso aparece
    E a mensagem desaparece após 3 segundos
    E o usuário pode não ter visto a mensagem

  Cenário: Mensagem de erro expõe detalhes técnicos (BUG 59)
    Quando há um erro na requisição
    Então mensagem mostra detalhes técnicos do erro
    E informações sensíveis podem ser expostas

  Cenário: Coleta não filtra por usuário (BUG 63)
    Quando o usuário "user1" faz uma coleta
    E o usuário "user2" também faz uma coleta
    E qualquer usuário carrega o histórico
    Então ambos veem TODAS as coletas
    Ou cada um vê apenas suas coletas (correto)
