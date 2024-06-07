describe('llegar al modulo', () => {
  it('Loguearse', () => {
    cy.login('cypress_user', 'cypress_pass');
  });

  it('Ir al modulo', () => {
    cy.login('cypress_user', 'cypress_pass');

    cy.visit('http://192.168.1.12/#/menu/saet-buscar',{timeout: 100000});
    cy.get('[data-testid="input-nie"]').type('123456'); //20217333
    cy.get('[data-testid="btn-buscar"]').click();
    cy.get('[data-testid="userMessage"]').contains('Error al obtener la información del estudiante');
    cy.get('[data-testid="input-nie"]').clear().type('10696704');
    cy.get('[data-testid="btn-buscar"]').click();
    cy.get('[data-testid="table-information"]').should('exist');
    cy.get('[data-testid="table-information"]').within(() => {
      cy.get('[data-testid="btn-ver-detalle"]').first().click();
    });


  });
})
