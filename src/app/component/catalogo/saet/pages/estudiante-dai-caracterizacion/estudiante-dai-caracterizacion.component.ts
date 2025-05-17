import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CorBaseComponent } from '../../CorBaseComponent';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveCaracterizacion,
  ISaveCaracterizacionDAI,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { iQuestion, iSurvey } from '../../shared/survey';
import { QuestionType } from '../../shared/component.config';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import {
  FormMode,
  IQuestionaryAnswer,
  IValuesForm,
} from '../../QuestionsComponent';
import { DaiBaseComponent } from '../../DaiBaseComponent';
import { CatalogoServiceDai } from '../../../../../services/catalogo/catalogo.service.dai';
import { SAET_MODULE } from '../../shared/evaluaciones';
import { handleMode } from '../../shared/forms';

import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { textAreaIds } from '../../../../../services/shared/saet-types';

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
  @ViewChild('bottomAnchor') override bottomAnchor!: ElementRef<HTMLDivElement>;
  @ViewChild('topAnchor') override topAnchor!: ElementRef<HTMLDivElement>;

  values: { [key: string]: string } = {};
  storedValues: { [key: string]: string } = {};
  corSurveys: iSurvey[] = [];
  baseUrl = '/menu/dai/saet-caracterizacion-estudiante';
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

  stringBreadCrumbAction = '';
  init() {
    this.route.paramMap.subscribe(params => {

      const formMode = params.get('mode');
      console.log('form mode on init', formMode);
      console.log('caracterizacion dai', this.caracterizacion);
      switch (formMode) {
        case null:
          this.formMode = FormMode.CREATE;
          this.stringBreadCrumbAction = '';
          break;
        case 'view':
          this.formMode = FormMode.VIEW;
          this.stringBreadCrumbAction = 'Vista';
          break;
        case 'edit':
          this.formMode = FormMode.EDIT;
          this.stringBreadCrumbAction = 'Edición';
          break;
      }

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

    // Cargar datos de localStorage general
    const storedValues = localStorage.getItem('values');
    if (storedValues) {
      this.values = JSON.parse(storedValues);
    }

    // Iniciar llamada a API
    Promise.all([
      this.catalogoServiceDai.getCaracterizacionPorNIE(this.nie),
      this.catalogoServiceDai.getDaiCaracterizacionQuestion()
    ])
      .then(async ([caracterizacionNieResult, questionResult]) => {
        console.log('Caracterización obtenida: ', caracterizacionNieResult);
        this.caracterizacion = caracterizacionNieResult;

        // Redirección según estado
        if (
          this.caracterizacion?.id_caracterizacion !== 0 &&
          this.formMode === FormMode.CREATE
        ) {
          await this.router.navigate([this.baseUrl, this.nie, 'view']);
          return;
        }

        if (
          (this.caracterizacion === undefined || this.caracterizacion?.id_caracterizacion === 0) &&
          this.formMode === FormMode.EDIT
        ) {
          await this.router.navigate([this.baseUrl, this.nie]);
          return;
        }

        // Cargar preguntas
        this.corSurveys.push(...questionResult.cuestionarios);

        // Cargar respuestas desde localStorage específico si existen
        const daiStored = localStorage.getItem(`dai-caracterizacion-${this.nie}`);
        if (daiStored) {
          this.values = JSON.parse(daiStored);
        }

        // Mapear respuestas a valores
        this.values = {
          ...this.values,
          ...this.respuestasToValues(this.caracterizacion?.respuestas ?? []),
        };

        // Finalizar carga
        this.pageLoading = false;

        // Log final ya con caracterización disponible
        console.log('#$$$$$$$$$$$$$$$$$$$$$$$', this.caracterizacion);
        const storedValues = localStorage.getItem(
          `dai-caracterizacion-${this.nie}`
        );
        if (storedValues) {
          this.values = JSON.parse(storedValues);
        }

        const respuestasDb = this.respuestasToValues(
          this.caracterizacion?.respuestas ?? []
        );
        // if (this.formMode === FormMode.VIEW) {
        //
        //   return;
        // }
        console.log('respuestas db here ', respuestasDb)
        this.storedValues = {
          ...respuestasDb
        }
        this.values = {
          ...respuestasDb,
          ...this.values,
        };
      })
      .catch((e) => {
        console.error('Error cargando la caracterización DAI', e);

        if (
          (this.caracterizacion === undefined || this.caracterizacion?.id_caracterizacion === 0) &&
          this.formMode === FormMode.CREATE
        ) {
          this.router.navigate([this.baseUrl, this.nie]);
        }

        this.pageLoading = false;
      });

    // Inicializar cualquier otra lógica necesaria
    this.init();
  }
  formModeEnum = FormMode;

  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem(
      `dai-caracterizacion-${this.nie}`,
      JSON.stringify(this.values)
    );
  }
  onBlurRichTextChange(keyValue: KeyValue){
    console.log('blur ----> ',keyValue);
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
    console.log('stored values', this.storedValues);
    localStorage.setItem(`dai-caracterizacion-${this.nie}`, JSON.stringify(this.values));
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
  async salirViewMode() {
    await this.router.navigate([
      'menu/dai/saet-datos-estudiante',
      this.nie,
    ]);
    /*this.confirmationService.confirm({
      message:
        'Al darle click en <b>Salir de edición sin guardar</b> perderá todo el progreso de edición realizado.',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('acept');
      },
      reject: () => {
        console.log('reject');
      },
    });*/
  }

  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }
  acceptConfirmDialog() {
    this.confirmationService.close();
  }
  async rejectConfirmDialog() {
    await this.router.navigate([
      'menu/dai/saet-datos-estudiante',
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
    await this.router.navigateByUrl(newUrl);
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
    this.userMessage.showMessage = false;

    const respuestas = this.getAnswerObject(this.values);
    const idPersona = localStorage.getItem('id_persona');

    if (!idPersona || isNaN(Number(idPersona))) {
      this.userMessage.message =
        'DAI no fue cargado correctamente, por favor recargar pagina';
      this.userMessage.titleMessage = 'Advertencia';
      this.userMessage.type = MessageType.WARNING;
      return;
    }
    const objToSave: ISaveCaracterizacionDAI = {
      id_caracterizacion: this.caracterizacion?.id_caracterizacion ?? null,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_docente_apoyo: parseInt(idPersona) ?? 0,
      id_modulo: SAET_MODULE.COR,
      respuestas: this.validarPreguntas(respuestas, this.corSurveys),
    };
    console.log('obj to save dai ', objToSave);
    try {
      const response =
        objToSave.id_caracterizacion !== null && objToSave.id_caracterizacion !== 0 ? await this.catalogoServiceDai.updateCaracterizacion(objToSave)
        : await this.catalogoServiceDai.saveCaracterizacion(objToSave)
      ;
      console.log('response ', response);

      if (response.id_caracterizacion === null ||
        response.id_caracterizacion === undefined ||
        response.id_caracterizacion === 0) {
        this.userMessage = {
          showMessage: false,
          message: 'Error guardando caracterizacion',
          titleMessage: 'Error',
          type: MessageType.DANGER,
        };
        return;
      }



      this.caracterizacion = await this.catalogoServiceDai.getCaracterizacionPorNIE(this.nie);
      if (this.caracterizacion.id_caracterizacion === 0) {
        this.userMessage = {
          showMessage: false,
          message: 'Error guardando caracterizacion',
          titleMessage: 'Error',
          type: MessageType.DANGER,
        };
        return;
      }

      this.userMessage = {
        showMessage: true,
        message: '¡Los datos han sido guardados exitosamente!',
        titleMessage: 'Datos guardados',
        type: MessageType.SUCCESS,
      };

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
  async salirEditMode() {
    this.userMessage.showMessage = false;

    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace('/edit', '/view');
    this.formMode = FormMode.CREATE;
    await this.router.navigateByUrl(newUrl);
  }
  async update() {
    this.pageLoading = true;
    this.userMessage.showMessage = false;
    this.loadingMessage = 'Actualizando caracterizacion';

    const respuestas = this.getAnswerObject(this.values);
    console.log('obj to save caracterizacion ------->', respuestas);
    if (
      this.caracterizacion === undefined ||
      this.caracterizacion?.id_caracterizacion === 0
    ) {
      this.userMessage.message =
        'Caracterizacion no fue cargada correctamente, no es posible actualizar';
      this.userMessage.showMessage = true;
      this.userMessage.titleMessage = 'Advertencia';
      this.userMessage.type = MessageType.WARNING;
    }
    const idPersona = localStorage.getItem('id_persona');
    if (!idPersona || isNaN(Number(idPersona))) {
      this.userMessage.message =
        'Problemas encontrando especialista responsable, prueba cerrar sesion e iniciar de nuevo';
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
      respuestas: this.validarPreguntas(respuestas, this.corSurveys),
    };

    try {
      const resp =
        await this.catalogoServiceDai.updateCaracterizacion(objToSave);
      console.log('<------- respuesta actualizacion --------->', resp);
      console.log('url here ', this.baseUrl);
      if(resp.id_caracterizacion === null || resp.id_caracterizacion === 0){
        this.userMessage.message = 'Algo salio mal en el proceso de guardado';
        this.userMessage.showMessage = true;
        this.userMessage.titleMessage = 'Advertencia';
        this.userMessage.type = MessageType.DANGER;
        return;
      }
      this.caracterizacion = await this.catalogoServiceDai.getCaracterizacionPorNIE(this.nie);
      const respuestasDb = this.respuestasToValues(
        this.caracterizacion?.respuestas ?? []
      );
      this.storedValues = {
        ...respuestasDb
      }
      // success message
      this.userMessage.message = '¡Los datos han sido guardados exitosamente!';
      this.userMessage.showMessage = true;
      this.userMessage.titleMessage = 'Datos guardados';
      this.userMessage.type = MessageType.SUCCESS;
      return;
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
    this.pageLoading = true;
    try {
      await this.generateTextPdf({
        survey: this.corSurveys,
        studentNie: this.nie,
        title: 'Caracterización hecha por DAI del estudiante',
        answers: this.caracterizacion?.respuestas ?? [],
        studentFullName: this.studentInfo?.nombreCompleto ?? ''
      });
    }catch (e){
      console.log('Error ', e);
      this.userMessage = {
        showMessage: true,
        message: 'Error no controlado',
        titleMessage: 'Error en la generacion del pdf',
        type: MessageType.DANGER,
      };
    }

  }

  protected readonly SAET_MODULE = SAET_MODULE;
  protected readonly ButtonStyle = ButtonStyle;
}
