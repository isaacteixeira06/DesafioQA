class ColetaPage {
    // --- NAVEGAÇÃO ---
    get abaColetaIndividual() { return cy.contains('Coleta Individual'); }
    get abaColetaEmLote() { return cy.contains('Coleta em Lote'); }
    get abaHistorico() { return cy.contains('Histórico'); }

    // --- DADOS DO BENEFICIÁRIO ---
    get inputIdBeneficiario() { return cy.get('[data-testid="beneficiario-id"]'); }
    get inputNomeCompleto() { return cy.get('[data-testid="beneficiario-nome"]'); }

    // --- INDICADORES DE DESEMPENHO ---
    get inputTaxaConclusao() { return cy.get('[data-testid="indicador-conclusao"]'); }
    get inputFrequenciaPresenca() { return cy.get('[data-testid="indicador-frequencia"]'); }
    get inputNotaAvaliacao() { return cy.get('[data-testid="indicador-nota"]'); }
    get inputProgressoTecnico() { return cy.get('[data-testid="indicador-progresso"]'); }

    // --- OBSERVAÇÕES E STATUS ---
    get textareaObservacoes() { return cy.get('[data-testid="observacoes"]'); }
    get selectStatusAvaliacao() { return cy.get('[data-testid="coleta-status"]'); }

    // --- BOTÕES ---
    get btnSubmeterColeta() { return cy.get('[data-testid="submit-coleta"]'); }
    get btnPreVisualizar() { return cy.get('[data-testid="preview-coleta"]'); }

    // --- COLETA EM LOTE ---
    get inputArquivoLote() { return cy.get('[data-testid="arquivo-lote"]'); }
    get checkboxValidarDuplicatas() { return cy.get('[data-testid="validar-duplicatas"]'); }
    get btnSubmitLote() { return cy.get('[data-testid="submit-lote"]'); }
    get divLoteMessage() { return cy.get('[data-testid="lote-message"]'); }

    // --- HISTÓRICO ---
    get btnCarregarHistorico() { return cy.get('[data-testid="carregar-historico"]'); }
    get divHistoricoData() { return cy.get('[data-testid="historico-data"]'); }

    // --- AÇÕES COMUNS ---
    acessarPagina() {
        cy.visit('/coleta');
    }

    preencherFormularioIndividual(dados: any) {
        if (dados.id) this.inputIdBeneficiario.type(dados.id);
        if (dados.nome) this.inputNomeCompleto.type(dados.nome);
        if (dados.taxa) this.inputTaxaConclusao.type(dados.taxa);
        if (dados.frequencia) this.inputFrequenciaPresenca.type(dados.frequencia);
        if (dados.nota) this.inputNotaAvaliacao.type(dados.nota);
        if (dados.progresso) this.inputProgressoTecnico.type(dados.progresso);
        if (dados.observacoes) this.textareaObservacoes.type(dados.observacoes);
        if (dados.status) this.selectStatusAvaliacao.select(dados.status);
    }

    submeter() {
        this.btnSubmeterColeta.click();
    }
}

export default new ColetaPage();