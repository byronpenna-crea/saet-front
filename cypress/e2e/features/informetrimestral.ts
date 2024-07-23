import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const validNie: string = '10696704';

Given('I log in with valid credentials for psicología', () => {
  cy.viewport(1920, 1920);
  cy.log('------------------------------------------');
  cy.log('Paso: Login con credenciales de psicología');
  cy.login('usuario_psicologia', 'pass_psicologia');
  cy.log('------------------------------------------');
});

When('I navigate to the informe trimestral page', () => {
  cy.log('------------------------------------------');
  cy.log('Paso: Navegar a informe trimestral');
  cy.visit('http://192.168.1.12/#/menu/saet-buscar', { timeout: 100000 });
  cy.log('------------------------------------------');
});

When('I click on informe trimestral', () => {
  cy.log('Paso: clic en informe trimestral');
  cy.get('[data-testid="aInformeTrimestral"]').click();
});

When('I type {string} in the NIE input', (nie: string) => {
  cy.log('Paso: buscar NIE válido');
  cy.get('[data-testid="input-nie"]').type(nie);
});

When('I click on the buscar button', () => {
  cy.get('[data-testid="btn-buscar"]').click();
});

Then('the buscar button should be disabled', () => {
  cy.log('Paso: validar que el botón de búsqueda se deshabilite');
  cy.get('[data-testid="btn-buscar"] button').should('have.attr', 'disabled');
});

Then('the NIE input should be disabled', () => {
  cy.log('Paso: validar que el input se deshabilite');
  cy.get('[data-testid="input-nie"]').should('be.disabled');
});

When('I click on the limpiar busqueda button', () => {
  cy.log('Paso: probar botón de limpiar búsqueda');
  cy.get('[data-testid="btn-clean"]').click();
});

Then('the buscar button should not be disabled', () => {
  cy.log('Paso: botón buscar no debe estar deshabilitado');
  cy.get('[data-testid="btn-buscar"] button').should('not.have.attr', 'disabled');
});

Then('the NIE input should not be disabled', () => {
  cy.log('Paso: botón buscar no debe estar deshabilitado');
  cy.get('[data-testid="input-nie"]').should('not.be.disabled');
});

Then('the NIE input should be empty', () => {
  cy.get('[data-testid="input-nie"]').should('have.value', '');
});
