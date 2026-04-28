import "./commands";

beforeEach(() => {
  // Limpar localStorage antes de cada teste
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});
