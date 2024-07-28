import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const validNie = '10696704';
const validNie2 = '980367';

Given('el usuario ha iniciado sesión como {string} con {string}', (usuario, contrasena) => {
  cy.viewport(1920, 1920);
  cy.login(usuario, contrasena);
});

When('el usuario navega a la caracterización del estudiante con NIE {string}', (nie) => {
  cy.visit(`http://192.168.1.12/#/menu/saet-caracterizacion-estudiante/${nie}`, { timeout: 100000 });
});

When('el usuario hace clic en {string}', (boton) => {
  const buttons = {
    'iniciar caracterizacion': '[data-testid="btn-iniciar-caracterizacion"]',
    'salir': '[data-testid="btn-salir"]',
    'guardar sin continuar': '[data-testid="btnReject"]',
    'continuar editando': '[data-testid="btnAccept"]',
    'guardar': '[data-testid="btn-guardar"]'
  };
  cy.get(buttons[boton]).click();
});

When('el usuario escribe {string} en el primer input', (inputValue) => {
  cy.get('[data-testid="input_1"]').type(inputValue);
});

When('el usuario recarga la página', () => {
  cy.reload();
});

Then('el primer input debe contener {string}', (inputValue) => {
  cy.get('[data-testid="input_1"]').should('have.value', inputValue);
});

Then('el cuadro de diálogo debe ser visible', () => {
  cy.get('[data-testid="h-header-modal"]').should('be.visible');
});

Then('la URL debe incluir {string}', (text) => {
  cy.url().should('include', text);
});

Then('la caracterización debe guardarse exitosamente', () => {
  // Aquí podrías verificar que la caracterización se haya guardado correctamente
});
When('el usuario ve el primer input vacio', () => {
  cy.get('[data-testid="input_1"]').should('have.value', '');
})
