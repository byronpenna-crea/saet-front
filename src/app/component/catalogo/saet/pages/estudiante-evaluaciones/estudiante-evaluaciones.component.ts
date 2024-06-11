import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
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
  psicologiaAgendada:boolean = false;
  pedagogiaAgendada:boolean = false;
  lenguajeHablaAgendada:boolean = false;
  successMessage:IUserMessage = {
    show:true,
    message: "¡Los datos han sido guardados exitosamente!",
    title: 'Datos guardados'
  }
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    protected router: Router
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
  async iniciarPsicologia() {
    await this.router.navigate(['/menu/saet-psicologia/',  this.nie ]);
  }
  async iniciarPedagogia() {
    await this.router.navigate(['/menu/saet-pedagogia/',  this.nie ]);
  }
  async iniciarLenguajeHabla() {
    await this.router.navigate(['/menu/saet-lenguaje-habla/',  this.nie ]);
  }
  // lenguaje y habla
  agendarLenguaje(){
    this.lenguajeHablaAgendada = true;
    this.lenguajeHablaMessage = this.successMessage;
  }
  cancelarLenguaje(){
    this.lenguajeHablaAgendada = false;
    this.lenguajeHablaMessage = {
      ...this.successMessage,
      show: false
    }
  }
  // pedagogia
  agendarPedagogia() {
    this.pedagogiaMessage = this.successMessage;
    this.pedagogiaAgendada = true;
  }
  cancelarPedagogia() {
    this.pedagogiaAgendada = false;
    this.pedagogiaMessage = {
      ...this.successMessage,
      show: false
    }
  }
  // psicologia
  cancelarPsicologia() {
    this.psicologiaAgendada = false;
    this.psicologyMessage = {
      ...this.successMessage,
      show: false
    }
  }
  agendarPsicologia() {
    this.psicologyMessage = this.successMessage
    this.psicologiaAgendada = true;
  }
}
