import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveCaracterizacion,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionType } from '../../shared/component.config';
import {
  IMessageComponent,
  MessageType,
} from '../../interfaces/message-component.interface';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import {iQuestion, iSurvey} from '../../shared/survey';
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
import { SAET_MODULE } from '../../shared/evaluaciones';
import { FormTablePariente } from '../../component/saet-form-table/saet-form-table.component';
import {ButtonStyle} from "../../component/saet-button/saet-button.component";

interface IinformationTab {
  labels: string[];
  values: string[];
  legend: string;
  isActive: boolean;
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

  @ViewChild('bottomAnchor') override bottomAnchor!: ElementRef<HTMLDivElement>;
  @ViewChild('topAnchor') override topAnchor!: ElementRef<HTMLDivElement>;

  loadingMessage?: string = undefined;
  corSurveys: iSurvey[] = [];
  formModeEnum = FormMode;
  baseUrl = '/menu/saet-caracterizacion-iniciar';
  stringBreadCrumbAction = '';
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
      console.log('form mode updated ', this.formMode);
      console.log('caracterizacion updated ', this.caracterizacion);
      if (this.formMode === FormMode.VIEW) {
        this.values = this.respuestasToValues(
          this.caracterizacion?.respuestas ?? []
        );
        return;
      }
      const  respuestasDb = this.respuestasToValues(this.caracterizacion?.respuestas ?? [])
      this.storedValues = {
        ...respuestasDb
      };
      this.values = {
        ...respuestasDb,
        ...this.values,
      };
    });
  }
  override async ngOnInit() {
    await super.ngOnInit();
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
    this.userMessage.showMessage = true;
    const storedValues = localStorage.getItem('values');
    if (storedValues) {
      this.values = JSON.parse(storedValues);
    }

    this.caracterizacionLoaded.then(() => {
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

        if (
          this.caracterizacion !== undefined &&
          this.caracterizacion?.id_caracterizacion !== 0 &&
          this.formMode === FormMode.CREATE
        ) {
          router.navigate([this.baseUrl, nie, 'view']);
        }
        if (
          this.caracterizacion === undefined ||
          this.caracterizacion?.id_caracterizacion === 0 &&
          this.formMode === FormMode.EDIT
        ) {
          router.navigate([this.baseUrl, nie]);
        }
        // handleMode(idCaracterizacion, url, this.formMode, this.nie, this.router);
      });
      const corQuestionPromise = catalogoServiceCOR.getCORQuestions();
      Promise.all([corQuestionPromise]).then(([corQuestionResult]) => {
        const cuestionariosOrdenados = corQuestionResult.cuestionarios.map(cuestionario => {
          const preguntasOrdenadas = [...cuestionario.preguntas].sort((a, b) => a.id_pregunta - b.id_pregunta);
          return {
            ...cuestionario,
            preguntas: preguntasOrdenadas
          };
        });

        this.corSurveys.push(...cuestionariosOrdenados);
        this.pageLoading = false;
      });
      this.init();

      this.guardianControlData = this.caracterizacion?.grupoFamiliar ? this.caracterizacion?.grupoFamiliar.map((familiar) => {
        const familiarToReturn:FormTablePariente = {
          id: '',
          nombreCompleto: `${familiar.primer_nombre ?? ''} ${familiar.segundo_nombre ?? ''} ${familiar.primer_apellido ?? ''} ${familiar.segundo_apellido ?? ''}`.trim(),
          edad: familiar.edad ? familiar.edad.toString() : '',
          nivelEducativo: familiar.nivel_educativo,
          ocupacion: familiar.ocupacion,
          parentesco: familiar.parentesco,
        }
        return familiarToReturn;
      }): [];
    });
  }

  QuestionType = QuestionType;
  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }

  async generatePDF() {
    this.pageLoading = true;
    console.log(' to generate pdf ');
    const answers = await this.catalogoServiceCOR.getCaracterizacionPorNIE(this.nie);
    await this.generateTextPdf({
      survey: this.corSurveys,
      studentNie: this.nie,
      title: 'Caracterización COR del estudiante',
      answers: answers.respuestas ?? [],
      studentFullName: this.studentInfo?.nombreCompleto ?? ''
    });
    /*const doc = new jsPDF();
    let currentY = 30;

    const title = 'Caracterización de estudiante';
    const studentName =
      `${this.studentInfo?.nombreCompleto} | ${this.studentInfo?.nie}` ||
      'Nombre del estudiante no disponible';

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
    doc.save(`Caracterizacion-estudiante-${this.nie}.pdf`);

    this.pageLoading = false;*/
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
    this.userMessage.showMessage = false;
    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace('/edit', '/view');
    this.formMode = FormMode.VIEW;
    //this.updateStoredValues(`${this.targetEspecialidad}_values`);
    await this.router.navigateByUrl(newUrl);
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

  onGuardianTableChange(list: FormTablePariente[]) {
    this.guardianControlData = [...list];
  }
  private parseFullName(fullName: string): {
    primer_nombre:    string;
    segundo_nombre:   string;
    tercer_nombre:    string;
    primer_apellido:  string;
    segundo_apellido: string;
    tercer_apellido:  string;
  } {
    const clean = fullName.trim().replace(/\s+/g, ' ');
    if (!clean) {
      return {
        primer_nombre: '', segundo_nombre: '', tercer_nombre: '',
        primer_apellido: '', segundo_apellido: '', tercer_apellido: ''
      };
    }

    const parts = clean.split(' ');        // tokeniza por espacios
    let nombres:   string[] = [];
    let apellidos: string[] = [];

    switch (parts.length) {
      case 1:                     // Solo un nombre
        nombres    = [parts[0]];
        break;
      case 2:                     // Nombre + apellido
        nombres    = [parts[0]];
        apellidos  = [parts[1]];
        break;
      case 3:                     // 2 nombres + 1 apellido   |   1 nombre + 2 apellidos
        nombres    = [parts[0], parts[1]];
        apellidos  = [parts[2]];
        break;
      case 4:                     // 2 nombres + 2 apellidos
        nombres    = parts.slice(0, 2);
        apellidos  = parts.slice(2);
        break;
      case 5:                     // 3 nombres + 2 apellidos
        nombres    = parts.slice(0, 3);
        apellidos  = parts.slice(3);
        break;
      default:                    // 3 nombres + 3 apellidos (o más → se descartan extras)
        nombres    = parts.slice(0, 3);
        apellidos  = parts.slice(3, 6);
    }

    return {
      primer_nombre:    nombres[0]   ?? '',
      segundo_nombre:   nombres[1]   ?? '',
      tercer_nombre:    nombres[2]   ?? '',
      primer_apellido:  apellidos[0] ?? '',
      segundo_apellido: apellidos[1] ?? '',
      tercer_apellido:  apellidos[2] ?? '',
    };
  }
  async update() {
    this.pageLoading = true;
    this.userMessage.showMessage = false;

    this.loadingMessage = 'Actualizando caracterizacion';
    this.userMessage.showMessage = false;

    const respuestas = this.getAnswerObject(this.values);

    console.log('caracterizacion ', this.caracterizacion);
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

    const objToSave: ISaveCaracterizacion = {
      id_caracterizacion: this.caracterizacion?.id_caracterizacion ?? 0,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_especialista: parseInt(idPersona) ?? 0,
      id_docente_apoyo: 0,
      id_modulo: SAET_MODULE.COR,
      respuestas: this.validarPreguntas(respuestas, this.corSurveys),
      grupoFamiliar: [],
    };
    console.log('obj to save', objToSave);
    objToSave.grupoFamiliar = this.guardianControlData.map(p => {
      const parsed = this.parseFullName(p.nombreCompleto);

      return {
        grupo_familiar_pk: p.id.startsWith('temp-') ? null : Number(p.id),  // null = nuevo
        ...parsed,
        edad:            p.edad ? Number(p.edad) : 0,
        parentesco:      p.parentesco,
        nivel_educativo: p.nivelEducativo,
        ocupacion:       p.ocupacion,
      };
    });

    try {
      const resp =
        await this.catalogoServiceCOR.updateCaracterizacion(objToSave);
      console.log('respuesta actualizacion ', resp);

      if(resp.id_caracterizacion === 0){
        this.userMessage.showMessage = true;
        this.userMessage.type = MessageType.DANGER;
        this.userMessage.message = 'Ocurrio un error al guardar caracterizacion';
        this.userMessage.titleMessage = 'Error';
        return;
      }

      this.userMessage.showMessage = true;
      this.userMessage.type = MessageType.SUCCESS;
      this.userMessage.message = '¡Los datos han sido guardados exitosamente!';
      this.userMessage.titleMessage = 'Datos guardados';

      this.caracterizacion = await this.catalogoServiceCOR.getCaracterizacionPorNIE(this.nie);

      const  respuestasDb = this.respuestasToValues(this.caracterizacion?.respuestas ?? []);
      this.storedValues = {
        ...respuestasDb
      }
      if (this.caracterizacion.id_caracterizacion !== 0) {
        this.readOnlyPaei = false;
        this.readOnlyEvaluaciones = false;
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
      this.loadingMessage = undefined;
    }
  }
  async save() {
    this.pageLoading = true;
    this.userMessage.showMessage = false;

    const respuestas = this.getAnswerObject(this.values);
    const idPersona = localStorage.getItem('id_persona');

    if (!idPersona || isNaN(Number(idPersona))) {
      this.userMessage.message =
        'Especialista no fue cargado correctamente, por favor recargar pagina';
      this.userMessage.titleMessage = 'Advertencia';
      this.userMessage.type = MessageType.WARNING;
      return;
    }

    const objToSave: ISaveCaracterizacion = {
      id_caracterizacion: this.caracterizacion?.id_caracterizacion ?? 0,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_especialista: parseInt(idPersona) ?? 0,
      id_docente_apoyo: 0,
      id_modulo: SAET_MODULE.COR,
      respuestas: this.getAnswerObject(this.values),
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

    try {
      const response =
        objToSave.id_caracterizacion !== 0 ?
          await this.catalogoServiceCOR.updateCaracterizacion(objToSave)
          : await this.catalogoServiceCOR.saveCaracterizacion(objToSave);
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
      this.userMessage = {
        showMessage: true,
        message: '¡Los datos han sido guardados exitosamente!',
        titleMessage: 'Datos guardados',
        type: MessageType.SUCCESS,
      };
      this.caracterizacion = await this.catalogoServiceCOR.getCaracterizacionPorNIE(this.nie);
      const  respuestasDb = this.respuestasToValues(this.caracterizacion?.respuestas ?? []);
      this.storedValues = {
        ...respuestasDb
      }
      if (this.caracterizacion.id_caracterizacion !== 0) {
        this.readOnlyPaei = false;
        this.readOnlyEvaluaciones = false;
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
    }
    this.pageLoading = false;
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
  storedValues: { [key: string]: string } = {};
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

  protected readonly ButtonStyle = ButtonStyle;
}
