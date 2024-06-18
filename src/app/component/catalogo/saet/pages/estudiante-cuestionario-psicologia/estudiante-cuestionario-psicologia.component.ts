import {Component, Inject} from '@angular/core';
import {QuestionsComponent} from "../../QuestionsComponent";
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, ISavePsicologia} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {userMessageInit} from "../../shared/messages.model";
import {TIPO_EVALUACION} from "../../shared/evaluaciones";



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

  save(){
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const fecha = `${day}/${month}/${year}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const hora = `${hours}:${minutes}`;

    const respuestas = this.getAnswerObject(this.values);
    const objToSave:ISavePsicologia = {
      id_evaluacion: null,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_especialista: 3,
      id_tipo_evaluacion: TIPO_EVALUACION.psicologo_perfil,
      fecha: fecha,
      hora: hora,
      respuestas: respuestas
    };
    const x = this.catalogoServiceCOR.savePsicologia(objToSave);
    console.log(x);
    console.log("to save ",objToSave);
  }
  message: string = "";
  showMessage: boolean = false;
  titleMessage: string = "";
}
