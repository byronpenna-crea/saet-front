import {Component, Inject} from '@angular/core';
import {IMessageComponent} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {QuestionType} from "../../shared/component.config";
import {IOptionType} from "../../component/saet-question/saet-question.component";
import {iSurvey} from "../../shared/survey";
import {BaseComponent} from "../../BaseComponent";
import {QuestionsComponent} from "../../QuestionsComponent";

@Component({
  selector: 'app-estudiante-cuestionario-lenguaje',
  templateUrl: './estudiante-cuestionario-lenguaje.component.html',
  styleUrls: ['./estudiante-cuestionario-lenguaje.component.css']
})
export class EstudianteCuestionarioLenguajeComponent extends QuestionsComponent implements IMessageComponent{
  showMessage:boolean = false;
  message: string = "";
  titleMessage: string = "";


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
