import coletaPage from '../pages/ColetaPage';
import loginPage from '../pages/LoginPage';

describe('Testes de Validação - Coleta de Dados', () => {

    const usuarioColeta = `coleta_user_${Date.now()}`;
    const senhaColeta = 'SenhaColeta123';

    before(() => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/register',
            body: { username: usuarioColeta, email: `${usuarioColeta}@teste.com`, password: senhaColeta },
            failOnStatusCode: false
        });
    });

    beforeEach(() => {
        loginPage.acessarPagina();
        loginPage.realizarLogin(usuarioColeta, senhaColeta);
        coletaPage.acessarPagina();
    });

    // it('Não deve aceitar letras no ID do Beneficiário', () => {
    //     coletaPage.inputIdBeneficiario.type('ABC');
    //     coletaPage.inputIdBeneficiario.should('have.value', ''); 
    // });

    // it('Não deve aceitar valores negativos na Taxa de Conclusão', () => {
    //     coletaPage.inputIdBeneficiario.type('101'); 
    //     coletaPage.inputNomeCompleto.type('João Teste');
    //     coletaPage.inputFrequenciaPresenca.type('100'); 
    //     coletaPage.inputNotaAvaliacao.type('8'); 
    //     coletaPage.inputProgressoTecnico.type('50'); 
        
    //     coletaPage.inputTaxaConclusao.type('-10');
    //     coletaPage.btnSubmeterColeta.click();
        
    //     cy.get('input:invalid').should('have.length', 1);
    // });

    // it('Não deve aceitar Frequência de Presença acima de 100', () => {
    //     coletaPage.inputIdBeneficiario.type('102');
    //     coletaPage.inputNomeCompleto.type('Maria Teste');
    //     coletaPage.inputTaxaConclusao.type('90'); 
    //     coletaPage.inputNotaAvaliacao.type('9'); 
    //     coletaPage.inputProgressoTecnico.type('60'); 
        
    //     coletaPage.inputFrequenciaPresenca.type('150');
    //     coletaPage.btnSubmeterColeta.click();
        
    //     cy.get('input:invalid').should('have.length', 1);
    // });

    // it('Não deve permitir Nota de Avaliação maior que 10', () => {
    //     coletaPage.inputIdBeneficiario.type('103');
    //     coletaPage.inputNomeCompleto.type('Carlos Teste');
    //     coletaPage.inputTaxaConclusao.type('85'); 
    //     coletaPage.inputFrequenciaPresenca.type('95'); 
    //     coletaPage.inputProgressoTecnico.type('70'); 
        
    //     coletaPage.inputNotaAvaliacao.type('15');
    //     coletaPage.btnSubmeterColeta.click();
        
    //     cy.get('input:invalid').should('have.length', 1);
    // });

    // it('Deve limitar caracteres e sanitizar input contra XSS nas Observações', () => {
    //     coletaPage.textareaObservacoes.should('have.attr', 'maxlength');
        
    //     const payloadXSS = '<script>alert("XSS")</script>';
    //     coletaPage.textareaObservacoes.type(payloadXSS);
    //     coletaPage.textareaObservacoes.should('not.have.value', payloadXSS);
    // });

    // it('Deve exigir a seleção de um Status de Avaliação válido', () => {
    //     coletaPage.inputIdBeneficiario.type('104');
    //     coletaPage.inputNomeCompleto.type('Ana Teste');
    //     coletaPage.inputTaxaConclusao.type('100'); 
    //     coletaPage.inputFrequenciaPresenca.type('100'); 
    //     coletaPage.inputNotaAvaliacao.type('10'); 
    //     coletaPage.inputProgressoTecnico.type('100'); 
        
    //     coletaPage.btnSubmeterColeta.click();
        
    //     cy.get('select:invalid').should('have.length', 1);
    // });

    // --- COLETA EM LOTE ---


    it('Deve bloquear o upload de arquivos fora dos formatos permitidos (CSV/Excel)', () => {
        // BUG 50: Não valida tipo de arquivo realmente
        coletaPage.abaColetaEmLote.click();
        
        // O Cypress consegue simular a criação de um arquivo .txt em memória
        cy.wrap('isso é um teste em formato txt, não um csv').as('fakeTxtFile');
        
        coletaPage.inputArquivoLote.selectFile({
            contents: '@fakeTxtFile',
            fileName: 'malicioso.txt',
            mimeType: 'text/plain'
        });
        
        coletaPage.btnSubmitLote.click();
        
        // O teste DEVE FALHAR porque a aplicação aceitará o .txt sem validação real.
        // Esperamos que o sistema barrasse e mostrasse uma mensagem de erro de formato.
        coletaPage.divLoteMessage.should('contain.text', 'Formato inválido');
    });

    it('Deve rejeitar o arquivo se a validação de duplicatas estiver ativa e houver registros repetidos', () => {
        // BUG 51: Validação de duplicatas não funciona realmente
        coletaPage.abaColetaEmLote.click();
        coletaPage.checkboxValidarDuplicatas.check(); // Ativa a "validação"
        
        // Simulando um CSV com o mesmo ID repetido
        const csvComDuplicatas = "ID,Nome\n1,João\n1,João";
        cy.wrap(csvComDuplicatas).as('fakeCsvFile');
        
        coletaPage.inputArquivoLote.selectFile({
            contents: '@fakeCsvFile',
            fileName: 'dados_duplicados.csv',
            mimeType: 'text/csv'
        });
        
        coletaPage.btnSubmitLote.click();
        
        // O teste DEVE FALHAR porque o sistema vai ignorar o checkbox e enviar com sucesso.
        // Esperamos que ele avise sobre a duplicata ou, pelo menos, não dê mensagem de "sucesso".
        coletaPage.divLoteMessage.should('not.contain.text', 'sucesso');
    });
});