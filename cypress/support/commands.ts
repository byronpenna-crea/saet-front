/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
const COMMAND_DELAY = 500;

for (const command of [
  'visit',
  'click',
  'trigger',
  'type',
  'clear',
  'reload',
]) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    const origVal = originalFn(...args);

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(origVal);
      }, COMMAND_DELAY);
    });
  });
}
const baseUrl = Cypress.config('baseUrl');
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit(`${baseUrl}/#/login`, { timeout: 100000 });
  cy.contains('body', 'Iniciar sesión', { timeout: 100000 }).should(
    'be.visible'
  );
  cy.get('input[placeholder="USUARIO"]').type(username);
  cy.get('input[placeholder="CONTRASEÑA"]').type(password);
  cy.contains('button', 'INICIAR SESIÓN').click();
  cy.url().should('include', '#/inicio');
});
