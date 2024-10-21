import { Component, Inject } from '@angular/core';
import { QuestionsComponent } from '../../QuestionsComponent';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import { CatalogoServiceCor } from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';

@Component({
  selector: 'app-estudiante-cuestionario-pedagogia',
  templateUrl: './estudiante-cuestionario-pedagogia.component.html',
  styleUrls: ['./estudiante-cuestionario-pedagogia.component.css'],
})
export class EstudianteCuestionarioPedagogiaComponent
  extends QuestionsComponent
  implements IMessageComponent
{
  override ngOnInit = async () => {
    await super.ngOnInit();
    if (this.readOnlyEvaluaciones) {
      this.router.navigate(['/menu/saet-caracterizacion-estudiante', this.nie]);
    }
  };
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ) {

    const especialidadTarget = 'pedagogia';
    super(
      document,
      catalogoServiceCOR,
      route,
      router,
      confirmationService,
      especialidadTarget
    );
    this.pageLoading = true;
    const tipoEvaluacionPromise = this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.pedagogo_perfil);
    const questionPromise = catalogoServiceCOR.getPedagogiaQuestions();
    Promise.all([tipoEvaluacionPromise,questionPromise]).then(([tipoEvaluacionResponse, questionResponse]) => {
      console.log('questionResponse', questionResponse)
      this.corSurveys.push(...questionResponse.cuestionarios);

      this.handleMode(
        tipoEvaluacionResponse.id_evaluacion,
        'menu/saet-pedagogia',
        this.formMode
      );
    }).catch((e) => {
      console.log('error in promise -----------zzzz ----- ', e);
    }).finally(() => {
      this.pageLoading = false;
    })



  }
  save() {
    console.log('to save')
  }
}
