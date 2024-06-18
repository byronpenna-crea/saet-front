import {Component, Inject} from '@angular/core';
import {IMessageComponent, MessageType, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {QuestionsComponent} from "../../QuestionsComponent";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-estudiante-cuestionario-lenguaje',
  templateUrl: './estudiante-cuestionario-lenguaje.component.html',
  styleUrls: ['./estudiante-cuestionario-lenguaje.component.css']
})
export class EstudianteCuestionarioLenguajeComponent extends QuestionsComponent implements IMessageComponent{
  userMessage: UserMessage = {
    showMessage: false,
    message: '',
    titleMessage: '',
    type: MessageType.SUCCESS
  }
  cuestionariosTableMode: number[] = [];
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ){
    super(document, catalogoServiceCOR, route, router, confirmationService,"lenguaje_values");
    catalogoServiceCOR.getLenguajeHablaQuestions().then((result) => {
      this.corSurveys.push(...result.cuestionarios);
    });
  }

}
