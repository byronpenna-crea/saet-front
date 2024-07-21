import { Component, Inject } from '@angular/core';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  StudentDetail,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsComponent } from '../../QuestionsComponent';
import { ConfirmationService } from 'primeng/api';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';

@Component({
  selector: 'app-estudiante-cuestionario-lenguaje',
  templateUrl: './estudiante-cuestionario-lenguaje.component.html',
  styleUrls: ['./estudiante-cuestionario-lenguaje.component.css'],
})
export class EstudianteCuestionarioLenguajeComponent
  extends QuestionsComponent
  implements IMessageComponent
{
  userMessage: UserMessage = {
    showMessage: false,
    message: '',
    titleMessage: '',
    type: MessageType.SUCCESS,
  };
  cuestionariosTableMode: number[] = [16];
  override async ngOnInit() {
    await super.ngOnInit();
    if (this.readOnlyEvaluaciones) {
      this.router.navigate(['/menu/saet-caracterizacion-estudiante', this.nie]);
    }
  }
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ) {
    const especialidadTarget: string = 'lenguaje';
    super(
      document,
      catalogoServiceCOR,
      route,
      router,
      confirmationService,
      especialidadTarget
    );

    catalogoServiceCOR.getLenguajeHablaQuestions().then(result => {
      this.showActionButtons = true;
      this.corSurveys.push(...result.cuestionarios);
    });

    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.logopeda_perfil)
      .then(response => {
        this.handleMode(
          response.id_evaluacion,
          'menu/saet-lenguaje-habla',
          this.formMode
        );
        console.log('Evaluacion here ', response);
        console.log('values here ', this.values);
        console.log('transformed response ', this.responseToValues(response));

        this.values = {
          ...this.values,
          ...this.responseToValues(response),
        };
        console.log('this values ... ', this.values);
      });
  }
  save() {}
}
