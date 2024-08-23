describe('llegar al modulo', () => {
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
    cy.log('Paso: Navegar al menú de búsqueda');
    cy.visit('http://192.168.12.135/#/menu/saet-buscar', { timeout: 100000 });
    cy.log('------------------------------------------');
  }

  function buscarInformacionDeUsuario(nie: string) {
    cy.log('------------------------------------------');
    cy.log('Paso: buscar alumno valido');
    cy.get('[data-testid="input-nie"]').should('exist');
    cy.get('[data-testid="input-nie"]').clear().type(nie);
    cy.get('[data-testid="btn-buscar"]').click();
    cy.log('------------------------------------------');
  }

  function verificarTablaDeInformacion() {
    cy.log('------------------------------------------');
    cy.log('Paso: verificar existencia de información');
    cy.get('[data-testid="table-information"]').should('exist');
    cy.log('------------------------------------------');
  }

  function verDetalleDelPrimerRegistro() {
    cy.log('------------------------------------------');
    cy.log('Paso: ir a modulo cor con alumno');
    cy.get('[data-testid="table-information"]').within(() => {
      cy.get('[data-testid="btn-ver-detalle"]').first().click();
    });
    cy.log('------------------------------------------');
  }

  it('Verificar que sin caracterizacion no se puede acceder a evaluaciones', () => {
    login('usuario_psicologia', 'pass_psicologia');
    navegarAMenuDeBusqueda();
    cy.log('----------------IR A DATOS GENERALES-------------------');
    cy.visit(`http://192.168.12.135/#/menu/saet-datos-estudiante/${validNie}`, {
      timeout: 100000,
    });
    cy.slowDown(5000);
    cy.log('verificar que el usuario cargue correctamente');
    cy.get('[data-testid="general-tab-info"]').should('exist');
    cy.get('[data-testid="general-tab-info"]').contains(validNie);
    cy.log('tratar de acceder a evaluaciones sin haber creado caracterizacion');
    cy.visit(`http://192.168.12.135/#/menu/saet-evaluaciones/${validNie}`, {
      timeout: 100000,
    });
    cy.log('Verificar redirección a la URL de datos del estudiante');
    cy.url().should(
      'include',
      `/menu/saet-caracterizacion-estudiante/${validNie}`
    );
  });
});
