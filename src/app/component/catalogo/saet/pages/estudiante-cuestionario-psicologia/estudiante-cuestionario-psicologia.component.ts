import {Component, Inject} from '@angular/core';
import {QuestionsComponent} from "../../QuestionsComponent";
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {
  CatalogoServiceCor,
  ISaveQuestionary
} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {userMessageInit} from "../../shared/messages.model";
import {TIPO_EVALUACION} from "../../shared/evaluaciones";
import {ConfirmationService} from "primeng/api";



@Component({
  selector: 'app-estudiante-cuestionario-psicologia',
  templateUrl: './estudiante-cuestionario-psicologia.component.html',
  styleUrls: ['./estudiante-cuestionario-psicologia.component.css']
})
export class EstudianteCuestionarioPsicologiaComponent extends QuestionsComponent implements IMessageComponent {
  userMessage: UserMessage = userMessageInit;

  editMode:boolean = false;
  cuestionariosTableMode: number[] = [
    7,10,11,12,13
  ]
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ){

    super(document, catalogoServiceCOR, route, router, confirmationService, "psicologia_values");


    catalogoServiceCOR.getPsicologiaQuestions().then((result) => {
      this.showActionButtons = true;
      this.corSurveys.push(...result.cuestionarios);
    });


  }

  save(){
    const objToSave:ISaveQuestionary = this.getQuestionaryObject();
    const x = this.catalogoServiceCOR.savePsicologia(objToSave);
    console.log('response --------------',x);
    console.log("to save ",objToSave);
  }
  message: string = "";
  showMessage: boolean = false;
  titleMessage: string = "";
}
