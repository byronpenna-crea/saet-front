import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  IMessageComponent,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveQuestionary,
  ResponseError,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { userMessageInit } from '../../shared/messages.model';
import { BaseComponent } from '../../BaseComponent';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';

interface IUserMessage {
  show: boolean;
  title: string;
  message: string;
}
interface TabInput {
  agendado: boolean;
  readOnly: boolean;
  leyend: string;
  name: string;
  especialistaAgendado: string;
  onIniciar: () => void;
  onAgendar: () => void;
  onCancelar: () => void;
}
@Component({
  selector: 'app-estudiante-evaluaciones',
  templateUrl: './estudiante-evaluaciones.component.html',
  styleUrls: ['./estudiante-evaluaciones.component.css'],
})
export class EstudianteEvaluacionesComponent
  extends BaseComponent
  implements IMessageComponent
{
  userMessage: UserMessage = userMessageInit;
  //nie:string = "";
  //studentInfo?: StudentDetail;
  psicologiaAgendada: boolean = false;
  psicologiaEspecilistaAgendado: string = '';
  pedagogiaAgendada: boolean = false;
  lenguajeHablaAgendada: boolean = false;
  readOnlyTab: boolean = true;
  agendaTabs: TabInput[] = [];
  successMessage: IUserMessage = {
    show: true,
    message: '¡Los datos han sido guardados exitosamente!',
    title: 'Datos guardados',
  };
  psicologyMessage: IUserMessage = {
    show: false,
    title: '',
    message: '',
  };
  pedagogiaMessage: IUserMessage = {
    show: false,
    title: '',
    message: '',
  };
  lenguajeHablaMessage: IUserMessage = {
    show: false,
    title: '',
    message: '',
  };
  especialidad: string = '';
  idPersona: number = 0;

  especialidades = ['Psicologia', 'lenguaje', 'Pedagogía'];

  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    router: Router
  ) {
    super(document, catalogoServiceCOR, route, router);
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
      }
    });

    catalogoServiceCOR
      .getStudentInfo(this.nie)
      .then(result => {
        this.studentInfo = result.estudiante;
      })
      .catch(ex => {
        console.log('error on getStudentInfo', ex);
      });

    this.especialidad = localStorage.getItem('especialidad') ?? '';

    const idPersonaStr = localStorage.getItem('id_persona') ?? '0';
    this.idPersona = isNaN(parseInt(idPersonaStr, 10))
      ? 0
      : parseInt(idPersonaStr, 10);

    const tabs = this.getTabs();
    if (tabs !== undefined) {
      this.agendaTabs = tabs;
    }

    this.agendaTabs = this.agendaTabs.sort((a, b) =>
      a.name === this.especialidad ? -1 : 1
    );
    this.agendaTabs[0].readOnly = false;

    const enumEspecialidad: TIPO_EVALUACION = this.getTipoEvaluacionFromString(
      this.especialidad
    );

    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, enumEspecialidad)
      .then(response => {
        if (response.id_evaluacion !== 0) {
          this.psicologiaEspecilistaAgendado =
            response.especialista_responsable;
          this.updateTab(this.especialidad, true);
        }
      })
      .catch((ex: ResponseError) => {
        console.log('error ex', ex.status);
      });

    catalogoServiceCOR.getCorEspecialistas(this.nie).then(response => {
      console.log('response especialistas ', response);
      response.forEach(especialista => {
        if (this.especialidades.includes(especialista.especialidad)) {
          if (especialista.especialidad === 'Psicologia') {
            this.psicologiaAgendada = true;
            this.updateTab('psicologia', true);
          }
          if (especialista.especialidad === 'Pedagogía') {
            this.pedagogiaAgendada = true;
            this.updateTab('pedagogia', true);
          }
        }
      });
    });
  }
  getTipoEvaluacionFromString(especialidad: string) {
    switch (especialidad) {
      case 'pedagogia': {
        return TIPO_EVALUACION.pedagogo_perfil;
      }
      case 'psicologia': {
        return TIPO_EVALUACION.psicologo_perfil;
      }
      case 'lenguaje': {
        return TIPO_EVALUACION.logopeda_perfil;
      }
      default: {
        return TIPO_EVALUACION.psicologo_perfil;
      }
    }
  }
  getTabs(name: string = '') {
    const tabs = [
      {
        leyend: 'Evaluación Habla y lenguaje',
        agendado: this.lenguajeHablaAgendada,
        readOnly: this.readOnlyTab,
        onAgendar: this.agendarLenguaje.bind(this),
        onCancelar: this.cancelarLenguaje.bind(this),
        onIniciar: this.iniciarLenguajeHabla.bind(this),
        especialistaAgendado: '',
        name: 'lenguaje',
      },
      {
        leyend: 'Evaluación psicologica',
        agendado: this.psicologiaAgendada,
        readOnly: this.readOnlyTab,
        onAgendar: this.agendarPsicologia.bind(this),
        onCancelar: this.cancelarPsicologia.bind(this),
        onIniciar: this.iniciarPsicologia.bind(this),
        especialistaAgendado: this.psicologiaEspecilistaAgendado,
        name: 'psicologia',
      },
      {
        leyend: 'Evaluación pedagogica',
        agendado: this.pedagogiaAgendada,
        readOnly: this.readOnlyTab,
        onAgendar: this.agendarPedagogia.bind(this),
        onCancelar: this.cancelarPedagogia.bind(this),
        onIniciar: this.iniciarPedagogia.bind(this),
        especialistaAgendado: '',
        name: 'pedagogia',
      },
    ];
    if (name === '') {
      return tabs;
    }
    const tab = tabs.find(tab => tab.name === name);
    return tab !== undefined ? [tab] : [];
  }
  updateTab(name: string, agendado: boolean) {
    if (name === 'psicologia') {
      this.psicologiaAgendada = agendado;
    }
    if (name === 'lenguaje') {
      this.lenguajeHablaAgendada = agendado;
    }
    if (name === 'pedagogia') {
      this.pedagogiaAgendada = agendado;
    }

    const index = this.agendaTabs.findIndex(tab => tab.name === name);
    if (index !== -1) {
      const tab = this.getTabs(this.agendaTabs[index].name)[0];
      if (tab) {
        this.agendaTabs[index] = tab;
        this.agendaTabs[index].readOnly = false;
      }
      this.cdr.detectChanges();
    }
  }
  async iniciarPsicologia() {
    await this.router.navigate(['/menu/saet-psicologia/', this.nie]);
  }
  async iniciarPedagogia() {
    await this.router.navigate(['/menu/saet-pedagogia/', this.nie]);
  }
  async iniciarLenguajeHabla() {
    await this.router.navigate(['/menu/saet-lenguaje-habla/', this.nie]);
  }
  // lenguaje y habla
  agendarLenguaje() {
    this.lenguajeHablaAgendada = true;
    this.lenguajeHablaMessage = this.successMessage;
    this.updateTab('lenguaje', true);
  }
  cancelarLenguaje() {
    this.lenguajeHablaAgendada = false;
    this.lenguajeHablaMessage = {
      ...this.successMessage,
      show: false,
    };
  }
  // pedagogia
  async agendarPedagogia() {
    if (this.studentInfo?.id_est_pk === undefined) {
      console.error('estudiante no encontrado');
      return;
    }
    const obj: ISaveQuestionary = {
      id_estudiante_fk: this.studentInfo?.id_est_pk,
      id_especialista: this.idPersona,
      id_tipo_evaluacion: TIPO_EVALUACION.pedagogo_perfil,
      fecha: '12/12/2023',
      hora: '12:40',
      id_evaluacion: null,
      respuestas: [],
    };
    const respuesta = await this.catalogoServiceCOR.savePedagogia(obj);
    if (respuesta.id_evaluacion !== 0) {
      this.pedagogiaMessage = this.successMessage;
      this.pedagogiaAgendada = true;
      this.updateTab('pedagogia', true);
    }
  }
  cancelarPedagogia() {
    this.pedagogiaAgendada = false;
    this.pedagogiaMessage = {
      ...this.successMessage,
      show: false,
    };
  }
  // psicologia
  cancelarPsicologia() {
    this.psicologiaAgendada = false;
    this.psicologyMessage = {
      ...this.successMessage,
      show: false,
    };
    this.updateTab('psicologia', true);
  }
  async agendarPsicologia() {
    if (this.studentInfo?.id_est_pk === undefined) {
      console.error('estudiante no encontrado');
      return;
    }
    const obj: ISaveQuestionary = {
      id_estudiante_fk: this.studentInfo?.id_est_pk,
      id_especialista: this.idPersona,
      id_tipo_evaluacion: TIPO_EVALUACION.psicologo_perfil,
      fecha: '12/12/2023',
      hora: '12:40',
      id_evaluacion: null,
      respuestas: [],
    };
    const respuesta = await this.catalogoServiceCOR.savePsicologia(obj);
    if (respuesta.id_evaluacion !== 0) {
      this.psicologyMessage = this.successMessage;
      this.psicologiaAgendada = true;
      this.updateTab('psicologia', true);
    }
  }
}
