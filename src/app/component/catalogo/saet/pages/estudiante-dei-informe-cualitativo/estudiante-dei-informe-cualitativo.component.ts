import { Component, Inject } from '@angular/core';
import { DeiBaseComponent } from '../../DeiBaseComponent';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';
import { MessageType } from '../../interfaces/message-component.interface';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ResponseError,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CatalogoServiceDai } from '../../../../../services/catalogo/catalogo.service.dai';

@Component({
  selector: 'app-estudiante-dei-informe-cualitativo',
  templateUrl: './estudiante-dei-informe-cualitativo.component.html',
  styleUrls: ['./estudiante-dei-informe-cualitativo.component.css'],
})
export class EstudianteDeiInformeCualitativoComponent extends DeiBaseComponent {
  protected readonly ButtonStyle = ButtonStyle;
  protected readonly IconCompoment = IconComponent;
  atendidoCOR = false;
  atendidoDAI = false;
  inputNIE = '';
  cnResult = 0;
  showTable = false;
  student: {
    Nie: string;
    Nui: string;
    nombreCompleto: string;
    centroEducativo: string;
  } = {
    Nie: '',
    Nui: '',
    centroEducativo: '',
    nombreCompleto: '',
  };
  breadcrumb = [
    { href: '#/menu/saet-inicio', text: 'Inicio' },
  ]
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
  async generateDAIPDF(nie:string){
    this.pageLoading = true;
    let logoBase64 = '';
    try {
      logoBase64 = await this.getBase64Image('/assets/logo.png');
    } catch (err) {
      console.error('Error al cargar el logo:', err);
    }

    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    const planAccionRespuesta = await this.catalogoServiceDai.getPlanAccionPerNIE(nie);
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
      footer: (currentPage: number, pageCount: number) => {
        return {
          columns: [
            {
              text: `Página ${currentPage} de ${pageCount}`,
              alignment: 'center',
              fontSize: 10,
              margin: [0, 0, 0, 20],
            }
          ]
        };
      }
    };

    // Título del documento
    (docDefinition.content as Content[]).push({
      text: 'Plan de accion de estudiante',
      style: 'header',
    });
    (docDefinition.content as Content[]).push({
      text: '',
      margin: [0, 10, 0, 10],
    });
    (docDefinition.content as Content[]).push({
      text: `${this.studentInfo?.nombreCompleto} | ${this.nie}`,
      style: 'header',
      fontSize: 12
    });

    // Iterar por las preguntas y respuestas intercaladas
    for (let index = 0; index < planAccionRespuesta.respuestas.length; index++) {
      const respuestaObj = planAccionRespuesta.respuestas[index];

      // Agregar la pregunta
      (docDefinition.content as Content[]).push({
        text: respuestaObj.pregunta ?? '',
        style: 'subheader',
      });

      // Ajustar las imágenes en la respuesta y convertirlas a base64
      let htmlContent = this.ajustarTamanoImagenes(respuestaObj.respuesta);
      htmlContent = await this.convertImagesToBase64(htmlContent);

      // Convertir el HTML a un contenido compatible con PDF
      const convertedHtml = htmlToPdfmake(htmlContent, {
        // @ts-ignore
        window: window as Window,
      });

      // Agregar la respuesta
      (docDefinition.content as Content[]).push({
        stack: [convertedHtml],
        margin: [0, 0, 0, 20],
      });

      // Insertar un salto de página después de cada par pregunta-respuesta
      if (index < planAccionRespuesta.respuestas.length - 1) {
        (docDefinition.content as Content[]).push({
          text: '',
          pageBreak: 'after',
        });
      }
    }

    // Crear y descargar el PDF
    pdfMake
      .createPdf(docDefinition)
      .download(`plan-accion-estudiante-${this.nie}.pdf`);

