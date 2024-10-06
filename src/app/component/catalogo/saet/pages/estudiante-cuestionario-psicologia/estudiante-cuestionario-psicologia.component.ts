import { Component, Inject } from '@angular/core';
import { FormMode, QuestionsComponent } from '../../QuestionsComponent';
import {
  IMessageComponent,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveQuestionary,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { userMessageInit } from '../../shared/messages.model';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import { ConfirmationService } from 'primeng/api';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';

@Component({
  selector: 'app-estudiante-cuestionario-psicologia',
  templateUrl: './estudiante-cuestionario-psicologia.component.html',
  styleUrls: ['./estudiante-cuestionario-psicologia.component.css'],
})
export class EstudianteCuestionarioPsicologiaComponent
  extends QuestionsComponent
  implements IMessageComponent
{
  btnIcon = IconComponent;
  cuestionariosTableMode: number[] = [7, 10, 11, 12, 13];
  override ngOnInit = async () => {
    await super.ngOnInit();
    if (this.readOnlyEvaluaciones) {
      await this.router.navigate([
        '/menu/saet-caracterizacion-estudiante',
        this.nie,
      ]);
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
    const especialidadTarget = 'psicologia';

    super(
      document,
      catalogoServiceCOR,
      route,
      router,
      confirmationService,
      especialidadTarget
    );
    this.pageLoading = true;

    const tipoEvaluacionPromise = this.catalogoServiceCOR.getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.psicologo_perfil);
    const psicologiaQuestionsPromise = this.catalogoServiceCOR.getPsicologiaQuestions();

    Promise.all([tipoEvaluacionPromise, psicologiaQuestionsPromise])
      .then(([responseEvaluacion, resultQuestions]) => {
        this.idEvaluacion = responseEvaluacion.id_evaluacion;
        console.log('original response ', responseEvaluacion)
        this.handleMode(
          responseEvaluacion.id_evaluacion,
          'menu/saet-psicologia',
          this.formMode
        );
        console.log('depurados ', this.responseToValues(responseEvaluacion));
        this.values = {

          ...this.responseToValues(responseEvaluacion),
          ...this.values,
        };
        console.log('this values ... ', this.values);

        this.showActionButtons = true;
        this.corSurveys.push(...resultQuestions.cuestionarios);
      }).catch(ex => {
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
  generarPDF() {
    console.log('Generar PDF');
  }
  async save() {
    this.pageLoading = true;
    const objToSave: ISaveQuestionary = this.getQuestionaryObject();
    console.log('obj to save', objToSave);
    objToSave.id_evaluacion = this.idEvaluacion;
    try{
      const resp = await this.catalogoServiceCOR.updatePsicologia(objToSave);
      console.log('Actualizado ', resp);
    }catch (e){
      console.log('Error ---- ', e);
    }finally {
      this.pageLoading = false;
    }
  }

  override salirEditMode(): string {
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
