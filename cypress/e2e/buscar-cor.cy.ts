describe('llegar al modulo', () => {
  beforeEach(() => {
    cy.viewport(1920,1920);
  })
  it('Loguearse', () => {
    cy.login('usuario_psicologia', 'pass_psicologia');
  });

  it('Ir al modulo', () => {
    cy.login('usuario_psicologia', 'pass_psicologia');

    cy.visit('http://192.168.1.12/#/menu/saet-buscar',{timeout: 100000});
    cy.get('[data-testid="input-nie"]').should('exist');
    cy.get('[data-testid="input-nie"]').type('1234'); //20217333
    cy.get('[data-testid="btn-buscar"]').click();
    cy.get('[data-testid="userMessage"]').contains('no encontrado');
    cy.get('[data-testid="input-nie"]').clear().type('10696704');
    cy.get('[data-testid="btn-buscar"]').click();
    cy.get('[data-testid="table-information"]').should('exist');
    cy.get('[data-testid="table-information"]').within(() => {
      cy.get('[data-testid="btn-ver-detalle"]').first().click();
    });
  });

  it('Verificar que sin caracterizacion no se puede acceder a evaluaciones', () => {

  })

})
