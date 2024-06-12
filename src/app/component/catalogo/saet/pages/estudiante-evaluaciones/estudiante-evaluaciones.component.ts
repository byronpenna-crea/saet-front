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
interface TabInput {
  agendado: boolean;
  readOnly: boolean;
  leyend: string;
  name: string;
  onIniciar: () => void;
  onAgendar: () => void;
  onCancelar: () => void;
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
  readOnlyTab:boolean = true;
  agendaTabs:TabInput[] = [];
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
  especialidad:string = "";
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

    this.especialidad = localStorage.getItem('especialidad') ?? "";


    this.agendaTabs = [
      {
        leyend: 'Evaluación Habla y lenguaje',
        agendado: this.lenguajeHablaAgendada,
        readOnly: this.readOnlyTab,
        onAgendar: this.agendarLenguaje.bind(this),
        onCancelar: this.cancelarLenguaje.bind(this),
        onIniciar: this.iniciarLenguajeHabla.bind(this),
        name: "lenguaje y habla"
      },
      {
        leyend: 'Evaluación psicologica',
        agendado: this.psicologiaAgendada,
        readOnly: false,
        onAgendar: this.agendarPsicologia.bind(this),
        onCancelar: this.cancelarPsicologia.bind(this),
        onIniciar: this.iniciarPsicologia.bind(this),
        name: "psicologia"
      },
      {
        leyend: 'Evaluación pedagogica',
        agendado: this.pedagogiaAgendada,
        readOnly: this.readOnlyTab,
        onAgendar: this.agendarPedagogia.bind(this),
        onCancelar: this.cancelarPedagogia.bind(this),
        onIniciar: this.iniciarPedagogia.bind(this),
        name: "pedagogia"
      },

    ];

    this.agendaTabs = this.agendaTabs.sort((a, b) => (a.name === this.especialidad ? -1 : 1));
    console.log('agenda tabs ', this.agendaTabs);
    console.log('especialidad ', this.especialidad);
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
