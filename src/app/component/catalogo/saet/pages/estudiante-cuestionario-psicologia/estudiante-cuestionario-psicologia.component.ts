import {Component, Inject} from '@angular/core';
import {QuestionsComponent} from "../../QuestionsComponent";
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {userMessageInit} from "../../shared/messages.model";

@Component({
  selector: 'app-estudiante-cuestionario-psicologia',
  templateUrl: './estudiante-cuestionario-psicologia.component.html',
  styleUrls: ['./estudiante-cuestionario-psicologia.component.css']
})
export class EstudianteCuestionarioPsicologiaComponent extends QuestionsComponent implements IMessageComponent {
  userMessage: UserMessage = userMessageInit;

  editMode:boolean = false;

  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router
  ){

    super(document, catalogoServiceCOR, route, router, "psicologia_values");


    catalogoServiceCOR.getPsicologiaQuestions().then((result) => {
      this.corSurveys.push(...result.cuestionarios);
      console.log('cor surveys ', this.corSurveys);
    });


  }

  message: string = "";
  showMessage: boolean = false;
  titleMessage: string = "";
}
