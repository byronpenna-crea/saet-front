import { Component, Inject } from '@angular/core';
import { QuestionsComponent } from '../../QuestionsComponent';
import {
  IMessageComponent,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveQuestionary,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import { KeyValue } from '../../component/saet-input/saet-input.component';

@Component({
  selector: 'app-estudiante-evaluacion-agenda',
  templateUrl: './estudiante-evaluacion-agenda.component.html',
  styleUrls: ['./estudiante-evaluacion-agenda.component.css'],
})
export class EstudianteEvaluacionAgendaComponent
  extends QuestionsComponent
  implements IMessageComponent
{
  userMessage: UserMessage = userMessageInit;

  cuestionariosTableMode: number[] = [];
  override ngOnInit = async () => {
    await super.ngOnInit();
  };
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  idEvaluacion: number = 0;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ) {
    const especialidadTarget: string = 'psicologia';
    super(
      document,
      catalogoServiceCOR,
      route,
      router,
      confirmationService,
      especialidadTarget
    );

    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.psicologo_agenda)
      .then(response => {
        this.idEvaluacion = response.id_evaluacion;
        console.log('response ', response);
      });

    catalogoServiceCOR.getAgendaQuestions().then(result => {
      this.showActionButtons = true;
      this.corSurveys.push(...result.cuestionarios);
    });
  }

  save() {
    /*const objToSave:ISaveQuestionary = this.getQuestionaryObject();
    objToSave.id_evaluacion = this.idEvaluacion;
    const x = this.catalogoServiceCOR.updatePsicologia(objToSave);*/
  }

  override salirEditMode(): string {
    console.log('here salir edit mode ');
    const url = super.salirEditMode();
    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.psicologo_perfil)
      .then(response => {
        this.values = {
          ...this.responseToValues(response),
        };
      });
    this.router.navigateByUrl(url);
    return '';
  }
}
