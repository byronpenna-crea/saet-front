Feature: Caracterización del estudiante

  Scenario: Iniciar la caracterización
    Given el usuario ha iniciado sesión como "usuario_psicologia" con "pass_psicologia"
    When el usuario navega a la caracterización del estudiante con NIE "10696704"
    And el usuario hace clic en "iniciar caracterizacion"
    Then la URL debe incluir "saet-caracterizacion-iniciar"

  Scenario: Verificar local storage
    Given el usuario ha iniciado sesión como "usuario_psicologia" con "pass_psicologia"
    When el usuario navega a la caracterización del estudiante con NIE "10696704"
    And el usuario hace clic en "iniciar caracterizacion"
    And el usuario escribe "persona que asiste" en el primer input
    And el usuario recarga la página
    Then el primer input debe contener "persona que asiste"
    When el usuario hace clic en "salir"
    Then el cuadro de diálogo debe ser visible
    When el usuario hace clic en "guardar sin continuar"
    Then la URL debe incluir "saet-caracterizacion-estudiante"
    When el usuario hace clic en "iniciar caracterizacion"
    And el usuario hace clic en "salir"
    And el usuario hace clic en "continuar editando"
    Then la URL debe incluir "saet-caracterizacion-iniciar"

  Scenario: Guardar caracterización
    Given el usuario ha iniciado sesión como "usuario_psicologia" con "pass_psicologia"
    When el usuario navega a la caracterización del estudiante con NIE "10696704"
    And el usuario hace clic en "iniciar caracterizacion"
    And el usuario escribe "persona que asiste" en el primer input
    And el usuario hace clic en "guardar"
    Then la caracterización debe guardarse exitosamente
