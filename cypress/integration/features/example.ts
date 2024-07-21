import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I visit the home page', () => {
  cy.visit('/');
});

Then('I should see the title {string}', title => {
  cy.contains(title);
});
