import { Component, Inject, ViewChild } from '@angular/core';
import { DaiBaseComponent } from '../../DaiBaseComponent';
import {
  IMessageComponent,
  MessageType,
} from '../../interfaces/message-component.interface';
import { iSurvey } from '../../shared/survey';
import { SAET_MODULE, TIPO_EVALUACION } from '../../shared/evaluaciones';
import { DOCUMENT } from '@angular/common';
import { CatalogoServiceDai } from '../../../../../services/catalogo/catalogo.service.dai';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { IconComponent, QuestionType } from '../../shared/component.config';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { FormMode } from '../../QuestionsComponent';
import {
  ISavePlanAccion,
  ISaveQuestionary, IUpdatePlanAccion,
} from '../../../../../services/catalogo/catalogo.service.cor';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

@Component({
  selector: 'app-dai-plan-de-accion-iniciar',
  templateUrl: './dai-plan-de-accion-iniciar.component.html',
  styleUrls: ['./dai-plan-de-accion-iniciar.component.css'],
})
export class DaiPlanDeAccionIniciarComponent
  extends DaiBaseComponent
  implements IMessageComponent
{
  @ViewChild('cd') confirmDialog: any;
  values: { [key: string]: string } = {};
  corSurveys: iSurvey[] = [];
  baseUrl = '/menu/dai/plan-accion-iniciar';

  showActionButtons = false;
  protected readonly SAET_MODULE = SAET_MODULE;
  async entrarEditMode() {
    console.log('edit mode');
    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace('/view', '/edit');
    this.formMode = FormMode.EDIT;
    this.updateStoredValues(this.valuesKey);
    console.log('new url es ');
    await this.router.navigateByUrl(newUrl);
  }
  async convertImagesToBase64(htmlContent: string): Promise<string> {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;

    // Buscar todas las imágenes en el contenido HTML
    const imgs = div.getElementsByTagName('img');
    for (const img of imgs) {
      const src = img.src;
      if (src && src.startsWith('http')) {
        try {
          // Convertir la imagen a base64 y actualizar el src
          const base64Image = await this.getBase64Image(src);
          img.src = `data:image/png;base64,${base64Image}`;
        } catch (err) {
          console.error(`Error al convertir la imagen ${src} a base64:`, err);
        }
      }
    }

    return div.innerHTML;
  }
  getBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(
            canvas
              .toDataURL('image/png')
              .replace(/^data:image\/(png|jpg);base64,/, '')
          );
        } else {
          reject('No se pudo obtener el contexto del canvas');
        }
      };
      img.onerror = err => reject(err);
    });
  }
  ajustarTamanoImagenes(htmlContent: string): string {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;

    // Buscar todas las imágenes en el contenido HTML
    const imgs = div.getElementsByTagName('img');
    for (let img of imgs) {
      const width = img.width;
      const height = img.height;

      // Calcular la relación de aspecto
      const aspectRatio = width / height;

      // Ajustar la dimensión mayor a 200 px, manteniendo la proporción
      if (width > height) {
        img.width = 200;
        img.height = 200 / aspectRatio;
      } else {
        img.height = 200;
        img.width = 200 * aspectRatio;
      }

      // Asegurarse de que ninguna dimensión supere 200 px
      img.width = Math.min(img.width, 200);
      img.height = Math.min(img.height, 200);
    }

    return div.innerHTML;
  }
  async generatePDF() {
    this.pageLoading = true;
    let logoBase64 = '';
    try {
      logoBase64 = await this.getBase64Image('/assets/logo.png');
    } catch (err) {
      console.error('Error al cargar el logo:', err);
    }

    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    const planAccionRespuesta =
      await this.catalogoServiceDai.getPlanAccionPerNIE(this.nie);
    console.log('plan accion respuesta ---->', planAccionRespuesta);
    const htmlToPdfmake = (await import('html-to-pdfmake')).default;
    const docDefinition: TDocumentDefinitions = {
      content: [] as Content[],
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 10],
        },
        normal: {
          fontSize: 12,
          margin: [0, 0, 0, 20],
        },
      },
    };

    if (logoBase64) {
      (docDefinition.content as Content[]).push({
        image: `data:image/png;base64,${logoBase64}`,
        width: 100,
        alignment: 'left',
        margin: [0, 0, 0, 10], // Margen debajo del logo
      });
    }

    (docDefinition.content as Content[]).push({
      text: 'Plan de accion de estudiante',
      style: 'header',
    });

    planAccionRespuesta.respuestas.forEach(async(respuestaObj, index) => {
      (docDefinition.content as Content[]).push({
        text: respuestaObj.pregunta ?? '',
        style: 'subheader',
      });

      let htmlContent = this.ajustarTamanoImagenes(respuestaObj.respuesta);
      htmlContent = await this.convertImagesToBase64(htmlContent);

      const convertedHtml = htmlToPdfmake(htmlContent, {
        // @ts-ignore
        window: window as Window,
      });

      (docDefinition.content as Content[]).push({
        stack: [convertedHtml],
        margin: [0, 0, 0, 20],
      });

      if (index < planAccionRespuesta.respuestas.length - 1) {
        (docDefinition.content as Content[]).push({
          text: '',
          pageBreak: 'after',
        });
      }
    });

    pdfMake
      .createPdf(docDefinition)
      .download(`plan-accion-estudiante-${this.nie}.pdf`);
    this.pageLoading = false;
  }
  async update() {
    this.pageLoading = true;
    const objToSave: ISaveQuestionary = this.getQuestionaryObject();
    if (objToSave.respuestas.length === 0) {
      this.userMessage.showMessage = true;
      this.userMessage.type = MessageType.WARNING;
      this.userMessage.message =
        'Debes proveer al menos una respuesta para continuar';
      this.userMessage.titleMessage = 'Advertencia';
      return;
    }
    const updatePlanDeAccion: IUpdatePlanAccion = {
      id_plan_accion: this.idEvaluacion,
      respuestas: objToSave.respuestas,
    };
    console.log('----------- obj to UPDATE--------', updatePlanDeAccion);
    try {
      const resp = await this.catalogoServiceDai.updatePlanDeAccion(updatePlanDeAccion);
      console.log('saved ', resp);
      /*if (resp.plan_accion_pk === 0) {
        this.userMessage.showMessage = true;
        this.userMessage.type = MessageType.DANGER;
        this.userMessage.message = 'Ocurrio un error al guardar plan de accion';
        this.userMessage.titleMessage = 'Error';
        return;
      }*/
      //await this.router.navigate([this.baseUrl, this.nie, 'view']);
    } catch (e) {
      console.log('Error ---- ', e);
    } finally {
      this.pageLoading = false;
    }
  }
  async save() {
    this.pageLoading = true;
    const objToSave: ISaveQuestionary = this.getQuestionaryObject();
    if (objToSave.respuestas.length === 0) {
      this.userMessage.showMessage = true;
      this.userMessage.type = MessageType.WARNING;
      this.userMessage.message =
        'Debes proveer al menos una respuesta para continuar';
      this.userMessage.titleMessage = 'Advertencia';
      return;
    }
    const savePlanAccion: ISavePlanAccion = {
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_docente_apoyo: this.idPersona,
      respuestas: objToSave.respuestas,
    };
    console.log('----------- obj to save--------', savePlanAccion);
    try {
      const resp = await this.catalogoServiceDai.savePlanAccion(savePlanAccion);
      console.log('saved ', resp);
      if (resp.plan_accion_pk === 0) {
        this.userMessage.showMessage = true;
        this.userMessage.type = MessageType.DANGER;
        this.userMessage.message = 'Ocurrio un error al guardar plan de accion';
        this.userMessage.titleMessage = 'Error';
        return;
      }
      await this.router.navigate([this.baseUrl, this.nie, 'view']);
    } catch (e) {
      console.log('Error ---- ', e);
    } finally {
      this.pageLoading = false;
    }
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
  async salirEditMode() {
    console.log('saliendo de modo edicion ----------');
    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace('/edit', '/view');
    this.updateStoredValues(this.valuesKey);
    console.log('cor survey here ', this.corSurveys);
    await this.router.navigateByUrl(newUrl);
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
  salir() {
    this.confirmationService.confirm({
      message:
        'Al darle click en <b>Salir de edición sin guardar</b> perderá todo el progreso de edición realizado.',
      icon: 'pi pi-exclamation-triangle',
    });
  }
  acceptConfirmDialog() {
    this.confirmationService.close();
  }
  async rejectConfirmDialog() {
    await this.router.navigate([
      'dai/saet-caracterizacion-estudiante/',
      this.nie,
    ]);
  }
  idEvaluacion = 0;
  valuesKey = '';
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceDai: CatalogoServiceDai,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService
  ) {
    super(document, catalogoServiceDai, route, router);
    this.pageLoading = true;

    const _valuesKey = `${this.nie}_plan_accion_values`;
    this.valuesKey = _valuesKey;
    const storedValues = localStorage.getItem(_valuesKey);
    if (storedValues) {
      this.values = JSON.parse(storedValues);
    }

    const planAccionPromise = this.catalogoServiceDai.getPlanAccionQuestion();
    const idPersonaStr = localStorage.getItem('id_persona') ?? '0';
    this.idPersona = isNaN(parseInt(idPersonaStr, 10))
      ? 0
      : parseInt(idPersonaStr, 10);
    this.route.paramMap.subscribe(params => {
      this.corSurveys = [];
      const storedValues = localStorage.getItem(`plan-accion-${this.nie}`);
      if (storedValues) {
        this.values = JSON.parse(storedValues);
      }
      const nie = params.get('nie');
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
          router.navigate(['menu/dai/saet-datos-estudiante', this.nie]);
          break;
      }

      if (nie) {
        this.nie = nie;
        this.catalogoServiceDai
          .getPlanAccionPerNIE(this.nie)
          .then(resp => {
            console.log('plan de accion por nie -------> ', resp);
            this.idEvaluacion = resp.plan_accion_pk;
            if (this.formMode === FormMode.CREATE && resp.plan_accion_pk !== 0){
              this.router.navigate([this.baseUrl, this.nie, 'view']);
            }
          })
          .catch(e => {
            console.log('error plan de accion per nie ------', e);
          });

        Promise.all([planAccionPromise])
          .then(([planAccionResult]) => {
            this.corSurveys.push(...planAccionResult.cuestionarios);
          })
          .finally(() => {
            this.pageLoading = false;
            this.showActionButtons = true;
          });
      }
    });
  }

  onchangeQuestions(keyValue: KeyValue) {
    console.log('onchange ', keyValue);
    this.values[keyValue.key] = keyValue.value;
    localStorage.setItem(this.valuesKey, JSON.stringify(this.values));
  }
  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }
  getName(name: string): string {
    return this.convertString(name);
  }
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  formModeEnum = FormMode;
  getOptions(options: { id_opcion: number; opcion: string }[]): KeyValue[] {
    return options.map(
      option =>
        ({
          key: option.id_opcion ? option.id_opcion.toString() : '',
          value: option.opcion,
        }) as KeyValue
    );
  }

  protected readonly btnIcon = IconComponent;
}
