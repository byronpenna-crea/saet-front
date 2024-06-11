import {Component, Inject} from '@angular/core';
import {QuestionsComponent} from "../../QuestionsComponent";
import {IMessageComponent, MessageType, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";

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

  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router
  ){
    super(document, catalogoServiceCOR, route, router);
    catalogoServiceCOR.getLenguajeHablaQuestions().then((result) => {
      this.corSurveys.push(...result.cuestionarios);
    });
  }
}