    this.pageLoading = false;
  }
  async generateCORPDF(nie:string) {
    this.pageLoading = true;
    let logoBase64 = '';
    try {
      logoBase64 = await this.getBase64Image('/assets/logo.png');
    } catch (err) {
      console.error('Error al cargar el logo:', err);
    }

    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    const paeiRespuestas = await this.catalogoServiceCOR.getPAEIPerNIE(
      nie
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
  // async generateReport(nie: string) {
  //   if(!this.atendidoCOR){
  //     return;
  //   }
  //   const doc = new jsPDF();
  //   const currentY = 30;
  //
  //   const title = 'Informe cualitativo COR';
  //   const titleWidth = doc.getTextWidth(title);
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   //const pageHeight = doc.internal.pageSize.getHeight();
  //   const titleX = (pageWidth - titleWidth) / 2;
  //
  //   const logoPath = '/assets/logo.png'; // Cambia esto a la ruta de tu archivo de logo
  //
  //   const loadImage = (url: string): Promise<HTMLImageElement> => {
  //     return new Promise((resolve, reject) => {
  //       const img = new Image();
  //       img.src = url;
  //       img.onload = () => resolve(img);
  //       img.onerror = err => reject(err);
  //     });
  //   };
  //
  //   const logo = await loadImage(logoPath);
  //
  //   doc.text(title, titleX, currentY);
  //   //currentY += 10; // Espacio debajo del título principal
  //   //let pageNumber = 0;
  //   doc.save(`informe-cualitativo-cor.pdf`);
  // }

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected catalogoServiceCOR: CatalogoServiceCor,
    protected catalogoServiceDai: CatalogoServiceDai,
    private route: ActivatedRoute,
    protected override router: Router
  ) {
    super(router);
    this.userMessage.showMessage = false;
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
        this.inputNIE = nie;
        this.toggleTable().then(() => {

        });
      }
    });
    console.log('finished ');

  }

  onInputChange(keyValue: KeyValue) {
    this.inputNIE = keyValue.value;
  }
  async toggleTable() {
    this.userMessage.showMessage = false;
    if(this.inputNIE === ''){
      this.userMessage.showMessage = true;
      this.userMessage.message = "Debes especificar un nie para continuar";
      this.userMessage.titleMessage = "Advertencia";
      this.userMessage.type = MessageType.WARNING;
      return;
    }
    this.pageLoading = true;
    console.log('here 1 ',this.inputNIE);

    // veriificar atendido COR
    try{
      const resp = await this.catalogoServiceCOR
        .getPAEIPerNIE(this.inputNIE);
      if(resp.id_paei !== 0){
        this.atendidoCOR = true;
      }
    }catch (e){
      this.atendidoCOR = false;
    }

    // verificar atendido DAI
    try{
      const resp = await this.catalogoServiceDai.getPlanAccionPerNIE(this.nie);
      if (resp.plan_accion_pk !== 0) {
        this.atendidoDAI = true;
      }
    }catch (e){
      this.atendidoDAI = false;
    }

    // this.atendidoCOR = true;
    if (this.inputNIE) {
      try {
        const result = await this.catalogoServiceCOR.getStudentInfo(
          this.inputNIE
        );
        console.log('result here ', result);
        this.student.Nie = result.estudiante.nie;
        this.student.Nui = result.estudiante.nui;
        this.student.centroEducativo = result.centroEducativo.nombre;
        this.student.nombreCompleto = result.estudiante.nombreCompleto;
        this.cnResult = 1;
        this.userMessage = {
          showMessage: false,
          message: '',
          titleMessage: '',
          type: MessageType.SUCCESS,
        };
        this.showTable = true;
      } catch (e) {
        const error = e as ResponseError;
        if (error.status === 401) {
          console.log('back to login', error.message);
        }

        this.userMessage = {
          showMessage: true,
          message: error.message,
          type: MessageType.DANGER,
        };

        this.showTable = false;
      }
    }
    this.pageLoading = false;
  }
  cleanInput() {
    this.inputNIE = '';
    this.userMessage.showMessage = false;
    this.showTable = false;
  }

  onTabChange(event: { index: number }) {
    const index = event.index;
    console.log('index ', index);
    if (index === 1) {
      this.redirectTo('menu/dei/informe-cuantitativo');
    }
    if (index === 2) {
      this.redirectTo('menu/dei/informe-trimestral');
    }
  }
}
