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
// Cypress.Commands.add('login', (originalFn, url, options) => { ... })
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

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const baseUrl = Cypress.config('baseUrl') ?? '';
const timeOut = 50000;
const pageTimeOut = 100000;

Given('el usuario ha iniciado sesión como {string} con {string}', (usuario:string, contrasena:string) => {
  cy.viewport(1920, 1920);
  cy.login(usuario, contrasena);
});

When('el usuario navega a la caracterización dai del estudiante con NIE {string}', (nie) => {
  cy.log(baseUrl);
  cy.visit(`${baseUrl}/#/menu/saet-caracterizacion-estudiante/${nie}`, { timeout: pageTimeOut  });
  cy.get('[data-testid="test-loading-container"]',{timeout: timeOut}).should('not.exist');

});
