Feature: Informe trimestral desde buscador principal

  Scenario: Entrar en informe trimestral funcionamiento básico
    Given I log in with valid credentials for psicología
    When I navigate to the informe trimestral page
    And I click on informe trimestral
    And I type "10696704" in the NIE input
    And I click on the buscar button
    Then the buscar button should be disabled
    And the NIE input should be disabled
    When I click on the limpiar busqueda button
    Then the buscar button should not be disabled
    And the NIE input should not be disabled
    And the NIE input should be empty
