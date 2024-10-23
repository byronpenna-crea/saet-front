import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CorBaseComponent } from '../../CorBaseComponent';
import {
  IMessageComponent, MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveCaracterizacion,
  ISaveCaracterizacionDAI
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import {iQuestion, iSurvey} from '../../shared/survey';
import { QuestionType } from '../../shared/component.config';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import {FormMode, IQuestionaryAnswer, IValuesForm} from '../../QuestionsComponent';
import { BaseComponent } from '../../BaseComponent';
import { DaiBaseComponent } from '../../DaiBaseComponent';
import { CatalogoServiceDai } from '../../../../../services/catalogo/catalogo.service.dai';
import { SAET_MODULE } from '../../shared/evaluaciones';
import {handleMode} from "../../shared/forms";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'app-estudiante-dai-caracterizacion',
  templateUrl: './estudiante-dai-caracterizacion.component.html',
  styleUrls: ['./estudiante-dai-caracterizacion.component.css'],
})
export class EstudianteDaiCaracterizacionComponent
  extends DaiBaseComponent
  implements IMessageComponent
{
  @ViewChild('cd') confirmDialog: any;
  values: { [key: string]: string } = {};
  corSurveys: iSurvey[] = [];
  baseUrl = '/menu/dai/saet-caracterizacion-estudiante';
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
      const storedValues = localStorage.getItem(`dai-caracterizacion-${this.nie}`);
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

  loadingMessage?: string = undefined;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceDai: CatalogoServiceDai,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService
  ) {
    super(document, catalogoServiceDai, route, router);
    this.pageLoading = true;

    const storedValues = localStorage.getItem('values');
    if (storedValues) {
      this.values = JSON.parse(storedValues);
    }
    const caracterizacionNiePromise = this.catalogoServiceDai.getCaracterizacionPorNIE(
      this.nie
    );
    const questionPromise = catalogoServiceDai.getDaiCaracterizacionQuestion();
    Promise.all([caracterizacionNiePromise, questionPromise]).then(([caracterizacionNieResult,questionResult]) => {
      this.caracterizacion = caracterizacionNieResult;
      this.corSurveys.push(...questionResult.cuestionarios);

      const storedValues = localStorage.getItem(`dai-caracterizacion-${this.nie}`);
      if (storedValues) {
        this.values = JSON.parse(storedValues);
      }
      this.values = {
        ...this.values,
        ...this.respuestasToValues(this.caracterizacion?.respuestas ?? []),
      };
      this.pageLoading = false;
    })


    this.init();
  }
  formMode: FormMode = FormMode.CREATE;
  formModeEnum = FormMode;


  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem(
      `dai-caracterizacion-${this.nie}`,
      JSON.stringify(this.values)
    );
  }
  onchange(keyValue: KeyValue) {
    console.log('onchange triggered', keyValue);
    this.values[keyValue.key] = keyValue.value;
    localStorage.setItem(
      `dai-caracterizacion-${this.nie}`,
      JSON.stringify(this.values)
    );
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

  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }
  // onCheckboxChange(keyValues: KeyValue[]) {
  //   const selectedValues = keyValues.map(e => e.value);
  //   this.values[keyValues[0].key] = selectedValues.toString();
  //   localStorage.setItem(
  //     `dai-caracterizacion-${this.nie}`,
  //     JSON.stringify(this.values)
  //   );
  // }
  // onchange(keyValue: KeyValue) {
  //   console.log('onchange triggered', keyValue);
  //   this.values[keyValue.key] = keyValue.value;
  //   console.log('onchange triggered values', this.values);
  //   localStorage.setItem(
  //     `dai-caracterizacion-${this.nie}`,
  //     JSON.stringify(this.values)
  //   );
  // }
  acceptConfirmDialog() {
    this.confirmationService.close();
  }
  async rejectConfirmDialog() {
    await this.router.navigate([
      'menu/saet-caracterizacion-estudiante',
      this.nie,
    ]);
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
  // async rejectConfirmDialog() {
  //   await this.router.navigate([
  //     'menu/saet-caracterizacion-estudiante',
  //     this.nie,
  //   ]);
  // }
  async entrarEditMode() {
    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace('/view', '/edit');
    this.formMode = FormMode.EDIT;
    this.router.navigateByUrl(newUrl);
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
  async save() {
    this.pageLoading = true;
    const respuestas = this.getAnswerObject(this.values);
    const idPersona = localStorage.getItem('id_persona');

    if (!idPersona || isNaN(Number(idPersona))) {
      this.userMessage.message = 'DAI no fue cargado correctamente, por favor recargar pagina';
      this.userMessage.titleMessage = 'Advertencia';
      this.userMessage.type = MessageType.WARNING;
      return;
    }
    const objToSave: ISaveCaracterizacionDAI = {
      id_caracterizacion: null,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_docente_apoyo: parseInt(idPersona) ?? 0,
      id_modulo: SAET_MODULE.COR,
      respuestas: this.validarPreguntas(respuestas, this.corSurveys)
    };

    try {
      const response = await this.catalogoServiceDai.saveCaracterizacion(objToSave);
      console.log('response ', response);
      if (response.id_caracterizacion !== 0) {
        this.userMessage = {
          showMessage: true,
          message: '¡Los datos han sido guardados exitosamente!',
          titleMessage: 'Datos guardados',
          type: MessageType.SUCCESS,
        };
        handleMode(
          response.id_caracterizacion ?? 0,
          this.baseUrl,
          FormMode.VIEW,
          this.nie,
          this.router
        );
      }
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
    }

  }
  async retornarCaracterizacion() {}
  async update() {
    this.pageLoading = true;
    this.loadingMessage = 'Actualizando caracterizacion';
    const respuestas = this.getAnswerObject(this.values);
    console.log('caracterizacion ', this.caracterizacion);
    if(
      this.caracterizacion === undefined ||
      this.caracterizacion?.id_caracterizacion === 0){

      this.userMessage.message = 'Caracterizacion no fue cargada correctamente, no es posible actualizar';
      this.userMessage.showMessage = true;
      this.userMessage.titleMessage = 'Advertencia';
      this.userMessage.type = MessageType.WARNING;
    }
    const idPersona = localStorage.getItem('id_persona');
    if (!idPersona || isNaN(Number(idPersona))) {
      this.userMessage.message = 'Problemas encontrando especialista responsable, prueba cerrar sesion e iniciar de nuevo';
      this.userMessage.showMessage = true;
      this.userMessage.titleMessage = 'Advertencia';
      this.userMessage.type = MessageType.WARNING;
      return;
    }

    const objToSave: ISaveCaracterizacionDAI = {
      id_caracterizacion: this.caracterizacion?.id_caracterizacion ?? 0,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_docente_apoyo: parseInt(idPersona) ?? 0,
      id_modulo: SAET_MODULE.COR,
      respuestas: this.validarPreguntas(respuestas, this.corSurveys)
    };

    try {
      const resp = await this.catalogoServiceDai.updateCaracterizacion(objToSave);
      console.log('respuesta actualizacion ', resp);
      console.log('url here ', this.baseUrl);
      this.router.navigate([this.baseUrl, this.nie, 'view']);
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
  async generatePDF() {

    console.log('caracterizacion aca --------------- >', this.caracterizacion);
    /*this.pageLoading = true;
    const doc = new jsPDF();
    let currentY = 30;
    const title = 'Caracterización hecha por DAI del estudiante';
    const studentName = `${this.studentInfo?.nombreCompleto} | ${this.studentInfo?.nie}` || 'Nombre del estudiante no disponible';

    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const titleX = (pageWidth - titleWidth) / 2;

    const logoPath = '/assets/logo.png';

    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = err => reject(err);
      });
    };
    const logo = await loadImage(logoPath);
    console.log('logo ', logo);
    doc.text(title, titleX, currentY);
    currentY += 10;

    doc.setFontSize(12);
    const studentNameWidth = doc.getTextWidth(studentName);
    const studentNameX = (pageWidth - studentNameWidth) / 2;
    doc.text(studentName, studentNameX, currentY);
    currentY += 10; // Espacio debajo del nombre del estudiante

    doc.setFontSize(15);
    let pageNumber = 0;
    const respuestasFormulario = this.getAnswerObject(this.values);
    console.log('respuesta formulario en pdf ', respuestasFormulario);
    this.corSurveys.forEach(cuestionario => {
      const respuestas =
        this.caracterizacion?.respuestas
          .filter((respuesta: iQuestion) =>
            cuestionario.preguntas.some(
              p => p.id_pregunta === respuesta.id_pregunta
            )
          )
          .map((respuesta: iQuestion) => {
            const concatOptions = respuesta.opcion.reduce((acc, current) => {
              return acc ? `${acc}, ${current.opcion}` : current.opcion;
            }, '');
            console.log('concat options ', concatOptions);
            const strResponse =
              respuesta?.respuesta !== undefined && respuesta?.respuesta !== ''
                ? respuesta?.respuesta
                : concatOptions;
            return [respuesta.pregunta, strResponse];
          }) ?? [];

      if (respuestas.length > 0) {
        // Agrega el título del cuestionario como encabezado
        doc.text(cuestionario.titulo, 8, currentY);
        currentY += 10; // Espacio debajo del título del cuestionario

        // Agrega la tabla para este cuestionario
        autoTable(doc, {
          head: [['Pregunta', 'Respuesta']],
          body: respuestas,
          startY: currentY,
          didDrawPage: data => {
            console.log('did draw ', data);
            doc.setFontSize(10);
            if (data.pageNumber !== pageNumber) {
              doc.text(
                `Página ${data.pageNumber}`,
                pageWidth - 40,
                pageHeight - 10
              );
              pageNumber = data.pageNumber;
            }
            doc.addImage(logo, 'PNG', 10, pageHeight - 30, 50, 20);
            pageNumber++;
          },
        });
        currentY = (doc as any).lastAutoTable.finalY + 10;
      }

      return false;
    });

    console.log('Respuestas ---- ', this.caracterizacion?.respuestas);
    doc.save(`Caracterizacion-dai-estudiante-${this.nie}.pdf`);

    this.pageLoading = false;*/
  }

  protected readonly SAET_MODULE = SAET_MODULE;
}
