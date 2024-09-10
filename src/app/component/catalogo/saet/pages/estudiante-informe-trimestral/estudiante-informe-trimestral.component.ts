import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { BaseComponent } from '../../BaseComponent';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import {
  ButtonStyle,
  SaetButtonArgs,
} from '../../component/saet-button/saet-button.component';
import { DOCUMENT } from '@angular/common';
import { CatalogoServiceCor } from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { IconComponent } from '../../shared/component.config';

@Component({
  selector: 'app-estudiante-informe-trimestral',
  templateUrl: './estudiante-informe-trimestral.component.html',
  styleUrls: ['./estudiante-informe-trimestral.component.css'],
})
export class EstudianteInformeTrimestralComponent
  extends BaseComponent
  implements IMessageComponent
{
  userMessage: UserMessage = userMessageInit;
  showTable = false;
  inputNIE = '';
  cnResult = 0;
  searchButton: SaetButtonArgs = {
    buttonStyle: ButtonStyle.BLUE,
    text: 'Buscar',
  };
  pageLoading = false;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    private cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    router: Router
  ) {
    super(document, catalogoServiceCOR, route, router);
    const storedValues = localStorage.getItem('values');
    try {
      this.inputNIE = this.nie;
      if (this.nie) {
        this.toggleTable();
      }
      console.log('input nie ', this.inputNIE);
    } catch (e) {
      console.log('error en constructor', e);
    }
  }
  async salir() {}
  async guardar() {}
  btnIcon = IconComponent;
  onInputChange(keyValue: KeyValue) {
    this.inputNIE = keyValue.value;
  }

  cleanInput() {
    this.inputNIE = '';
    this.userMessage.showMessage = false;
    this.showTable = false;
  }
  async toggleTable() {
    if (this.inputNIE) {
      try {
        this.pageLoading = true;
        const result = await this.catalogoServiceCOR.getStudentInfo(
          this.inputNIE
        );
        this.cnResult = 1;
        this.showTable = true;
      } catch (error) {
        this.userMessage = {
          showMessage: true,
          message: 'Error al obtener la información del estudiante',
          type: MessageType.DANGER,
        };
      } finally {
        this.pageLoading = false;
      }
    } else {
      this.userMessage = {
        showMessage: true,
        message: 'Escribe el NIE para realizar busqueda',
        titleMessage: '',
        type: MessageType.WARNING,
      };

      this.showTable = false;
    }
  }
}
