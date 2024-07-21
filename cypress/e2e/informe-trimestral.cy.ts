describe('llegar a informe trimestral desde buscador principal', () => {
  beforeEach(() => {
    cy.viewport(1920, 1920);
  });
  before(() => {
    cy.slowDown(3000);
  });
  const validNie: string = '10696704';
  function login(usuario: string, contrasena: string) {
    cy.log('------------------------------------------');
    cy.log('Paso: Login con credenciales de psicología');
    cy.login(usuario, contrasena);
    cy.log('------------------------------------------');
  }
  function navegarAMenuDeBusqueda() {
    cy.log('------------------------------------------');
    cy.log('Paso: Navegar a informe trimestral');
    cy.visit('http://192.168.1.12/#/menu/saet-buscar', { timeout: 100000 });
    cy.log('------------------------------------------');
  }
  it('entrar en informe trimestral funcionamiento basico', () => {
    login('usuario_psicologia', 'pass_psicologia');
    navegarAMenuDeBusqueda();
    //cy.wait(3000);
    cy.log('Paso: clic en informe trimestral');
    cy.get('[data-testid="aInformeTrimestral"]').click();
    //cy.wait(3000);
    cy.log('Paso: buscar nie valido');
    cy.get('[data-testid="input-nie"]').type(validNie);
    //cy.wait(3000);
    cy.get('[data-testid="btn-buscar"]').click();

    cy.log('Paso: validar que el boton de busqueda se deshabilite');
    cy.get('[data-testid="btn-buscar"] button').should('have.attr', 'disabled');

    cy.log('Paso: validar que el input se deshabilite');
    cy.get('[data-testid="input-nie"]').should('be.disabled');

    cy.log('Paso: probar boton de limpiar busqueda');
    cy.get('[data-testid="btn-clean"]').click();

    cy.log('Paso: boton buscar no debe estar deshabilitado');
    cy.get('[data-testid="btn-buscar"] button').should(
      'not.have.attr',
      'disabled'
    );
    cy.log('Paso: boton buscar no debe estar deshabilitado');
    cy.get('[data-testid="input-nie"]').should('not.be.disabled');
    cy.get('[data-testid="input-nie"]').should('have.value', '');
  });
});
