import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const validNie: string = '10696704';

Given('I log in with valid credentials for psicología', () => {
  cy.viewport(1920, 1920);
  cy.slowDown(3000);
  cy.log('------------------------------------------');
  cy.log('Paso: Login con credenciales de psicología');
  cy.login('usuario_psicologia', 'pass_psicologia');
  cy.log('------------------------------------------');
});

When('I navigate to the search menu', () => {
  cy.log('------------------------------------------');
  cy.log('Paso: Navegar al menú de búsqueda');
  cy.visit('http://192.168.1.12/#/menu/saet-buscar', { timeout: 100000 });
  cy.log('------------------------------------------');
});

When('I navigate to student general data with NIE {string}', (nie: string) => {
  cy.log('----------------IR A DATOS GENERALES-------------------');
  cy.visit(`http://192.168.1.12/#/menu/saet-datos-estudiante/${nie}`, {
    timeout: 100000,
  });
  cy.slowDown(5000);
  cy.log('verificar que el usuario cargue correctamente');
  cy.get('[data-testid="general-tab-info"]').should('exist');
  cy.get('[data-testid="general-tab-info"]').contains(nie);
});

Then('I should see the general information tab with NIE {string}', (nie: string) => {
  cy.get('[data-testid="general-tab-info"]').should('exist');
  cy.get('[data-testid="general-tab-info"]').contains(nie);
});

When('I try to access evaluations without creating characterization', () => {
  cy.log('tratar de acceder a evaluaciones sin haber creado caracterización');
  cy.visit(`http://192.168.1.12/#/menu/saet-evaluaciones/${validNie}`, {
    timeout: 100000,
  });
});

Then('I should be redirected to the student characterization URL with NIE {string}', (nie: string) => {
  cy.log('Verificar redirección a la URL de datos del estudiante');
  cy.url().should('include', `/menu/saet-caracterizacion-estudiante/${nie}`);
});
