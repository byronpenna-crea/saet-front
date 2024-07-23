import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('yo visito la url de reset', () => {
  cy.viewport(1920, 1920);
  cy.visit('http://192.168.1.12/#/login');
  cy.login('usuario_psicologia', 'pass_psicologia');
  cy.visit('http://192.168.1.12/#/menu/saet-reset');

});

Then('deberia ver {string} en la pagina', (expectedText: string) => {
  cy.contains('body', expectedText).should('be.visible');
});
