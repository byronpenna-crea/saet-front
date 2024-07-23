Feature: Verificar acceso a evaluaciones

  Scenario: Verificar que sin caracterización no se puede acceder a evaluaciones
    Given I log in with valid credentials for psicología
    When I navigate to the search menu
    And I navigate to student general data with NIE "10696704"
    Then I should see the general information tab with NIE "10696704"
    When I try to access evaluations without creating characterization
    Then I should be redirected to the student characterization URL with NIE "10696704"
