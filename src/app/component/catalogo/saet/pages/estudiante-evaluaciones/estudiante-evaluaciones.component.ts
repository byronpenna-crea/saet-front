import {Component, Inject} from '@angular/core';
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute} from "@angular/router";
import {userMessageInit} from "../../shared/messages.model";
interface IUserMessage  {
  show: boolean,
  title: string,
  message: string
}
@Component({
  selector: 'app-estudiante-evaluaciones',
  templateUrl: './estudiante-evaluaciones.component.html',
  styleUrls: ['./estudiante-evaluaciones.component.css']
})
export class EstudianteEvaluacionesComponent implements IMessageComponent {
  userMessage: UserMessage = userMessageInit;
  nie:string = "";
  studentInfo?: StudentDetail;
  psicologyMessage: IUserMessage = {
    show: false,
    title: "",
    message: ""
  };
  pedagogiaMessage: IUserMessage = {
    show: false,
    title: "",
    message: ""
  };
  lenguajeHablaMessage: IUserMessage = {
    show: false,
    title: "",
    message: ""
  };
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceCOR: CatalogoServiceCor,
    private route: ActivatedRoute
  ){
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
      }
    });

    catalogoServiceCOR.getStudentInfo(this.nie).then((result) => {
      this.studentInfo = result.estudiante;
    })
  }

}
