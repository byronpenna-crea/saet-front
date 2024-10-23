import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  IMessageComponent,
  MessageType,
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
import { CorBaseComponent } from '../../CorBaseComponent';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import {
  IAgendaEspecialista,
  IAgendaParams,
  IOnCancelarAgenda,
} from '../../component/saet-tab-agenda/saet-tab-agenda.component';
import { iEspecialidadEvaluacion } from '../../../../../services/shared/saet-types';

interface IUserMessage {
  show: boolean;
  title: string;
  message: string;
}
export interface TabInput {
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
  extends CorBaseComponent
  implements IMessageComponent
{
  psicologiaEspecilistaAgendado = '';
  psicologiaEvaluationId = 0;

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

  readOnlyTab = true;
  agendaTabs: TabInput[] = [];

  especialidad?: iEspecialidadEvaluacion;
  idPersona = 0;

  especialidades = ['Psicologia', 'Lenguaje y habla', 'Pedagogía'];
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    router: Router
  ) {
    super(document, catalogoServiceCOR, route, router);

    this.pageLoading = true;
    this.userMessage.showMessage = false;

    console.log('idEspecialidad evaluacion --> ', iEspecialidadEvaluacion);
    Object.values(iEspecialidadEvaluacion).forEach(especialidad => {
      this.agendado[especialidad] = false;
    });

    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
      }
    });
    this.initCaracterizacion().then(() => {
      catalogoServiceCOR
        .getStudentInfo(this.nie)
        .then(result => {
          this.studentInfo = result.estudiante;
        })
        .catch(ex => {
          console.log('<--- error on getStudentInfo', ex);
        });

      this.especialidad = localStorage.getItem(
        'especialidad'
      ) as iEspecialidadEvaluacion;
      console.log('especialidad logueado ', this.especialidad);
      const idPersonaStr = localStorage.getItem('id_persona') ?? '0';
      this.idPersona = isNaN(parseInt(idPersonaStr, 10))
        ? 0
        : parseInt(idPersonaStr, 10);

      const tabs = this.getTabs();
      if (tabs !== undefined) {
        this.agendaTabs = tabs;
      }

      this.agendaTabs = this.agendaTabs.sort(a =>
        a.name === this.especialidad ? -1 : 1
      );
      if (tabs !== undefined) {
        this.agendaTabs = tabs.map(tab => ({
          ...tab,
          readOnly: tab.name !== this.especialidad, // Solo habilitar la pestaña correspondiente
        }));
      }
      this.agendaTabs[0].readOnly = false;
      const indexEspecialidad: iEspecialidadEvaluacion | undefined =
        this.getIndexEspecialidad(this.especialidad);

      const enumEspecialidad: TIPO_EVALUACION =
        this.getTipoEvaluacionFromString(this.especialidad);

      this.catalogoServiceCOR
        .getTipoDeEvaluacion(this.nie, enumEspecialidad)
        .then(response => {
          console.log('response getTipoEvaluacion ', response);
          if (response.id_evaluacion === 0) {
            this.userMessage.showMessage = true;
            this.userMessage.message = 'Evaluacion obtenida no es valida ';
            return;
          }

          this.psicologiaEspecilistaAgendado =
            response.especialista_responsable;

          if (indexEspecialidad) {
            this.especialista[indexEspecialidad] = {
              nombreCompleto: response.especialista_responsable,
              dui: '',
            };
            console.log('------> ', this.especialista[indexEspecialidad]);
            this.agendaId[indexEspecialidad] = response.id_evaluacion;
          }
          this.psicologiaEvaluationId = response.id_evaluacion;
          this.especialidad && this.updateTab(this.especialidad, true);
        })
        .catch((ex: ResponseError) => {
          console.log('------- error ex --------', ex.status);
        });

      catalogoServiceCOR
        .getCorEspecialistas(this.nie)
        .then(response => {
          console.log('response getCorEspecialistas ', response);
          response.forEach(especialista => {
            if (this.especialidades.includes(especialista.especialidad)) {
              if (especialista.especialidad === 'Psicologo') {
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
                console.log(
                  '################# here inside ###############',
                  especialista
                );
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
        })
        .finally(() => {
          this.pageLoading = false;
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
    return especialidad === 'psicologo'
      ? iEspecialidadEvaluacion.PSICOLOGIA
      : especialidad === 'lenguaje'
        ? iEspecialidadEvaluacion.LENGUAJE
        : especialidad === 'pedagogia'
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
  getTabs(name = '') {
    const tabs: TabInput[] = [
      {
        leyend: 'Evaluación Habla y lenguaje',
        agendado: this.agendado[iEspecialidadEvaluacion.LENGUAJE],
        readOnly: this.readOnlyTab,
        onAgendar: this.agendar.bind(this),
        onCancelarAgenda: this.cancelar.bind(this),
        evaluationId: 0,
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
        readOnly: true,
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
    if (name === 'psicologo') {
      this.agendado[iEspecialidadEvaluacion.PSICOLOGIA] = agendado;
    }
    if (name === 'lenguaje') {
      console.log(' ######## ----- update tab --- #####', this.agendaTabs);
      this.agendado[iEspecialidadEvaluacion.LENGUAJE] = agendado;
    }
    if (name === 'pedagogia') {
      this.agendado[iEspecialidadEvaluacion.PEDAGOGIA] = agendado;
    }

    const index = this.agendaTabs.findIndex(tab => tab.name === name);
    console.log('index _____', index);
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
    //console.log('lenguaje y habla');
    await this.router.navigate(['/menu/saet-lenguaje-habla/', this.nie]);
  }

  async cancelar(event: IOnCancelarAgenda) {
    this.pageLoading = true;

    console.log('especialidad en este evento ', event.especialidad);
    if (event.evaluationId === 0) {
      this.userMessage.showMessage = true;
      this.userMessage.titleMessage = 'Atencion';
      this.userMessage.message = 'No existe una evaluacion para cancelar';
      this.userMessage.type = MessageType.WARNING;
    }
    try{
      await this.catalogoServiceCOR.deleteEvaluacionCor(
        event.evaluationId.toString()
      );
      this.agendado[event.especialidad] = false;
      this.updateTab(event.especialidad, false);
    }catch (ex: unknown){
      const error = ex as ResponseError;
      this.userMessage.showMessage = true;
      this.userMessage.titleMessage = 'Error';
      this.userMessage.message = error.message;
      this.userMessage.type = MessageType.DANGER;
    }

    this.pageLoading = false;
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
    this.pageLoading = true;

    if (this.studentInfo?.id_est_pk === undefined) {
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.message = 'Estudiante no encontrado';
      this.userMessage.type = MessageType.DANGER;
      console.error('estudiante no encontrado');
      this.pageLoading = false;
      return;
    }
    if (event.evaluationTime === null || event.evaluationDate === null) {
      this.userMessage.showMessage = true;
      this.userMessage.message = 'Debes llenar la fecha y hora para agendar';
      this.userMessage.titleMessage = '¡Atención!';
      this.pageLoading = false;
      return;
    }

    const currentDate = new Date();
    if (event.evaluationDate < currentDate) {
      this.userMessage.showMessage = true;
      this.userMessage.message =
        'La fecha de la agenda no puede ser menor que la fecha actual';
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.type = MessageType.DANGER;
      this.pageLoading = false;
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

    if (event.especialidad === undefined) {
      this.userMessage.showMessage = true;
      this.userMessage.message = 'No existe especilidad para ser guardada';
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.type = MessageType.DANGER;
      this.pageLoading = false;
      return;
    }
    if (this.especialidad === undefined) {
      this.userMessage.showMessage = true;
      this.userMessage.message = 'Problema con la session del usuario, cierrela y vuelvala a iniciar';
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.type = MessageType.DANGER;
      this.pageLoading = false;
      return;
    }
    try {
      const respuesta = await this.catalogoServiceCOR.saveEvaluacion(
        obj,
        event.especialidad
      );
      console.log('respuesta agregando ---->', respuesta);
      if (respuesta.id_evaluacion !== 0) {
        this.agendaId[this.especialidad] = respuesta.id_evaluacion ?? 0;
        const nombreCompleto = `${localStorage.getItem('nombre') ?? ''}`;
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
    this.pageLoading = false;
  }
}
