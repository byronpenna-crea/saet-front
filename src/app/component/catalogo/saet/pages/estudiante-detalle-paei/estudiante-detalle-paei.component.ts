import { Component, Inject } from '@angular/core';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
// @ts-ignore
import * as htmlToPdfmake from 'html-to-pdfmake';
import {
  CatalogoServiceCor, IEvaluacionResponse,
  iPaeiSave,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { userMessageInit } from '../../shared/messages.model';
import {
  IQuestionaryAnswer,
  QuestionsComponent,
} from '../../QuestionsComponent';
import { ConfirmationService } from 'primeng/api';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import jsPDF from 'jspdf';
import { iQuestion } from '../../shared/survey';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from 'pdfmake/build/pdfmake';
@Component({
  selector: 'app-estudiante-detalle-paei',
  templateUrl: './estudiante-detalle-paei.component.html',
  styleUrls: ['./estudiante-detalle-paei.component.css'],
})
export class EstudianteDetallePaeiComponent
  extends QuestionsComponent
  implements IMessageComponent
{
  cuestionariosTableMode: number[] = [];
  btnIcon = IconComponent;
  loadingMessage?: string = undefined;
  paeiId = 0;
  idPersona = 0;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ) {
    const especialidadTarget = 'paei';
    super(
      document,
      catalogoServiceCOR,
      route,
      router,
      confirmationService,
      especialidadTarget
    );
    this.showActionButtons = true;
    this.pageLoading = true;
    const idPersonaStr = localStorage.getItem('id_persona') ?? '0';
    this.idPersona = isNaN(parseInt(idPersonaStr, 10))
      ? 0
      : parseInt(idPersonaStr, 10);
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
        this.catalogoServiceCOR
          .getPAEIPerNIE(this.nie)
          .then(response => {
            console.log('paei per nie ---> ', response);
            this.paeiId = response.id_paei;
            this.handleMode(
              response.id_paei,
              'menu/saet-paei-detalle',
              this.formMode
            );

            const obj:IEvaluacionResponse = {
              respuestas: response.respuestas,
              id_evaluacion: response.id_paei,
              especialista_responsable: ''
            }
            console.log('depurado --> ', this.responseToValues(obj));
            this.values = {
              ...this.responseToValues(obj),
              ...this.values,
            };

          })
          .catch(ex => {
            console.log('ex ---- ', ex);
          });
      }
    });
    this.catalogoServiceCOR.getPAEIQuestions().then(result => {
      this.corSurveys.push(...result.cuestionarios);
      this.pageLoading = false;
    });
  }

  getBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Permitir carga de imágenes de diferentes orígenes
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
    const paeiRespuestas = await this.catalogoServiceCOR.getPAEIPerNIE(this.nie);
    console.log('paei respuestas ', paeiRespuestas);

    // Importar html-to-pdfmake dinámicamente
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
      text: 'PAEI de estudiante',
      style: 'header',
    });

    // Procesar las respuestas para incluir contenido HTML
    paeiRespuestas.respuestas.forEach((respuestaObj, index) => {
      console.log('respuestaObj --------- #########', respuestaObj);

      // Agregar la pregunta como subheader
      (docDefinition.content as Content[]).push({
        text: respuestaObj.pregunta ?? '',
        style: 'subheader',
      });

      // Ajustar las dimensiones de las imágenes en el contenido HTML
      const htmlContent = this.ajustarTamanoImagenes(respuestaObj.respuesta);

      // Convertir el contenido HTML a formato pdfMake
      const convertedHtml = htmlToPdfmake(htmlContent, {
        // @ts-ignore
        window: window as Window,
      });

      // Agregar el contenido HTML convertido al documento
      (docDefinition.content as Content[]).push({
        stack: [convertedHtml],
        margin: [0, 0, 0, 20],
      });

      if (index < paeiRespuestas.respuestas.length - 1) {
        (docDefinition.content as Content[]).push({
          text: '',
          pageBreak: 'after',
        });
      }
    });

    pdfMake.createPdf(docDefinition).download(`paei-estudiante-${this.nie}.pdf`);
    this.pageLoading = false;
  }
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  async save() {
    this.pageLoading = true;
    const respuestas: IQuestionaryAnswer[] = this.getAnswerObject(this.values);
    const objToSave: iPaeiSave = {
      id_paei: this.paeiId,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_estado: 1,
      nie: parseInt(this.nie),
      id_especialista: this.idPersona,
      id_coordinador: 3,
      respuestas: respuestas,
    };
    console.log('obj to save', objToSave);
    try {
      const resp = await this.catalogoServiceCOR.savePAEI(objToSave);
      console.log('saved ', resp);
      this.userMessage.titleMessage = '';
      this.userMessage.message = '';
      this.userMessage.type = MessageType.SUCCESS;
    } catch (e) {
      console.log('error ---- ', e);
    }
    this.pageLoading = false;
  }
}
