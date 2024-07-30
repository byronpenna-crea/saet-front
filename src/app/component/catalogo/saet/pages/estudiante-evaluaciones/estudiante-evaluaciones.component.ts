import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  iEspecialidadEvaluacion,
  ISaveQuestionary,
  ResponseError,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { userMessageInit } from '../../shared/messages.model';
import { BaseComponent } from '../../BaseComponent';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import {
  IAgendaEspecialista,
  IAgendaParams,
  IOnCancelarAgenda,
} from '../../component/saet-tab-agenda/saet-tab-agenda.component';

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
  especialistaAgendado: {
    nombreCompleto: string;
    dui: string;
  };
  especialidad: iEspecialidadEvaluacion;
  evaluationId: number;
  agendaId: number;
  onIniciar: () => void;
  onAgendar: (event: IAgendaParams) => void;
  onCancelarAgenda: (event: IOnCancelarAgenda) => void;
  tipoEvaluacion: TIPO_EVALUACION;
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

  psicologiaEspecilistaAgendado: string = '';
  psicologiaEvaluationId: number = 0;
  especialista: { [key in iEspecialidadEvaluacion]: IAgendaEspecialista } = {
    [iEspecialidadEvaluacion.LENGUAJE]: {
      dui: '',
      nombreCompleto: '',
    },
    [iEspecialidadEvaluacion.PSICOLOGIA]: {
      dui: '',
      nombreCompleto: '',
    },
    [iEspecialidadEvaluacion.PEDAGOGIA]: {
      dui: '',
      nombreCompleto: '',
    },
  };
  agendaId: { [key in iEspecialidadEvaluacion]: number } = {
    [iEspecialidadEvaluacion.LENGUAJE]: 0,
    [iEspecialidadEvaluacion.PEDAGOGIA]: 0,
    [iEspecialidadEvaluacion.PSICOLOGIA]: 0,
  };
  agendado: { [key in iEspecialidadEvaluacion]: boolean } = {
    [iEspecialidadEvaluacion.LENGUAJE]: false,
    [iEspecialidadEvaluacion.PEDAGOGIA]: false,
    [iEspecialidadEvaluacion.PSICOLOGIA]: false,
  };

  lenguajeHablaAgendada: boolean = false;

  readOnlyTab: boolean = true;
  agendaTabs: TabInput[] = [];
  successMessage: IUserMessage = {
    show: true,
    message: '¡Los datos han sido guardados exitosamente!',
    title: 'Datos guardados',
  };

  especialidad: iEspecialidadEvaluacion;
  idPersona: number = 0;

  especialidades = ['Psicologia', 'Lenguaje y habla', 'Pedagogía'];

  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    router: Router
  ) {
    super(document, catalogoServiceCOR, route, router);

    Object.values(iEspecialidadEvaluacion).forEach(especialidad => {
      this.agendado[especialidad] = false;
    });

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

    this.especialidad = localStorage.getItem(
      'especialidad'
    ) as iEspecialidadEvaluacion;

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
    const indexEspecialidad: iEspecialidadEvaluacion | undefined =
      this.getIndexEspecialidad(this.especialidad);

    const enumEspecialidad: TIPO_EVALUACION = this.getTipoEvaluacionFromString(
      this.especialidad
    );

    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, enumEspecialidad)
      .then(response => {
        console.log('evaluacion here ---- ', response);
        console.log('enum especialidad ---- ', enumEspecialidad);
        if (response.id_evaluacion !== 0) {
          this.psicologiaEspecilistaAgendado =
            response.especialista_responsable;

          if (indexEspecialidad) {
            this.especialista[indexEspecialidad] = {
              nombreCompleto: response.especialista_responsable,
              dui: '',
            };
            this.agendaId[indexEspecialidad] = response.id_evaluacion;
          }
          this.psicologiaEvaluationId = response.id_evaluacion;
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
            this.agendado[iEspecialidadEvaluacion.PSICOLOGIA] = true;
            this.especialista[iEspecialidadEvaluacion.PSICOLOGIA] = {
              nombreCompleto: especialista.nombre_completo,
              dui: especialista.dui,
            };
            this.updateTab('psicologia', true);
          }
          if (especialista.especialidad === 'Pedagogía') {
            this.agendado[iEspecialidadEvaluacion.PEDAGOGIA] = true;
            this.especialista[iEspecialidadEvaluacion.PEDAGOGIA] = {
              nombreCompleto: especialista.nombre_completo,
              dui: especialista.dui,
            };
            this.updateTab(iEspecialidadEvaluacion.PEDAGOGIA, true);
          }
          if (especialista.especialidad === 'Lenguaje y habla') {
            console.log('here especialista ', especialista);
            this.agendado[iEspecialidadEvaluacion.LENGUAJE] = true;
            this.especialista[iEspecialidadEvaluacion.LENGUAJE] = {
              nombreCompleto: especialista.nombre_completo,
              dui: especialista.dui,
            };
            this.updateTab(iEspecialidadEvaluacion.LENGUAJE, true);
          }
          //
        }
      });
    });
  }
  onMessage(event: {
    title: string;
    message: string;
    messageType: MessageType;
  }) {
    this.userMessage.message = event.message;
    this.userMessage.titleMessage = event.title;
    this.userMessage.type = event.messageType;
    this.userMessage.showMessage = true;
  }
  getIndexEspecialidad(
    especialidad: string
  ): iEspecialidadEvaluacion | undefined {
    return this.especialidad === 'psicologia'
      ? iEspecialidadEvaluacion.PSICOLOGIA
      : this.especialidad === 'lenguaje'
        ? iEspecialidadEvaluacion.LENGUAJE
        : this.especialidad === 'pedagogia'
          ? iEspecialidadEvaluacion.PEDAGOGIA
          : undefined;
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
    const tabs: TabInput[] = [
      {
        leyend: 'Evaluación Habla y lenguaje',
        agendado: this.lenguajeHablaAgendada,
        readOnly: this.readOnlyTab,
        onAgendar: this.agendar.bind(this),
        onCancelarAgenda: this.cancelar.bind(this),
        evaluationId: this.psicologiaEvaluationId,
        onIniciar: this.iniciarLenguajeHabla.bind(this),
        especialistaAgendado:
          this.especialista[iEspecialidadEvaluacion.LENGUAJE],
        agendaId: this.agendaId[iEspecialidadEvaluacion.LENGUAJE],
        name: iEspecialidadEvaluacion.LENGUAJE,
        especialidad: iEspecialidadEvaluacion.LENGUAJE,
        tipoEvaluacion: TIPO_EVALUACION.logopeda_perfil,
      },
      {
        leyend: 'Evaluación psicologica',
        agendado: this.agendado[iEspecialidadEvaluacion.PSICOLOGIA],
        readOnly: this.readOnlyTab,
        onAgendar: this.agendar.bind(this),
        onCancelarAgenda: this.cancelar.bind(this),
        evaluationId: this.psicologiaEvaluationId,
        onIniciar: this.iniciarPsicologia.bind(this),
        especialistaAgendado:
          this.especialista[iEspecialidadEvaluacion.PSICOLOGIA],
        agendaId: this.agendaId[iEspecialidadEvaluacion.PSICOLOGIA],
        name: iEspecialidadEvaluacion.PSICOLOGIA,
        especialidad: iEspecialidadEvaluacion.PSICOLOGIA,
        tipoEvaluacion: TIPO_EVALUACION.psicologo_perfil,
      },
      {
        leyend: 'Evaluación pedagogica',
        agendado: this.agendado[iEspecialidadEvaluacion.PEDAGOGIA],
        readOnly: this.readOnlyTab,
        onAgendar: this.agendar.bind(this),
        onCancelarAgenda: this.cancelar.bind(this),
        onIniciar: this.iniciarPedagogia.bind(this),
        especialistaAgendado:
          this.especialista[iEspecialidadEvaluacion.PEDAGOGIA],
        evaluationId: this.agendaId[iEspecialidadEvaluacion.PEDAGOGIA],
        agendaId: this.agendaId[iEspecialidadEvaluacion.PEDAGOGIA],
        name: iEspecialidadEvaluacion.PEDAGOGIA,
        especialidad: iEspecialidadEvaluacion.PEDAGOGIA,
        tipoEvaluacion: TIPO_EVALUACION.pedagogo_perfil,
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
      this.agendado[iEspecialidadEvaluacion.PSICOLOGIA] = agendado;
    }
    if (name === 'lenguaje') {
      this.lenguajeHablaAgendada = agendado;
    }
    if (name === 'pedagogia') {
      this.agendado[iEspecialidadEvaluacion.PEDAGOGIA] = agendado;
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
      this.agendado[iEspecialidadEvaluacion.PEDAGOGIA] = true;
      this.updateTab('pedagogia', true);
    }
  }
  /*cancelarPedagogia() {
    this.pedagogiaAgendada = false;
    this.pedagogiaMessage = {
      ...this.successMessage,
      show: false,
    };
  }*/
  // psicologia
  async cancelar(event: IOnCancelarAgenda) {
    if (event.evaluationId === 0) {
      this.userMessage.showMessage = true;
      this.userMessage.titleMessage = 'Atencion';
      this.userMessage.message = 'No hay un id de evaluacion';
      this.userMessage.type = MessageType.WARNING;
    }
    await this.catalogoServiceCOR.deleteEvaluacionCor(
      event.evaluationId.toString()
    );

    this.agendado[iEspecialidadEvaluacion.PSICOLOGIA] = false;
    this.updateTab(event.especialidad, false);
  }
  formatDateToDDMMYYYY(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatTimeToHHMM(date: Date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  async agendar(event: IAgendaParams) {
    this.userMessage.showMessage = false;
    if (this.studentInfo?.id_est_pk === undefined) {
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.message = 'Estudiante no encontrado';
      this.userMessage.type = MessageType.DANGER;
      console.error('estudiante no encontrado');
      return;
    }
    if (event.evaluationTime === null || event.evaluationDate === null) {
      this.userMessage.showMessage = true;
      this.userMessage.message = 'Debes llenar la fecha y hora para agendar';
      this.userMessage.titleMessage = '¡Atención!';
      return;
    }

    const currentDate = new Date();
    if (event.evaluationDate < currentDate) {
      this.userMessage.showMessage = true;
      this.userMessage.message =
        'La fecha de la agenda no puede ser menor que la fecha actual';
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.type = MessageType.DANGER;
      return;
    }

    const timeToSave = this.formatTimeToHHMM(event.evaluationTime);
    const dateToSave = this.formatDateToDDMMYYYY(event.evaluationDate);

    const obj: ISaveQuestionary = {
      id_estudiante_fk: this.studentInfo?.id_est_pk,
      id_especialista: this.idPersona,
      id_tipo_evaluacion: event.tipoEvaluacion,
      fecha: dateToSave,
      hora: timeToSave,
      id_evaluacion: null,
      respuestas: [],
    };
    console.log('obj ', obj);
    if (event.especialidad === undefined) {
      this.userMessage.showMessage = true;
      this.userMessage.message = 'No existe especilidad para ser guardada';
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.type = MessageType.DANGER;
      return;
    }

    try {
      const respuesta = await this.catalogoServiceCOR.saveEvaluacion(
        obj,
        event.especialidad
      );
      if (respuesta.id_evaluacion !== 0) {
        this.agendaId[this.especialidad] = respuesta.id_evaluacion ?? 0;
        const nombreCompleto = `${localStorage.getItem('primer_nombre')} ${localStorage.getItem('primer_apellido')}`;
        this.especialista[this.especialidad] = {
          nombreCompleto: nombreCompleto,
          dui: localStorage.getItem('dui') ?? '',
        };
        this.updateTab(this.especialidad, true);
      }
    } catch (ex: unknown) {
      const error = ex as ResponseError;
      this.userMessage.showMessage = true;
      this.userMessage.titleMessage = 'Error';
      this.userMessage.message = error.message;
      this.userMessage.type = MessageType.DANGER;
    }

    /*this.psicologyMessage = this.successMessage;
    this.psicologiaAgendada = true;
    this.updateTab('psicologia', true);*/
  }
}
