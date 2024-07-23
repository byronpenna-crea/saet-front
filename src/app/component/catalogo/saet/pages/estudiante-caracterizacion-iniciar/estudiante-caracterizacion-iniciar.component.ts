import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveCaracterizacion,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent, QuestionType } from '../../shared/component.config';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { iQuestion } from '../../shared/survey';
import { ConfirmationService } from 'primeng/api';
import { BaseComponent } from '../../BaseComponent';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FormMode,
  IQuestionaryAnswer,
  IValuesForm,
} from '../../QuestionsComponent';
import { handleMode } from '../../shared/forms';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { SAET_MODULE } from '../../shared/evaluaciones';

interface IinformationTab {
  labels: string[];
  values: string[];
  legend: string;
  isActive: boolean;
}
interface iSurvey {
  titulo: string;
  preguntas: iQuestion[];
}
@Component({
  selector: 'app-estudiante-caracterizacion-iniciar',
  templateUrl: './estudiante-caracterizacion-iniciar.component.html',
  styleUrls: ['./estudiante-caracterizacion-iniciar.component.css'],
})
export class EstudianteCaracterizacionIniciarComponent
  extends BaseComponent
  implements IMessageComponent, OnInit
{
  @ViewChild('cd') confirmDialog: any;

  userMessage: UserMessage = userMessageInit;

  //nie:string = "";
  //studentInfo?: StudentDetail;
  corSurveys: iSurvey[] = [];
  editMode: boolean = false;
  formModeEnum = FormMode;
  //readOnlyEvaluaciones:boolean = true;
  //readOnlyPaei:boolean = true;

  iconCompoment = IconComponent;
  btnStyle = ButtonStyle;

  generalInformation: IinformationTab = {
    isActive: false,
    legend: 'Datos personales del estudiante',
    labels: [
      'Nombre completo:',
      'NIE:',
      'Fecha de nacimiento:',
      'Dirección:',
      'Teléfono:',
      'Correo electrónico:',
    ],
    values: [],
  };
  institutionalInfo: IinformationTab = {
    isActive: false,
    legend: 'Datos institucionales',
    labels: [
      'Centro Escolar al que pertenece:',
      'Código de Centro Escolar:',
      'Dirección de Centro Escolar:',
      'Último grado cursado:',
      'Grado actual:',
      'Sección:',
      'Docente de aula responsable:',
      'Correo electrónico de docente:',
      'Teléfono de docente:',
    ],
    values: [],
  };
  respuestasToValues(respuestas: iQuestion[]) {
    console.log('Respuestas ------ xx ------', respuestas);
    const values: IValuesForm = {};
    respuestas.forEach(respuesta => {
      const radioKey = `radio_${respuesta.id_pregunta}`;
      const inputKey = `input_${respuesta.id_pregunta}`;

      if (respuesta.opcion.length > 0) {
        values[radioKey] = respuesta.opcion[0].opcion_pregunta_pk.toString();
      }
      values[inputKey] = respuesta.respuesta ?? '';
    });
    return values;
  }
  init() {
    this.route.paramMap.subscribe(params => {
      const storedValues = localStorage.getItem('values');
      if (storedValues) {
        this.values = JSON.parse(storedValues);
      }
      const formMode = params.get('mode');
      console.log('form mode on init', formMode);
      switch (formMode) {
        case null:
          this.formMode = FormMode.CREATE;
          break;
        case 'view':
          this.formMode = FormMode.VIEW;
          break;
        case 'edit':
          this.formMode = FormMode.EDIT;
          break;
      }
      console.log('form mode updated ', this.formMode);
      console.log('caracterizacion updated ', this.caracterizacion);
      if (this.formMode === FormMode.VIEW) {
        this.values = this.respuestasToValues(
          this.caracterizacion?.respuestas ?? []
        );
        console.log('here 1');
        return;
      }
      this.values = {
        ...this.values,
        ...this.respuestasToValues(this.caracterizacion?.respuestas ?? []),
      };
      console.log('here 2', this.values);
    });
  }
  override async ngOnInit() {
    await super.ngOnInit();
    const url = '/menu/saet-caracterizacion-iniciar';
    const idCaracterizacion: number =
      this.caracterizacion?.id_caracterizacion ?? 0;
    handleMode(idCaracterizacion, url, this.formMode, this.nie, this.router);
    this.init();
  }
  formMode: FormMode = FormMode.CREATE;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService
  ) {
    super(document, catalogoServiceCOR, route, router);
    const storedValues = localStorage.getItem('values');
    if (storedValues) {
      this.values = JSON.parse(storedValues);
    }

    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      const formMode = params.get('mode');
      console.log('form mode -----', formMode);
      if (nie) {
        this.nie = nie;
      }

      switch (formMode) {
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

    catalogoServiceCOR.getCORQuestions().then(result => {
      this.corSurveys.push(...result.cuestionarios);
    });
    catalogoServiceCOR.getStudentInfo(this.nie).then(result => {
      this.studentInfo = result.estudiante;
      this.generalInformation = {
        ...this.generalInformation,
        values: [
          result.estudiante.nombreCompleto,
          result.estudiante.nie,
          result.estudiante.fechaNacimiento,
          result.estudiante.direccion,
          result.estudiante.telefono[0],
          result.estudiante.correo,
        ],
      };
      this.institutionalInfo = {
        ...this.institutionalInfo,
        values: [
          result.centroEducativo.nombre,
          result.centroEducativo.codigo,
          result.centroEducativo.direccion,
          result.centroEducativo.ultimoGradoCursado,
          result.centroEducativo.gradoActual,
          result.centroEducativo.seccion,
          result.centroEducativo.docenteOrientador,
          result.centroEducativo.correoOrientador,
          result.centroEducativo.telefonoOrientador[0],
        ],
      };
    });
    this.init();
  }

  QuestionType = QuestionType;
  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }
  convertString(input: string): string {
    let result = input.toLowerCase();

    const accentsMap: { [key: string]: string } = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      ü: 'u',
      ñ: 'n',
    };

    result = result.replace(/[áéíóúüñ]/g, match => accentsMap[match]);

    result = result.replace(/\s+/g, '_');

    return result;
  }

  generatePDF() {
    const doc = new jsPDF();

    const respuestas =
      this.caracterizacion?.respuestas.map((respuesta: iQuestion) => [
        respuesta.id_pregunta.toString(),
        respuesta.pregunta,
        respuesta.respuesta ?? '',
      ]) ?? [];

    doc.text('Caracterización de estudiante', 10, 10);
    autoTable(doc, {
      head: [['ID Pregunta', 'Pregunta', 'Respuesta']],
      body: [...respuestas.map(respuesta => respuesta)],
      startY: 30,
    });
    doc.save('student-info.pdf');
  }
  async retornarCaracterizacion() {
    await this.router.navigate([
      'menu/saet-caracterizacion-estudiante',
      this.nie,
    ]);
  }
  async entrarEditMode() {
    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace('/view', '/edit');
    this.formMode = FormMode.EDIT;
    //this.updateStoredValues(`${this.targetEspecialidad}_values`);
    this.router.navigateByUrl(newUrl);
  }
  async salir() {
    this.confirmationService.confirm({
      message:
        'Al darle click en <b>Salir de edición sin guardar</b> perderá todo el progreso de edición realizado.',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('acept');
      },
      reject: () => {
        console.log('reject');
      },
    });
  }
  validarPreguntas(respuestas: IQuestionaryAnswer[], cuestionarios: iSurvey[]) {
    let idsValidos = new Set();
    cuestionarios.forEach(cuestionario => {
      cuestionario.preguntas.forEach(pregunta => {
        idsValidos.add(pregunta.id_pregunta);
      });
    });

    const respuestasValidas = respuestas.filter(respuesta => {
      return idsValidos.has(respuesta.id_pregunta);
    });
    return respuestasValidas;
  }

  async update() {
    const objToUpdate = {};
    const respuestas = this.getAnswerObject(this.values);
    const objToSave: ISaveCaracterizacion = {
      id_caracterizacion: this.caracterizacion?.id_caracterizacion ?? 0,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_especialista: 3,
      id_docente_apoyo: 0,
      id_modulo: SAET_MODULE.COR,
      respuestas: this.validarPreguntas(respuestas, this.corSurveys),
      grupoFamiliar: [],
    };
    console.log('values ', this.values);
    console.log('objToSave', objToSave);
    try {
      const resp = this.catalogoServiceCOR.updateCaracterizacion(objToSave);
      console.log('resp', await resp);
    } catch (e) {
      console.log('error e', e);
      const error = e as Error;
      const errorDetails = JSON.parse(error.message);

      this.userMessage = {
        showMessage: true,
        message: errorDetails.message,
        titleMessage: 'Error',
        type: MessageType.DANGER,
      };
    }
  }
  async save() {
    const respuestas = this.getAnswerObject(this.values);
    const objToSave: ISaveCaracterizacion = {
      id_caracterizacion: null,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_especialista: 3,
      id_docente_apoyo: 0,
      id_modulo: SAET_MODULE.COR,
      respuestas: this.validarPreguntas(respuestas, this.corSurveys),
      grupoFamiliar: [],
    };
    if (objToSave.respuestas.length === 0) {
      this.userMessage = {
        showMessage: true,
        message: '¡Debes llenar aunque sea una pregunta para guardar!',
        titleMessage: 'Atención',
        type: MessageType.WARNING,
      };
      return;
    }
    console.log('values ', this.values);
    console.log('obj to save', objToSave);

    try {
      const response =
        await this.catalogoServiceCOR.saveCaracterizacion(objToSave);
      console.log('response ', response);
      if (response.id_caracterizacion !== 0) {
        this.userMessage = {
          showMessage: true,
          message: '¡Los datos han sido guardados exitosamente!',
          titleMessage: 'Datos guardados',
          type: MessageType.SUCCESS,
        };
        const url = '/menu/saet-caracterizacion-iniciar';
        handleMode(
          response.id_caracterizacion ?? 0,
          url,
          this.formMode,
          this.nie,
          this.router
        );
      }
      console.log('try ');
    } catch (e) {
      console.log('error e', e);
      const error = e as Error;
      const errorDetails = JSON.parse(error.message);

      this.userMessage = {
        showMessage: true,
        message: errorDetails.message,
        titleMessage: 'Error',
        type: MessageType.DANGER,
      };
    }
  }

  async rejectConfirmDialog() {
    await this.router.navigate([
      'menu/saet-caracterizacion-estudiante',
      this.nie,
    ]);
  }
  acceptConfirmDialog() {
    this.confirmationService.close();
  }
  getName(name: string): string {
    return this.convertString(name);
  }
  values: { [key: string]: string } = {};
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  onchange(keyValue: KeyValue) {
    console.log('onchange triggered', keyValue);
    this.values[keyValue.key] = keyValue.value;
    localStorage.setItem('values', JSON.stringify(this.values));
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
}
