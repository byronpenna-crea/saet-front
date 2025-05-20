import { Component, Inject } from '@angular/core';
import { IValuesForm, QuestionsComponent } from '../../QuestionsComponent';
import {
  IMessageComponent, MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor, IEvaluacionResponse,
  ISaveQuestionary,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { iQuestion } from '../../shared/survey';
import { textAreaIds } from '../../../../../services/shared/saet-types';

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
  // storedValues: { [key: string]: string } = {};
  override ngOnInit = async () => {
    await super.ngOnInit();
  };
  respuestasToValues(respuestas: iQuestion[]) {
    const values: IValuesForm = {};
    respuestas.forEach(respuesta => {
      const radioKey = `radio_${respuesta.id_pregunta}`;
      const inputKey = `input_${respuesta.id_pregunta}`;

      if(textAreaIds.includes(respuesta.id_pregunta)){
        values[`textarea_${respuesta.id_pregunta}`] = respuesta.respuesta ?? '';
      }else{
        if (respuesta.opcion.length > 0) {
          values[radioKey] = respuesta.opcion[0].opcion_pregunta_pk.toString();
        }
        values[inputKey] = respuesta.respuesta ?? '';
      }
    });
    return values;
  }
  onTextAreaChange(keyValue: KeyValue){
    console.log('text area change', keyValue);
    this.values[keyValue.key] = keyValue.value;
    const textareaMatch = keyValue.key.match(/^textarea_(\d+)$/);
    if (textareaMatch) {
      const suffix = textareaMatch[1];
      const inputKey = `input_${suffix}`;
      if (Object.prototype.hasOwnProperty.call(this.values, inputKey)) {
        delete this.values[inputKey];
        console.log(`Removed conflicting input: ${inputKey}`);
      }
    }

    console.log('values', this.values);
    localStorage.setItem(this.valuesKey, JSON.stringify(this.values));
  }
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
    const especialidadTarget = 'psicologia_evaluacion';
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
        console.log('response IN CONSTRUCTOR --> ', response);
        const respuestas:IEvaluacionResponse = {
          respuestas: response.respuestas,
          especialista_responsable: '',
          id_evaluacion: 0,
          hora: '',
          fecha: '',
          dui_especialista:  ''
        }
        const  respuestasDb = this.responseToValues(respuestas)
        this.storedValues = {
          ...respuestasDb
        };
        console.log('response IN CONSTRUCTOR values--> ', respuestasDb);
        this.values = {
          ...respuestasDb,
          ...this.values,
        };
        console.log('values ---> ', this.values);
      }).catch((e) => {
        console.log('error in constructor getTipoDeEvaluacion',e);
      });

    catalogoServiceCOR.getAgendaQuestions().then(result => {
      this.showActionButtons = true;
      this.corSurveys.push(...result.cuestionarios);
    });
  }

  async save() {
    this.pageLoading = true;
    const objToSave:ISaveQuestionary = this.getQuestionaryObject();
    objToSave.id_tipo_evaluacion = 2;
    objToSave.id_evaluacion = this.idEvaluacion;
    // "id_evaluacion": 79
    console.log('obj to save evaluacion -->', objToSave);
    const response = await this.catalogoServiceCOR.updateEvaluacionPsicologia(objToSave);
    this.pageLoading = false;
    this.userMessage = {
      showMessage: true,
      message: '¡Los datos han sido guardados exitosamente!',
      titleMessage: 'Datos guardados',
      type: MessageType.SUCCESS,
    };

    const respuestas:IEvaluacionResponse = {
      respuestas: response.respuestas,
      especialista_responsable: '',
      id_evaluacion: 0,
      hora: '',
      fecha: '',
      dui_especialista:  ''
    }
    const  respuestasDb = this.responseToValues(respuestas);
    this.storedValues = {
      ...respuestasDb
    };
    this.values = {
      ...respuestasDb,
      ...this.values,
    };
  }

  override salirEditMode(): string {
    // return '';
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
