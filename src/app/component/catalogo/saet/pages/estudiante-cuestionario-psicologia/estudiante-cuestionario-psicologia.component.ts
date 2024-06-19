import {Component, Inject} from '@angular/core';
import {FormMode, IValuesForm, QuestionsComponent} from "../../QuestionsComponent";
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {
  CatalogoServiceCor, IEvaluacionResponse,
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

  formModeEnum = FormMode;
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
    const especialidadTarget:string = "psicologia";
    super(document, catalogoServiceCOR, route, router, confirmationService, especialidadTarget);

    this.catalogoServiceCOR.getTipoDeEvaluacion(this.nie,TIPO_EVALUACION.psicologo_perfil).then((response) => {

      console.log('Evaluacion here ', response);
      console.log('values here ', this.values);
      console.log('transformed response ',this.responseToValues(response));

      this.values = {
        ...this.values,
        ...this.responseToValues(response)
      }
      console.log('this values ... ', this.values);
    });


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
