import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {BaseComponent} from "../../BaseComponent";
import {IMessageComponent, MessageType, UserMessage} from "../../interfaces/message-component.interface";
import {userMessageInit} from "../../shared/messages.model";
import {ButtonStyle, SaetButtonArgs} from "../../component/saet-button/saet-button.component";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-estudiante-informe-trimestral',
  templateUrl: './estudiante-informe-trimestral.component.html',
  styleUrls: ['./estudiante-informe-trimestral.component.css']
})
export class EstudianteInformeTrimestralComponent extends BaseComponent implements IMessageComponent{
  userMessage: UserMessage = userMessageInit;
  showTable = false;
  inputNIE: string = '';
  cnResult: number = 0;
  searchButton:SaetButtonArgs = {
    buttonStyle: ButtonStyle.BLUE,
    text: "Buscar"
  }


  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    private cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    router: Router
  ) {
    super(document, catalogoServiceCOR, route, router);
  }

  onInputChange(value: string) {
    this.inputNIE = value;
  }

  cleanInput() {
    this.inputNIE = ''
    this.userMessage.showMessage = false;
    this.showTable = false;
  }
  async toggleTable() {
    if (this.inputNIE) {
      try {
        const result = await this.catalogoServiceCOR.getStudentInfo(this.inputNIE);
        this.cnResult = 1;
        this.showTable = true;
      }
      catch (error) {
        this.userMessage = {
          showMessage: true,
          message: "Error al obtener la información del estudiante",
          type: MessageType.DANGER
        }
      }
    }
    else{
      this.userMessage = {
        showMessage: true,
        message: "Escribe el NIE para realizar busqueda",
        titleMessage: "",
        type: MessageType.WARNING
      }

      this.showTable = false;
    }
  }
}

