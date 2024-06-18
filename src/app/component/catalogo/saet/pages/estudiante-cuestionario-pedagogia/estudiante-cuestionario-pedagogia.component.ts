import {Component, Inject} from '@angular/core';
import {QuestionsComponent} from "../../QuestionsComponent";
import {IMessageComponent, MessageType, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-estudiante-cuestionario-pedagogia',
  templateUrl: './estudiante-cuestionario-pedagogia.component.html',
  styleUrls: ['./estudiante-cuestionario-pedagogia.component.css']
})
export class EstudianteCuestionarioPedagogiaComponent extends QuestionsComponent implements IMessageComponent{
  userMessage: UserMessage = {
    showMessage: false,
    message: '',
    titleMessage: '',
    type: MessageType.SUCCESS
  }
  editMode:boolean = false;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ){
    super(document, catalogoServiceCOR, route, router,confirmationService,"pedagogia_values");
    catalogoServiceCOR.getLenguajeHablaQuestions().then((result) => {
      this.corSurveys.push(...result.cuestionarios);
    });
  }
}
