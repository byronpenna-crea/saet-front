import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  IMessageComponent,
  MessageType,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
// @ts-ignore
import * as htmlToPdfmake from 'html-to-pdfmake';
import {
  CatalogoServiceCor,
  IEvaluacionResponse,
  iPaeiSave,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IQuestionaryAnswer,
  QuestionsComponent,
} from '../../QuestionsComponent';
import { ConfirmationService } from 'primeng/api';
import { IconComponent } from '../../shared/component.config';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { SAET_MODULE } from '../../shared/evaluaciones';

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

  @ViewChild('bottomAnchor') override bottomAnchor!: ElementRef<HTMLDivElement>;
  @ViewChild('topAnchor') override topAnchor!: ElementRef<HTMLDivElement>;

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

    const rolApoyo:SAET_MODULE | undefined = this.getRolApoyo();

    if (rolApoyo === undefined || rolApoyo != SAET_MODULE.COR) {
      this.router.navigate(['menu/saet-buscar', this.nie]);
    }

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

            const obj: IEvaluacionResponse = {
              respuestas: response.respuestas,
              id_evaluacion: response.id_paei,
              especialista_responsable: '',
              dui_especialista: ''
            };
            console.log('depurado --> ', this.responseToValues(obj));
            const respuestasDb = this.responseToValues(obj);
            this.storedValues = {
              ...respuestasDb
            }
            console.log('stored values ', this.storedValues);
            this.values = {
              ...respuestasDb,
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

  calcularEdad(fechaNacimiento: string) {
    if (fechaNacimiento === '') {
      return 0;
    }
    try {
      const [dia, mes, anio] = fechaNacimiento
        .split('-')
        .map(num => parseInt(num, 10));
      const fechaNac = new Date(anio, mes - 1, dia);
      const fechaActual = new Date();
      let edad = fechaActual.getFullYear() - fechaNac.getFullYear();
      const cumpleanosEsteAnio = new Date(
        fechaActual.getFullYear(),
        fechaNac.getMonth(),
        fechaNac.getDate()
      );
      if (fechaActual < cumpleanosEsteAnio) {
        edad--;
      }
      return edad;
    } catch (e) {
      return 0;
    }
  }

  getBasicInfoPdfTable(): Content {
    return {
      table: {
        headerRows: 1, // Número de filas de encabezado
        widths: [
          '10%',
          '10%',
          '10%',
          '10%',
          '10%',
          '10%',
          '10%',
          '10%',
          '10%',
          '10%',
        ],
        body: [
          [
            {
              text: 'Nombre del estudiante',
              fontSize: 10,
              alignment: 'left',
              colSpan: 3,
            },
            {},
            {},
            {
              text: this.studentInfo?.nombreCompleto,
              fontSize: 9,
              alignment: 'left',
              colSpan: 4,
            },
            {},
            {},
            {},
            { text: 'Nº expediente', style: 'tableHeader', colSpan: 2 },
            {},
            { text: '12', alignment: 'left' },
          ],
          [
            { text: 'Edad:', fontSize: 10, alignment: 'left', colSpan: 2 },
            {},
            {
              text: this.calcularEdad(this.studentInfo?.fechaNacimiento ?? ''),
              fontSize: 10,
              alignment: 'left',
            },
            { text: 'Grado:', fontSize: 9, alignment: 'left', colSpan: 2 },
            {},
            { text: '', fontSize: 9, alignment: 'left' },
            { text: 'NIE:', fontSize: 9, alignment: 'left' },
            {
              text: this.studentInfo?.nie,
              fontSize: 9,
              alignment: 'left',
              colSpan: 3,
            },
            {},
            {},
          ],
          [
            {
              text: 'Centro educativo de procedencia:',
              fontSize: 10,
              alignment: 'left',
              colSpan: 4,
            },
            {},
            {},
            {},
            { text: '', fontSize: 9, alignment: 'left', colSpan: 6 },
            {},
            {},
            {},
            {},
            {},
          ],
          [
            {
              text: 'Nombre del (a) docente del grado:',
              fontSize: 10,
              alignment: 'left',
              colSpan: 4,
            },
            {},
            {},
            {},
            { text: '', fontSize: 9, alignment: 'left', colSpan: 6 },
            {},
            {},
            {},
            {},
            {},
          ],
          [
            {
              text: 'Nombre del docente de Apoyo a la Inclusión (si existe en el centro educativo):',
              fontSize: 10,
              alignment: 'left',
              colSpan: 4,
            },
            {},
            {},
            {},
            {
              text: '',
              fontSize: 9,
              alignment: 'left',
              verticalAlignment: 'middle',
              colSpan: 6,
            },
            {},
            {},
            {},
            {},
            {},
          ],
          [
            {
              text: 'Familiar responsable:',
              fontSize: 10,
              alignment: 'left',
              colSpan: 4,
            },
            {},
            {},
            {},
            {
              text: '',
              fontSize: 9,
              alignment: 'left',
              verticalAlignment: 'middle',
              colSpan: 6,
            },
            {},
            {},
            {},
            {},
            {},
          ],
          [
            {
              text: 'Fecha de entrega:',
              fontSize: 10,
              alignment: 'left',
              colSpan: 4,
            },
            {},
            {},
            {},
            {
              text: '',
              fontSize: 9,
              alignment: 'left',
              verticalAlignment: 'middle',
              colSpan: 6,
            },
            {},
            {},
            {},
            {},
            {},
          ],
        ],
      },
      layout: {
        defaultBorder: true, // Asegura que haya bordes en la tabla
      },
      margin: [0, 0, 0, 20], // Margen alrededor de la tabla
    };
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
    const paeiRespuestas = await this.catalogoServiceCOR.getPAEIPerNIE(
      this.nie
    );

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
      text: [
        'CENTROS DE ORIENTACIÓN Y RECURSOS (COR)\n',
        'PLAN DE ATENCIÓN EDUCATIVO INTEGRAL (PAEI)',
      ],
      style: 'subheader',
      alignment: 'center',
      lineHeight: 1.1,
      margin: [0, 5, 0, 10],
    });

    (docDefinition.content as Content[]).push({
      text: 'El presente Plan de Atención Educativo Integral (PAEI), elaborado por el equipo responsable del Centro de Orientación y Recursos (COR), como resultado del proceso de evaluación psicopedagógica contiene orientaciones pedagógicas para el centro educativo, docentes, madres, padres o responsables de familia. El objetivo principal es contribuir a una educación de calidad con equidad, garantizando el acceso, participación, aprendizaje y permanencia del estudiantado en el sistema educativo. Por tal razón el contenido de este documento es exclusivo para los centros educativos y familias que solicitan el servicio del COR.',
      alignment: 'justify',
      fontSize: 12,
      margin: [0, 10, 0, 20], // Margen alrededor del texto
    });

    (docDefinition.content as Content[]).push(this.getBasicInfoPdfTable());

    (docDefinition.content as Content[]).push({
      text: 'I. DATOS GENERALES DEL ESTUDIANTE.',
      style: 'subheader',
      fontSize: 12,
      margin: [0, 10, 0, 20], // Margen alrededor del texto
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

    (docDefinition.content as Content[]).push({
      text: 'Equipo responsable del COR:',
      fontSize: 12,
      bold: true,
      margin: [0, 20, 0, 30],
    });

    (docDefinition.content as Content[]).push({
      columns: [
        {
          stack: [
            {
              canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 1 },
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: 'COORDINACIÓN',
              alignment: 'center',
              margin: [0, 0, 0, 20],
            },
          ],
          width: '50%',
        },
        {
          stack: [
            {
              canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 1 },
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: 'ÁREA DE PSICOLOGÍA',
              alignment: 'center',
              margin: [0, 0, 0, 20],
            },
          ],
          width: '50%',
        },
      ],
      columnGap: 10, // Espacio entre columnas
      margin: [0, 20, 0, 0], // Margen superior
    });

    (docDefinition.content as Content[]).push({
      columns: [
        {
          stack: [
            {
              canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 1 },
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: 'ÁREA DE PEDAGOGÍA',
              alignment: 'center',
              margin: [0, 0, 0, 20],
            },
          ],
          width: '50%',
        },
        {
          stack: [
            {
              canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 1 },
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: 'ÁREA DE HABLA Y LENGUAJE',
              alignment: 'center',
              margin: [0, 0, 0, 20],
            },
          ],
          width: '50%',
        },
      ],
      columnGap: 10,
      margin: [0, 20, 0, 0],
    });

    /*
    *

    * */

    pdfMake
      .createPdf(docDefinition)
      .download(`paei-estudiante-${this.nie}.pdf`);
    this.pageLoading = false;
  }
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
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
  async save() {
    this.pageLoading = true;
    this.userMessage.showMessage = false;

    console.log('values on save -->',this.values);
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
      if (resp.id_paei === 0) {
        this.userMessage = {
          showMessage: true,
          message: 'Ocurrio un error guardando el paei',
          titleMessage: 'Advertencia',
          type: MessageType.SUCCESS,
        };
        return;
      }
      this.userMessage = {
        showMessage: true,
        message: '¡Los datos han sido guardados exitosamente!',
        titleMessage: 'Datos guardados',
        type: MessageType.SUCCESS,
      };
      const paei = await this.catalogoServiceCOR
        .getPAEIPerNIE(this.nie);
      const obj: IEvaluacionResponse = {
        respuestas: paei.respuestas,
        id_evaluacion: paei.id_paei,
        especialista_responsable: '',
        dui_especialista: ''
      };
      const respuestasDb = this.responseToValues(obj);
      this.storedValues = {
        ...respuestasDb
      }
      this.paeiId = paei.id_paei;
    } catch (e) {
      console.log('error ---- ', e);
    }
    this.pageLoading = false;
  }
}
