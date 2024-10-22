import { Component, Inject } from '@angular/core';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveQuestionary,
  StudentDetail,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsComponent } from '../../QuestionsComponent';
import { ConfirmationService } from 'primeng/api';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';

@Component({
  selector: 'app-estudiante-cuestionario-lenguaje',
  templateUrl: './estudiante-cuestionario-lenguaje.component.html',
  styleUrls: ['./estudiante-cuestionario-lenguaje.component.css'],
})
export class EstudianteCuestionarioLenguajeComponent
  extends QuestionsComponent
  implements IMessageComponent
{
  btnIcon = IconComponent;
  cuestionariosTableMode: number[] = [16];
  override ngOnInit = async () => {
    await super.ngOnInit();
    if (this.readOnlyEvaluaciones) {
      this.router.navigate(['/menu/saet-caracterizacion-estudiante', this.nie]);
    }
  };
  idEvaluacion = 0;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ) {
    const especialidadTarget = 'lenguaje';
    super(
      document,
      catalogoServiceCOR,
      route,
      router,
      confirmationService,
      especialidadTarget
    );
    this.pageLoading = true;
    const tipoEvaluacionPromise = this.catalogoServiceCOR.getTipoDeEvaluacion(
      this.nie,
      TIPO_EVALUACION.logopeda_perfil
    );
    const questionPromise = catalogoServiceCOR.getLenguajeHablaQuestions();

    Promise.all([tipoEvaluacionPromise, questionPromise])
      .then(([tipoEvaluacionResponse, resultQuestions]) => {
        this.idEvaluacion = tipoEvaluacionResponse.id_evaluacion;
        this.handleMode(
          tipoEvaluacionResponse.id_evaluacion,
          'menu/saet-lenguaje-habla',
          this.formMode
        );
        console.log('Evaluacion here ', tipoEvaluacionResponse);
        console.log('values here ', this.values);
        console.log(
          'transformed response ',
          this.responseToValues(tipoEvaluacionResponse)
        );
        this.values = {
          ...this.values,
          ...this.responseToValues(tipoEvaluacionResponse),
        };
        console.log('this values ... ', this.values);

        this.showActionButtons = true;
        this.corSurveys.push(...resultQuestions.cuestionarios);
      })
      .catch(ex => {
        console.log('ex here', ex);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  async save() {
    this.pageLoading = true;
    const objToSave: ISaveQuestionary = this.getQuestionaryObject();
    console.log('obj to save', objToSave);
    objToSave.id_evaluacion = this.idEvaluacion;
    try {
      const resp = await this.catalogoServiceCOR.updateLenguaje(objToSave);
      console.log('Actualizado ', resp);
    } catch (e) {
      console.log('Error ---- ', e);
    } finally {
      this.pageLoading = false;
    }
  }
  override salirEditMode(): string {
    const url = super.salirEditMode();
    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.logopeda_perfil)
      .then(response => {
        this.values = {
          ...this.responseToValues(response),
        };
      });
    this.router.navigateByUrl(url);
    return '';
  }
}
