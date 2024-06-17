import {Component, Inject} from '@angular/core';
import {IMessageComponent, MessageType, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {QuestionsComponent} from "../../QuestionsComponent";

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

  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
  ){
    super(document, catalogoServiceCOR, route, router, "lenguaje_values");
    catalogoServiceCOR.getLenguajeHablaQuestions().then((result) => {
      this.corSurveys.push(...result.cuestionarios);
    });
  }

}
