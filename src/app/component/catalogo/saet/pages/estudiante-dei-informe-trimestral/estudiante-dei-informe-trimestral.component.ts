import { Component, Inject } from '@angular/core';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { IconComponent } from '../../shared/component.config';
import {
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { DeiBaseComponent } from '../../DeiBaseComponent';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ResponseError,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { CatalogoServiceDei } from '../../../../../services/catalogo/catalogo.service.dei';
import { CatalogoServiceQuarterReport } from '../../../../../services/catalogo/catalogo.service.quater_report';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';

import * as pdfFonts from 'pdfmake/build/vfs_fonts';
@Component({
  selector: 'app-estudiante-dei-informe-trimestral',
  templateUrl: './estudiante-dei-informe-trimestral.component.html',
  styleUrls: ['./estudiante-dei-informe-trimestral.component.css'],
})
export class EstudianteDeiInformeTrimestralComponent extends DeiBaseComponent {
  protected readonly ButtonStyle = ButtonStyle;
  protected readonly IconCompoment = IconComponent;

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected catalogoServiceDei: CatalogoServiceDei,
    private route: ActivatedRoute,
    protected override router: Router,
    private catalogoServiceQuarterReport: CatalogoServiceQuarterReport,
  ) {
    super(router);

    this.route.paramMap.subscribe(params => {
      const dui = params.get('dui');
      if (dui) {
        this.inputDui = dui;
        this.toggleTable();
      }
    });
  }
  persona: {
    dui: string;
    nombreCompleto: string;
  } = {
    dui: '',
    nombreCompleto: '',
  };

  inputDui = '';
  inputNIE = '';
  showTable = false;
  cnResult = 0;
  onInputChange(keyValue: KeyValue) {
    this.inputNIE = keyValue.value;
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

  async generateReport(nie: string) {
    /*const doc = new jsPDF();
    const currentY = 30;

    const title = 'Informe trimestral COR';
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    //const pageHeight = doc.internal.pageSize.getHeight();
    const titleX = (pageWidth - titleWidth) / 2;

    const logoPath = '/assets/logo.png'; // Cambia esto a la ruta de tu archivo de logo

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
    doc.text(title, titleX, currentY);*/
    this.pageLoading = true;
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
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    const htmlToPdfmake = (await import('html-to-pdfmake')).default;
    let logoBase64 = '';
    try {
      logoBase64 = await this.getBase64Image('/assets/logo.png');
    } catch (err) {
      console.error('Error al cargar el logo:', err);
    }
    if (logoBase64) {
      (docDefinition.content as Content[]).push({
        image: `data:image/png;base64,${logoBase64}`,
        width: 100,
        alignment: 'left',
        margin: [0, 0, 0, 10], // Margen debajo del logo
      });
    }
    const respuestas = await this.catalogoServiceQuarterReport.getAnswers(2025,2);
    respuestas && respuestas.respuestas.forEach((respuestaObj, index) => {
      console.log('respuestaObj --------- #########', respuestaObj);
      const respuesta = respuestaObj.respuesta ?? '';

      if(respuesta !== ''){
        // Agregar la pregunta como subheader
        (docDefinition.content as Content[]).push({
          text: respuestaObj.pregunta ?? '',
          style: 'subheader',
        });

        // Ajustar las dimensiones de las imágenes en el contenido HTML
        const htmlContent = this.ajustarTamanoImagenes(respuesta);
        console.log('html content', htmlContent);

        // Convertir el contenido HTML a formato pdfMake
        const convertedHtml = htmlToPdfmake(htmlContent, {
          // @ts-ignore
          window: window as Window,
        });

        (docDefinition.content as Content[]).push({
          stack: [convertedHtml],
          margin: [0, 0, 0, 20],
        });
      }
    });
    //currentY += 10; // Espacio debajo del título principal
    //let pageNumber = 0;
    //doc.save(`informe-trimestral-cor.pdf`);
    console.log('here ', docDefinition);

    pdfMake
      .createPdf(docDefinition)
      .download(`informe-trimestral-cor.pdf`);
    this.pageLoading = false;
  }
  async toggleTable() {
    this.userMessage.showMessage = false;
    this.pageLoading = true;
    console.log('toggle trimestral ', this.inputDui);
    try {
      const result = await this.catalogoServiceDei.getPersonaApoyoByDui(
        '050350968'
      );
      console.log('result here ', result);
      this.persona.dui = result.dui;
      this.persona.nombreCompleto = result.nombre_completo;
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
    }
    this.pageLoading = false;
  }
  cleanInput() {
    this.inputNIE = '';
    this.userMessage.showMessage = false;
    this.showTable = false;
  }
  onTabChange(event: any) {
    const index = event.index;
    console.log('index ', index);
    if (index === 0) {
      this.redirectTo('menu/dei/informe-cualitativo');
    }
    if (index === 1) {
      this.redirectTo('menu/dei/informe-cuantitativo');
    }
  }
}
