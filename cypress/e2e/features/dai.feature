Scenario: Iniciar la caracterización DAI (Usuario Denis tercero)
Given el usuario ha iniciado sesión como "2301208" con "BienvenidoSiges"
When el usuario navega a la caracterización dai del estudiante con NIE "10696704"
And el usuario hace clic en "iniciar caracterizacion"
Then la URL debe incluir "saet-caracterizacion-iniciar"
