import { Inject, Injectable } from '@angular/core';
import {
  CatalogoServiceCor,
  IEvaluacionResponse,
  StudentDetail,
} from '../../../services/catalogo/catalogo.service.cor';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CorBaseComponent } from './CorBaseComponent';
import { IconComponent, QuestionType } from './shared/component.config';
import { iSurvey } from './shared/survey';
import { KeyValue } from './component/saet-input/saet-input.component';
import { TIPO_EVALUACION } from './shared/evaluaciones';
import { ConfirmationService } from 'primeng/api';

export interface IValuesForm {
  [key: string]: string;
}

export interface IAnswerOption {
  id_opcion: number;
  opcion: string;
}
export enum FormMode {
  CREATE,
  VIEW,
  EDIT,
}
export interface IQuestionaryAnswer {
  id_pregunta: number;
  opcion: IAnswerOption[];
  respuesta: string;
}
@Injectable()
export class QuestionsComponent extends CorBaseComponent {
  corSurveys: iSurvey[] = [];

  values: IValuesForm = {};
  valuesKey = '';
  showActionButtons = false;
  editMode = false;
  formModeEnum = FormMode;
  formMode: FormMode = FormMode.CREATE;
  targetEspecialidad = '';
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService,
    @Inject(DOCUMENT) especialidadTarget: string
  ) {
    super(document, catalogoServiceCOR, route, router);
    const _valuesKey = `${this.nie}_${especialidadTarget}_values`;
    this.targetEspecialidad = especialidadTarget;
    this.route.paramMap.subscribe(params => {
      const mode = params.get('mode');
      switch (mode) {
        case null:
          this.formMode = FormMode.CREATE;
          break;
        case 'view':
          this.formMode = FormMode.VIEW;
          break;
        case 'edit':
          this.formMode = FormMode.EDIT;
          break;
        default:
          router.navigate(['menu/saet-evaluaciones', this.nie]);
          break;
      }
    });
    const especialidad = localStorage.getItem('especialidad');
    if (
      especialidadTarget === 'psicologo' ||
      especialidadTarget === 'pedagogia' ||
      especialidadTarget === 'lenguaje'
    ) {
      if (especialidad !== especialidadTarget) {
        router.navigate(['menu/saet-evaluaciones', this.nie]);
      }
    }
    this.updateStoredValues(_valuesKey);
    this.valuesKey = _valuesKey;
  }
  updateStoredValues(_valuesKey: string) {
    if (this.formMode === FormMode.EDIT || this.formMode === FormMode.CREATE) {
      this.valuesKey = _valuesKey;
      const storedValues = localStorage.getItem(_valuesKey);
      if (storedValues) {
        this.values = JSON.parse(storedValues);
      }
    }
  }
  QuestionType = QuestionType;
  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }
  getName(name: string): string {
    return this.convertString(name);
  }
  getOptions(options: { id_opcion: number; opcion: string }[]): KeyValue[] {
    return options.map(
      option =>
        ({
          key: option.id_opcion ? option.id_opcion.toString() : '',
          value: option.opcion,
        }) as KeyValue
    );
  }

  handleMode(idEvaluacion: number, url: string, formMode: FormMode) {
    if (formMode === FormMode.CREATE && idEvaluacion !== 0) {
      this.router.navigate([url, this.nie, 'view']);
    }
    if (formMode === FormMode.VIEW && idEvaluacion === 0) {
      this.router.navigate([url, this.nie]);
    }
    if (this.formMode === FormMode.EDIT && idEvaluacion === 0) {
      this.router.navigate([url, this.nie]);
    }
  }

  responseToValues(response: IEvaluacionResponse): IValuesForm {
    const values: IValuesForm = {};

    response.respuestas.forEach(respuesta => {
      const radioKey = `radio_${respuesta.id_pregunta}`;
      const inputKey =  `input_${respuesta.id_pregunta}`;

      if (respuesta.opcion.length > 0) {
        values[radioKey] =
          respuesta.opcion[0].opcion_pregunta_pk !== undefined
            ? respuesta.opcion[0].opcion_pregunta_pk.toString()
            : '';
      }

      if(respuesta.id_pregunta >= 161 && respuesta.id_pregunta <= 167){
        // manejo temporal de richtext
        values[`richtext_${respuesta.id_pregunta}`] = respuesta.respuesta;
      }else{
        values[inputKey] = respuesta.respuesta;
      }
    });

    return values;
  }
  onchangeQuestions(keyValue: KeyValue) {
    console.log('onchange ', keyValue);
    this.values[keyValue.key] = keyValue.value;
    localStorage.setItem(this.valuesKey, JSON.stringify(this.values));
  }
  getQuestionaryObject() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const fecha = `${day}/${month}/${year}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const hora = `${hours}:${minutes}`;

    return {
      id_evaluacion: null,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_especialista: 3,
      id_tipo_evaluacion: TIPO_EVALUACION.psicologo_perfil,
      fecha: fecha,
      hora: hora,
      respuestas: this.getAnswerObject(this.values),
    };
  }

  async aceptarSalir() {
    await this.router.navigate(['menu/saet-evaluaciones', this.nie]);
  }
  async continuarEditando() {
    this.confirmationService.close();
  }
  entrarEditMode() {
    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace('/view', '/edit');
    this.formMode = FormMode.EDIT;
    this.updateStoredValues(this.valuesKey);
    this.router.navigateByUrl(newUrl);
  }
  salirEditMode(): string {
    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace('/edit', '/view');
    this.updateStoredValues(`${this.targetEspecialidad}_values`);
    return newUrl;
  }
  salir() {
    this.confirmationService.confirm({
      message:
        'Al darle click en <b>Salir de edición sin guardar</b> perderá todo el progreso de edición realizado.',
      icon: 'pi pi-exclamation-triangle',
    });
  }
}
