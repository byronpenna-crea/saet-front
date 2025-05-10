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
  cuestionariosTableMode: number[] = [];
  override ngOnInit = async () => {
    await super.ngOnInit();
  };
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  idEvaluacion = 0;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ) {
    const especialidadTarget = 'psicologia';
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
      }).catch((e) => {
        console.log('error in constructor getTipoDeEvaluacion',e);
      });

    catalogoServiceCOR.getAgendaQuestions().then(result => {
      this.showActionButtons = true;
      this.corSurveys.push(...result.cuestionarios);
    });
  }

  save() {
    this.pageLoading = true;
    const objToSave:ISaveQuestionary = this.getQuestionaryObject();
    objToSave.id_tipo_evaluacion = 2;
    objToSave.id_evaluacion = this.idEvaluacion;
    // "id_evaluacion": 79
    console.log('obj to save', objToSave);
    const x = this.catalogoServiceCOR.updatePsicologia(objToSave);
    this.pageLoading = false;
    console.log('response ', x);
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
