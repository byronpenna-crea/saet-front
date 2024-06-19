import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {userMessageInit} from "../../shared/messages.model";
import {BaseComponent} from "../../BaseComponent";

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
export class EstudianteEvaluacionesComponent extends BaseComponent implements IMessageComponent {
  userMessage: UserMessage = userMessageInit;
  //nie:string = "";
  //studentInfo?: StudentDetail;
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
    @Inject(DOCUMENT)  document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    router: Router
  ){
    super(document, catalogoServiceCOR, route, router);
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

    const tabs = this.getTabs();
    if(tabs !== undefined){
      this.agendaTabs = tabs ;
    }


    this.agendaTabs = this.agendaTabs.sort((a, b) => (a.name === this.especialidad ? -1 : 1));
    this.agendaTabs[0].readOnly = false;
    console.log('agenda tabs ', this.agendaTabs);
    console.log('especialidad ', this.especialidad);
  }

  getTabs(name:string = "") {
    const tabs = [
      {
        leyend: 'Evaluación Habla y lenguaje',
        agendado: this.lenguajeHablaAgendada,
        readOnly: this.readOnlyTab,
        onAgendar: this.agendarLenguaje.bind(this),
        onCancelar: this.cancelarLenguaje.bind(this),
        onIniciar: this.iniciarLenguajeHabla.bind(this),
        name: "lenguaje"
      },
      {
        leyend: 'Evaluación psicologica',
        agendado: this.psicologiaAgendada,
        readOnly: this.readOnlyTab,
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
      }
    ];
    if (name === "") {
      return tabs;
    }
    const tab = tabs.find(tab => tab.name === name);
    return  tab !== undefined ? [tab] : [];
  }
  updateTab(name: string, agendado: boolean) {
    const index = this.agendaTabs.findIndex(tab => tab.name === name);
    if (index !== -1) {
      const tab = this.getTabs(this.agendaTabs[index].name)[0];
      console.log('tab to set', tab);
      if(tab){
        this.agendaTabs[index] = tab;
        this.agendaTabs[index].readOnly = false;
      }
      this.cdr.detectChanges();
    }
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
    console.log('tratando de agendar');
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
    this.updateTab('pedagogia', true);

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
    console.log('cancelar psicologia ');
    this.psicologiaAgendada = false;
    this.psicologyMessage = {
      ...this.successMessage,
      show: false
    }
    this.updateTab('psicologia', true);
  }
  agendarPsicologia() {
    console.log('agendar psicologia')
    this.psicologyMessage = this.successMessage
    this.psicologiaAgendada = true;
    this.updateTab('psicologia', true);
  }
}
