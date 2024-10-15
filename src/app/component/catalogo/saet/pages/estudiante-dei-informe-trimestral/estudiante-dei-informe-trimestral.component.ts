import {Component, Inject} from '@angular/core';
import {ButtonStyle} from "../../component/saet-button/saet-button.component";
import {KeyValue} from "../../component/saet-input/saet-input.component";
import {IconComponent} from "../../shared/component.config";
import {MessageType, UserMessage} from "../../interfaces/message-component.interface";
import {userMessageInit} from "../../shared/messages.model";
import {DeiBaseComponent} from "../../DeiBaseComponent";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, ResponseError} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import jsPDF from "jspdf";

@Component({
  selector: 'app-estudiante-dei-informe-trimestral',
  templateUrl: './estudiante-dei-informe-trimestral.component.html',
  styleUrls: ['./estudiante-dei-informe-trimestral.component.css'],
})
export class EstudianteDeiInformeTrimestralComponent extends DeiBaseComponent {
  protected readonly ButtonStyle = ButtonStyle;
  protected readonly IconCompoment = IconComponent;
  userMessage: UserMessage = userMessageInit;

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected catalogoServiceCOR: CatalogoServiceCor,
    protected override router: Router
  ) {
    super(router);
  }

  inputNIE = '';
  showTable = false;
  cnResult = 0;
  pageLoading = false;
  onInputChange(keyValue: KeyValue) {
    this.inputNIE = keyValue.value;
  }
  async generateReport(nie: string) {
    const doc = new jsPDF();
    //let currentY = 30;

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
        img.onerror = (err) => reject(err);
      });
    };

    const logo = await loadImage(logoPath);
    console.log('logo ', logo)
    //doc.text(title, titleX, currentY);
    //currentY += 10; // Espacio debajo del título principal
    //let pageNumber = 0;
    doc.save(`informe-trimestral-cor.pdf`);
  }
  async toggleTable() {
    this.userMessage.showMessage = false;
    this.pageLoading = true;

    if (this.inputNIE) {
      try {
        const result = await this.catalogoServiceCOR.getStudentInfo(
          this.inputNIE
        );
        result.estudiante.nombreCompleto
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
        if(error.status === 401){
          console.log('back to login', error.message);
        }

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
