describe('llegar al modulo', () => {
  beforeEach(() => {
    cy.viewport(1920, 1920);
  });
  const validNie: string = '10696704';
  const validNie2: string = '980367';
  function login(usuario: string, contrasena: string) {
    cy.log('------------------------------------------');
    cy.log('Paso: Login con credenciales de psicología');
    cy.login(usuario, contrasena);
    cy.log('------------------------------------------');
  }
  function navegarAMenuDeBusqueda() {
    cy.log('------------------------------------------');
    cy.log('Paso: Navegar a caracterizacion');
    cy.visit(
      `http://192.168.1.12/#/menu/saet-caracterizacion-estudiante/${validNie}`,
      { timeout: 100000 }
    );
    cy.log('------------------------------------------');
  }
  it('iniciar la caracterizacion', () => {
    login('usuario_psicologia', 'pass_psicologia');
    navegarAMenuDeBusqueda();
    //cy.wait(3000);
    cy.log('Paso: clic a iniciar caracterizacion');
    cy.get('[data-testid="btn-iniciar-caracterizacion"]').click();
    cy.url().should('include', 'saet-caracterizacion-iniciar');
    //cy.wait(3000);
  });
  it('verificar local storage', () => {
    const inputValue = 'persona que asiste';

    login('usuario_psicologia', 'pass_psicologia');
    navegarAMenuDeBusqueda();
    //cy.wait(3000);
    cy.log('Paso: clic a iniciar caracterizacion');
    cy.get('[data-testid="btn-iniciar-caracterizacion"]').click();
    cy.log('Paso: escribir valor en el primer input');
    cy.get('[data-testid="input_1"]').type(inputValue);
    //cy.wait(3000);
    cy.log('Paso: recargar pagina');
    cy.reload();
    cy.log('Paso: verificar que el valor sigue despues de recarga la pagina');
    cy.get('[data-testid="input_1"]').should('have.value', inputValue);
    //cy.wait(3000);
    cy.log('Paso: click en boton salir');
    cy.get('[data-testid="btn-salir"]').click();
    cy.log(
      'Paso: verificar que al dar clic en salir muestra cuadro de dialogo'
    );
    cy.get('[data-testid="h-header-modal"]').should('be.visible');
    cy.log('Paso: click en guardar sin continuar');
    cy.get('[data-testid="btnReject"]').click();
    cy.log('Paso: debe regresar a iniciar caracterizacion');
    cy.url().should('include', 'saet-caracterizacion-estudiante');
    cy.log('Paso: volver a la iniciar la caracterizacion');
    cy.get('[data-testid="btn-iniciar-caracterizacion"]').click();
    cy.log('Paso: click en boton salir');
    cy.get('[data-testid="btn-salir"]').click();
    cy.log('Paso: click en boton "continuar editando"');
    cy.get('[data-testid="btnAccept"]').click();
    cy.log('Paso: la url debe seguir siendo la misma');
    cy.url().should('include', 'saet-caracterizacion-iniciar');
  });
  it('guardar caracterizacion', () => {
    const inputValue = 'persona que asiste';
    login('usuario_psicologia', 'pass_psicologia');
    navegarAMenuDeBusqueda();
    cy.log('Paso: clic a iniciar caracterizacion');
    cy.get('[data-testid="btn-iniciar-caracterizacion"]').click();
    cy.log('Paso: escribir valor en el primer input');
    cy.get('[data-testid="input_1"]').type(inputValue);
    cy.log('Paso: click en el boton guardar');
  });

});
