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
import { CorBaseComponent } from '../../CorBaseComponent';

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
import {PrintPdf} from "../../shared/PrintPdf";
import {FormTablePariente} from "../../component/saet-form-table/saet-form-table.component";

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
  extends CorBaseComponent
  implements IMessageComponent, OnInit
{
  @ViewChild('cd') confirmDialog: any;


  loadingMessage?:string = undefined;
  corSurveys: iSurvey[] = [];
  formModeEnum = FormMode;

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
      const storedValues = localStorage.getItem(`caracterizacion-${this.nie}`);
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
    });
  }
  override async ngOnInit() {

    console.log('before --------------- xx ')
    await super.ngOnInit();
    console.log('init --------------- xx ')
    const url = '/menu/saet-caracterizacion-iniciar';
    const idCaracterizacion: number =
      this.caracterizacion?.id_caracterizacion ?? 0;
    handleMode(idCaracterizacion, url, this.formMode, this.nie, this.router);
    this.init();
  }
  formMode: FormMode = FormMode.CREATE;
  guardianControlData: FormTablePariente[] = [];
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService
  ) {
    super(document, catalogoServiceCOR, route, router);
    this.pageLoading = true;
    const storedValues = localStorage.getItem('values');
    if (storedValues) {
      this.values = JSON.parse(storedValues);
    }

    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      const formMode = params.get('mode');

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


    const corQuestionPromise = catalogoServiceCOR.getCORQuestions();
    const studentInfoPromise = catalogoServiceCOR.getStudentInfo(this.nie);
    const studentGuardiansPromise = catalogoServiceCOR.getGuardians(this.nie);
    Promise.all([corQuestionPromise,studentInfoPromise, studentGuardiansPromise]).then(([corQuestionResult, studentInfoResult, guardiansResult]) => {
      this.corSurveys.push(...corQuestionResult.cuestionarios);
      // ####################
      this.studentInfo = studentInfoResult.estudiante;
      this.generalInformation = {
        ...this.generalInformation,
        values: [
          studentInfoResult.estudiante.nombreCompleto,
          studentInfoResult.estudiante.nie,
          studentInfoResult.estudiante.fechaNacimiento,
          studentInfoResult.estudiante.direccion,
          studentInfoResult.estudiante.telefono[0],
          studentInfoResult.estudiante.correo,
        ],
      };
      this.institutionalInfo = {
        ...this.institutionalInfo,
        values: [
          studentInfoResult.centroEducativo.nombre,
          studentInfoResult.centroEducativo.codigo,
          studentInfoResult.centroEducativo.direccion,
          studentInfoResult.centroEducativo.ultimoGradoCursado,
          studentInfoResult.centroEducativo.gradoActual,
          studentInfoResult.centroEducativo.seccion,
          studentInfoResult.centroEducativo.docenteOrientador,
          studentInfoResult.centroEducativo.correoOrientador,
          studentInfoResult.centroEducativo.telefonoOrientador[0],
        ],
      };
      // #####################
      console.log('Guardian result is ', guardiansResult);
      this.guardianControlData = guardiansResult.map(guardian => {
        return {
          id: guardian.grupo_familiar_pk,
          parentesco: guardian.parentesco,
          ocupacion: guardian.ocupacion,
          nivelEducativo: guardian.nivel_educativo,
          nombreCompleto: `${guardian.primer_nombre} ${guardian.segundo_nombre} ${guardian.primer_apellido} ${guardian.segundo_apellido}`,
        } as unknown as FormTablePariente;
      });


      this.pageLoading = false;
    })

    /*.then(result => {
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
    });*/


    this.init();
  }

  QuestionType = QuestionType;
  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }


  async generatePDF() {
    const doc = new jsPDF();
    let currentY = 30;

    const title = 'Caracterización de estudiante';
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const titleX = (pageWidth - titleWidth) / 2;

    const logoPath = '/assets/logo.png'; // Cambia esto a la ruta de tu archivo de logo

    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    };
    const logo = await loadImage(logoPath);
    console.log('logo ', logo)
    doc.text(title, titleX, currentY);
    currentY += 10; // Espacio debajo del título principal
    let pageNumber = 0;
    const respuestasFormulario = this.getAnswerObject(this.values);
    console.log('respuesta formulario en pdf ', respuestasFormulario);
    this.corSurveys.forEach(cuestionario => {
      const respuestas =
        this.caracterizacion?.respuestas
          .filter((respuesta: iQuestion) =>
            cuestionario.preguntas.some(p => p.id_pregunta === respuesta.id_pregunta))
          .map((respuesta: iQuestion) => {
            const concatOptions = respuesta.opcion.reduce((acc, current) => {
              return acc ? `${acc}, ${current.opcion}` : current.opcion;
            }, '');
            console.log('concat options ', concatOptions);
            const strResponse = respuesta?.respuesta !== undefined && respuesta?.respuesta !== '' ? respuesta?.respuesta : concatOptions;
            return [
              respuesta.pregunta,
              strResponse,
            ];
          }) ?? [];
      console.log('repsuestas', respuestas);
      console.log('repsuestas 2', this.caracterizacion?.respuestas);
      console.log('cuestionario', cuestionario);
      console.log('----------');
      if (respuestas.length > 0) {
        // Agrega el título del cuestionario como encabezado
        doc.text(cuestionario.titulo, 8, currentY);
        currentY += 10; // Espacio debajo del título del cuestionario

        // Agrega la tabla para este cuestionario
        autoTable(doc, {
          head: [['Pregunta', 'Respuesta']],
          body: respuestas,
          startY: currentY,
          didDrawPage: (data) => {
            console.log('did draw ', data);
            doc.setFontSize(10);
            if(data.pageNumber !== pageNumber){
              doc.text(`Página ${data.pageNumber}`, pageWidth - 40, pageHeight - 10);
              pageNumber = data.pageNumber;
            }
            doc.addImage(logo, 'PNG', 10, pageHeight - 30, 50, 20);
            pageNumber++;
          }
        });
        currentY = (doc as any).lastAutoTable.finalY + 10;
      }

      return false;
    });

    console.log('Respuestas ---- ', this.caracterizacion?.respuestas);
    doc.save(`Caracterizacion-estudiante-${this.nie}.pdf`);
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
    const idsValidos = new Set();
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
    this.pageLoading = true;
    this.loadingMessage = 'Actualizando caracterizacion'
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
    try {
      const resp = await this.catalogoServiceCOR.updateCaracterizacion(objToSave);
      console.log('respuesta de actualizar ', resp);
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

    } finally {
      this.pageLoading = false;
      this.loadingMessage = undefined;
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
    localStorage.setItem(
      `caracterizacion-${this.nie}`,
      JSON.stringify(this.values)
    );
  }
  onchange(keyValue: KeyValue) {
    this.values[keyValue.key] = keyValue.value;
    localStorage.setItem(
      `caracterizacion-${this.nie}`,
      JSON.stringify(this.values)
    );
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
