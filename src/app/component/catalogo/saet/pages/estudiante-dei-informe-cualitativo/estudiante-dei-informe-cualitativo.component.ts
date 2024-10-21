import { Component, Inject } from '@angular/core';
import { DeiBaseComponent } from '../../DeiBaseComponent';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';
import {
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ResponseError,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-estudiante-dei-informe-cualitativo',
  templateUrl: './estudiante-dei-informe-cualitativo.component.html',
  styleUrls: ['./estudiante-dei-informe-cualitativo.component.css'],
})
export class EstudianteDeiInformeCualitativoComponent extends DeiBaseComponent {
  protected readonly ButtonStyle = ButtonStyle;
  protected readonly IconCompoment = IconComponent;

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

  async btnRegresar() {
    await this.router.navigate(['menu/saet-buscar', this.nie]);
  }
  async generateReport(nie: string) {
    const doc = new jsPDF();
    const currentY = 30;

    const title = 'Informe cualitativo COR';
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

    doc.text(title, titleX, currentY);
    //currentY += 10; // Espacio debajo del título principal
    //let pageNumber = 0;
    doc.save(`informe-cualitativo-cor.pdf`);
  }

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected catalogoServiceCOR: CatalogoServiceCor,
    private route: ActivatedRoute,
    protected override router: Router
  ) {
    super(router);
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
        this.inputNIE = nie;
        this.toggleTable();
      }
    });
  }

  onInputChange(keyValue: KeyValue) {
    this.inputNIE = keyValue.value;
  }
  async toggleTable() {
    this.userMessage.showMessage = false;
    this.pageLoading = true;
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

      this.pageLoading = false;
    }
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
