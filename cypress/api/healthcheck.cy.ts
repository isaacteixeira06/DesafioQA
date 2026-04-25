describe('Testes de Integração - Health Check', () => {
  it('Deve retornar status 200 ao verificar a saúde do servidor', () => {
    cy.request('GET', '/health').then((response) => {
      expect(response.status).to.eq(200);
      
      expect(response.body).to.have.property('status', 'ok');
      expect(response.body).to.have.property('timestamp');
      expect(response.body).to.have.property('uptime');
    });
  });
});