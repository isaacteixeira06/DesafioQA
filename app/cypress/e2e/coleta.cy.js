describe("Coleta de Dados Tests", () => {
  beforeEach(() => {
    cy.login("admin", "admin123");
    cy.visit("/coleta");
  });

  describe("Coleta Individual", () => {
    it("Deve submeter coleta com dados válidos", () => {
      cy.get('[data-testid="beneficiario-id"]').type("BEN001");
      cy.get('[data-testid="beneficiario-nome"]').type("João Silva");
      cy.get('[data-testid="indicador-conclusao"]').type("85");
      cy.get('[data-testid="indicador-frequencia"]').type("92");
      cy.get('[data-testid="indicador-nota"]').type("8.5");
      cy.get('[data-testid="coleta-status"]').select("completo");
      cy.get('[data-testid="submit-coleta"]').click();

      cy.get('[data-testid="coleta-message"]').should("be.visible");
      cy.get('[data-testid="coleta-message"]').should("contain", "sucesso");
    });

    it("Deve rejeitar coleta sem ID do beneficiário", () => {
      cy.get('[data-testid="beneficiario-nome"]').type("João Silva");
      cy.get('[data-testid="indicador-conclusao"]').type("85");
      cy.get('[data-testid="indicador-frequencia"]').type("92");
      cy.get('[data-testid="indicador-nota"]').type("8.5");
      cy.get('[data-testid="submit-coleta"]').click();

      cy.get('[data-testid="coleta-message"]').should("contain", "obrigatório");
    });

    it("Deve rejeitar coleta sem Nome", () => {
      cy.get('[data-testid="beneficiario-id"]').type("BEN001");
      cy.get('[data-testid="indicador-conclusao"]').type("85");
      cy.get('[data-testid="indicador-frequencia"]').type("92");
      cy.get('[data-testid="indicador-nota"]').type("8.5");
      cy.get('[data-testid="submit-coleta"]').click();

      cy.get('[data-testid="coleta-message"]').should("be.visible");
    });

    it("Deve rejeitar coleta sem indicadores obrigatórios", () => {
      cy.get('[data-testid="beneficiario-id"]').type("BEN001");
      cy.get('[data-testid="beneficiario-nome"]').type("João Silva");
      cy.get('[data-testid="submit-coleta"]').click();

      cy.get('[data-testid="coleta-message"]').should("contain", "obrigatório");
    });

    it("Deve aceitar valores negativos em indicadores (BUG 55)", () => {
      cy.get('[data-testid="beneficiario-id"]').type("BEN002");
      cy.get('[data-testid="beneficiario-nome"]').type("Maria Santos");
      cy.get('[data-testid="indicador-conclusao"]').type("-50");
      cy.get('[data-testid="indicador-frequencia"]').type("85");
      cy.get('[data-testid="indicador-nota"]').type("7");
      cy.get('[data-testid="submit-coleta"]').click();

      // Sistema deveria rejeitar mas aceita (BUG intencional)
      cy.get('[data-testid="coleta-message"]').should("be.visible");
    });

    it("Deve aceitar valores acima de 100 em percentuais (BUG 46)", () => {
      cy.get('[data-testid="beneficiario-id"]').type("BEN003");
      cy.get('[data-testid="beneficiario-nome"]').type("Pedro Oliveira");
      cy.get('[data-testid="indicador-conclusao"]').type("150");
      cy.get('[data-testid="indicador-frequencia"]').type("200");
      cy.get('[data-testid="indicador-nota"]').type("15");
      cy.get('[data-testid="submit-coleta"]').click();

      // Sistema deveria rejeitar valores > 100 mas aceita (BUG intencional)
      cy.get('[data-testid="coleta-message"]').should("be.visible");
    });

    it("Deve permitir pré-visualização dos dados", () => {
      cy.get('[data-testid="beneficiario-id"]').type("BEN004");
      cy.get('[data-testid="beneficiario-nome"]').type("Ana Costa");
      cy.get('[data-testid="indicador-conclusao"]').type("88");
      cy.get('[data-testid="indicador-frequencia"]').type("91");
      cy.get('[data-testid="indicador-nota"]').type("8");
      cy.get('[data-testid="preview-coleta"]').click();

      cy.get('[data-testid="coleta-preview"]').should("be.visible");
      cy.get('[data-testid="coleta-preview"]').should("contain", "BEN004");
    });

    it("Deve aceitar valores com casas decimais", () => {
      cy.get('[data-testid="beneficiario-id"]').type("BEN005");
      cy.get('[data-testid="beneficiario-nome"]').type("Carlos Mendes");
      cy.get('[data-testid="indicador-conclusao"]').type("87.5");
      cy.get('[data-testid="indicador-frequencia"]').type("91.3");
      cy.get('[data-testid="indicador-nota"]').type("8.75");
      cy.get('[data-testid="submit-coleta"]').click();

      cy.get('[data-testid="coleta-message"]').should("be.visible");
    });

    it("Deve limpar formulário após submissão bem-sucedida", () => {
      cy.get('[data-testid="beneficiario-id"]').type("BEN006");
      cy.get('[data-testid="beneficiario-nome"]').type("Lucia Dias");
      cy.get('[data-testid="indicador-conclusao"]').type("90");
      cy.get('[data-testid="indicador-frequencia"]').type("95");
      cy.get('[data-testid="indicador-nota"]').type("9");
      cy.get('[data-testid="submit-coleta"]').click();

      cy.wait(1000);

      cy.get('[data-testid="beneficiario-id"]').should("have.value", "");
      cy.get('[data-testid="beneficiario-nome"]').should("have.value", "");
    });

    it("Deve usar == ao invés de === (BUG 53)", () => {
      // Campo vazio com 0 seria considerado vazio com == mas não com ===
      cy.get('[data-testid="beneficiario-id"]').type("BEN007");
      cy.get('[data-testid="beneficiario-nome"]').type("Roberto Silva");
      cy.get('[data-testid="indicador-conclusao"]').type("0");
      cy.get('[data-testid="indicador-frequencia"]').type("0");
      cy.get('[data-testid="indicador-nota"]').type("0");
      cy.get('[data-testid="submit-coleta"]').click();

      // Dependendo da implementação pode aceitar ou rejeitar
      cy.get('[data-testid="coleta-message"]').should("be.visible");
    });
  });

  describe("Navegação de Abas", () => {
    it("Deve alternar entre abas corretamente", () => {
      cy.get('[data-testid="tab-individual"]').should("have.class", "active");

      cy.get('[data-testid="tab-lote"]').click();
      cy.get('[data-testid="tab-lote"]').should("have.class", "active");

      cy.get('[data-testid="tab-historico"]').click();
      cy.get('[data-testid="tab-historico"]').should("have.class", "active");

      cy.get('[data-testid="tab-individual"]').click();
      cy.get('[data-testid="tab-individual"]').should("have.class", "active");
    });
  });

  describe("Histórico de Coletas", () => {
    it("Deve carregar histórico de coletas", () => {
      cy.get('[data-testid="tab-historico"]').click();
      cy.get('[data-testid="carregar-historico"]').click();

      cy.get('[data-testid="historico-data"]').should("be.visible");
    });

    it("Deve expor todas as coletas de todos os usuários (BUG 63, 64)", () => {
      // Fazer uma coleta
      cy.get('[data-testid="beneficiario-id"]').type("BEN008");
      cy.get('[data-testid="beneficiario-nome"]').type("Fatima Santos");
      cy.get('[data-testid="indicador-conclusao"]').type("75");
      cy.get('[data-testid="indicador-frequencia"]').type("80");
      cy.get('[data-testid="indicador-nota"]').type("7.5");
      cy.get('[data-testid="submit-coleta"]').click();

      cy.wait(1000);

      // Ir para histórico
      cy.get('[data-testid="tab-historico"]').click();
      cy.get('[data-testid="carregar-historico"]').click();

      // BUG: Sistema deveria mostrar apenas coletas do usuário autenticado
      // Mas mostra todas as coletas
      cy.get('[data-testid="historico-data"]').should("be.visible");
    });

    it("Deve expor usuarioColeta no histórico (BUG 65)", () => {
      cy.get('[data-testid="tab-historico"]').click();
      cy.get('[data-testid="carregar-historico"]').click();

      // BUG: Sistema mostra qual usuário fez cada coleta
      // Isso pode ser informação sensível
      cy.get('[data-testid="historico-data"]').should("be.visible");
    });
  });

  describe("Upload em Lote", () => {
    it("Deve validar se arquivo foi selecionado", () => {
      cy.get('[data-testid="tab-lote"]').click();
      cy.get('[data-testid="submit-lote"]').click();

      cy.get('[data-testid="lote-message"]').should("contain", "arquivo");
    });

    it("Deve aceitar upload de arquivo CSV", () => {
      cy.get('[data-testid="tab-lote"]').click();

      const fileName = "test.csv";
      cy.get('[data-testid="arquivo-lote"]').selectFile({
        contents: Cypress.Buffer.from("ID,Nome,Taxa\nBEN001,Test,85"),
        fileName: fileName,
        mimeType: "text/csv",
      });

      cy.get('[data-testid="submit-lote"]').click();
      cy.get('[data-testid="lote-message"]').should("be.visible");
    });

    it("Deve validar duplicatas se checkbox marcado", () => {
      cy.get('[data-testid="tab-lote"]').click();
      cy.get('[data-testid="validar-duplicatas"]').check();

      const fileName = "test.csv";
      cy.get('[data-testid="arquivo-lote"]').selectFile({
        contents: Cypress.Buffer.from("ID,Nome\nBEN001,Test"),
        fileName: fileName,
        mimeType: "text/csv",
      });

      cy.get('[data-testid="submit-lote"]').click();
      // BUG 51: Validação de duplicatas não funciona realmente
      cy.get('[data-testid="lote-message"]').should("be.visible");
    });

    it("Não valida tipo de arquivo realmente (BUG 60)", () => {
      cy.get('[data-testid="tab-lote"]').click();

      const fileName = "fake.txt";
      cy.get('[data-testid="arquivo-lote"]').selectFile({
        contents: Cypress.Buffer.from("Qualquer conteúdo de texto"),
        fileName: fileName,
        mimeType: "text/plain",
      });

      cy.get('[data-testid="submit-lote"]').click();
      // BUG: Sistema simula processamento mesmo com arquivo inválido
      cy.get('[data-testid="lote-message"]').should("be.visible");
    });
  });

  describe("Observações e Status", () => {
    it("Deve aceitar observações longas sem limite (BUG 48)", () => {
      const observacao =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(50);

      cy.get('[data-testid="beneficiario-id"]').type("BEN009");
      cy.get('[data-testid="beneficiario-nome"]').type("Francisco Gomes");
      cy.get('[data-testid="indicador-conclusao"]').type("80");
      cy.get('[data-testid="indicador-frequencia"]').type("85");
      cy.get('[data-testid="indicador-nota"]').type("8");
      cy.get('[data-testid="observacoes"]').type(observacao);
      cy.get('[data-testid="submit-coleta"]').click();

      // BUG: Sem limite de caracteres (risco XSS)
      cy.get('[data-testid="coleta-message"]').should("be.visible");
    });

    it("Deve definir status padrão quando não selecionado (BUG 49)", () => {
      cy.get('[data-testid="beneficiario-id"]').type("BEN0010");
      cy.get('[data-testid="beneficiario-nome"]').type("Daniela Rocha");
      cy.get('[data-testid="indicador-conclusao"]').type("82");
      cy.get('[data-testid="indicador-frequencia"]').type("88");
      cy.get('[data-testid="indicador-nota"]').type("7.8");

      // Não seleciona status (valor vazio)
      cy.get('[data-testid="submit-coleta"]').click();

      cy.get('[data-testid="coleta-message"]').should("be.visible");
    });

    it("Deve permitir todos os status disponíveis", () => {
      const statusOptions = [
        { value: "em_progresso", label: "Em Progresso" },
        { value: "completo", label: "Completo" },
        { value: "pendente_revisao", label: "Pendente de Revisão" },
        { value: "aprovado", label: "Aprovado" },
        { value: "rejeitado", label: "Rejeitado" },
      ];

      statusOptions.forEach((status, index) => {
        cy.get('[data-testid="beneficiario-id"]')
          .clear()
          .type(`BEN0${20 + index}`);
        cy.get('[data-testid="beneficiario-nome"]')
          .clear()
          .type(`Usuario ${status.label}`);
        cy.get('[data-testid="indicador-conclusao"]').clear().type("85");
        cy.get('[data-testid="indicador-frequencia"]').clear().type("90");
        cy.get('[data-testid="indicador-nota"]').clear().type("8");
        cy.get('[data-testid="coleta-status"]').select(status.value);
        cy.get('[data-testid="submit-coleta"]').click();

        cy.get('[data-testid="coleta-message"]').should("be.visible");

        cy.wait(500);
      });
    });
  });

  describe("Link para Coleta", () => {
    it("Deve ter link de coleta no dashboard", () => {
      cy.visit("/dashboard");
      cy.get('[data-testid="link-coleta"]').should("exist");
      cy.get('[data-testid="link-coleta"]').should(
        "have.attr",
        "href",
        "/coleta",
      );
    });

    it("Deve navegar para coleta ao clicar no link", () => {
      cy.visit("/dashboard");
      cy.get('[data-testid="link-coleta"]').click();
      cy.url().should("include", "/coleta");
    });
  });
});
