import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  IMessageComponent,
  MessageType,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveQuestionary,
  ResponseError,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { CorBaseComponent } from '../../CorBaseComponent';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import {
  IAgendaEspecialista,
  IAgendaEvaluationParams,
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
  readOnlyEvaluacion?: boolean;
  leyend: string;
  name: string;
  especialistaAgendado: {
    nombreCompleto: string;
    dui: string;
  };
  current?:boolean;
  agendadoEvaluacion?: boolean;
  horaAgendado?: string;
  fechaAgendado?: string;
  especialidad: iEspecialidadEvaluacion;
  evaluationId: number;
  agendaId: number;
  onIniciar: () => void;
  onAgendar: (event: IAgendaParams) => void;
  onEvaluationAgendar: (event: IAgendaEvaluationParams) => void;
  onCancelarAgenda: (event: IOnCancelarAgenda) => void;
  tipoEvaluacion: TIPO_EVALUACION;
  perfilIniciado?: boolean;
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
      fechaAgendado: '',
      horaAgendado: '',
    },
    [iEspecialidadEvaluacion.PSICOLOGIA]: {
      dui: '',
      nombreCompleto: '',
      fechaAgendado: '',
      horaAgendado: '',
    },
    [iEspecialidadEvaluacion.PEDAGOGIA]: {
      dui: '',
      nombreCompleto: '',
      fechaAgendado: '',
      horaAgendado: '',
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

    // Reiniciamos los estados de agendado
    Object.values(iEspecialidadEvaluacion).forEach(especialidad => {
      this.agendado[especialidad] = false;
    });

    // Obtenemos el NIE desde los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) this.nie = nie;
    });

    this.initCaracterizacion().then(async () => {
      await this.loadStudentInfo();

      // Cargar especialidad y persona desde localStorage
      this.especialidad = localStorage.getItem('especialidad') as iEspecialidadEvaluacion;
      const idPersonaStr = localStorage.getItem('id_persona') ?? '0';
      this.idPersona = isNaN(parseInt(idPersonaStr)) ? 0 : parseInt(idPersonaStr);

      // Inicializamos tabs
      const tabs = this.getTabs();
      if (tabs) {
        this.agendaTabs = tabs.map(tab => ({ ...tab, readOnly: true }));
        this.agendaTabs = this.agendaTabs.sort(a => a.name === this.especialidad ? -1 : 1);
        this.agendaTabs[0].readOnly = false;
      }

      // Cargar información de especialistas relacionados
      await this.loadEspecialistasRelacionados();

      // Cargar información del especialista actual y evaluación
      await this.loadEspecialistaActual();



      this.pageLoading = false;
    });
  }

  private async loadEspecialistasRelacionados() {
    try {
      const response = await this.catalogoServiceCOR.getCorEspecialistas(this.nie);

      response.forEach(especialista => {
        const esp = especialista.especialidad;
        const espKey = esp === 'Psicologia' ? iEspecialidadEvaluacion.PSICOLOGIA :
          esp === 'Pedagogía' ? iEspecialidadEvaluacion.PEDAGOGIA :
            esp === 'Lenguaje y habla' ? iEspecialidadEvaluacion.LENGUAJE : null;

        if (!espKey) return;

        this.agendado[espKey] = true;
        this.especialista[espKey] = {
          nombreCompleto: especialista.nombre_completo,
          dui: especialista.dui
        };

        this.updateTab(espKey, true, {
          horaAgendado: especialista.hora_evaluacion,
          fechaAgendado: especialista.fecha_evaluacion,
          readonly: true,
          readonlyEvaluacion: true
        });
      });
    } catch (ex) {
      console.error('Error al obtener especialistas relacionados', ex);
    }
  }
  private getAgendaTipoEvaluacion(tipoPerfil: TIPO_EVALUACION): TIPO_EVALUACION | null {
    switch (tipoPerfil) {
      case TIPO_EVALUACION.psicologo_perfil:
        return TIPO_EVALUACION.psicologo_agenda;
      case TIPO_EVALUACION.pedagogo_perfil:
        return TIPO_EVALUACION.pedagogo_agenda;
      case TIPO_EVALUACION.logopeda_perfil:
        return TIPO_EVALUACION.logopeda_agenda;
      default:
        return null;
    }
  }

  private async loadEspecialistaActual() {
    const tipoPerfil = this.getTipoEvaluacionFromString(this.especialidad ?? '');
    const tipoAgenda = this.getAgendaTipoEvaluacion(tipoPerfil);

    if (!tipoAgenda) {
      this.userMessage = {
        showMessage: true,
        titleMessage: '',
        message: 'Error al obtener la agenda del especialista actual',
        type: MessageType.DANGER
      };
      return;
    }

    try {
      const perfil = await this.catalogoServiceCOR.getTipoDeEvaluacion(this.nie, tipoPerfil);
      if (perfil.id_evaluacion === 0) {
        this.userMessage = {
          showMessage: true,
          titleMessage: '',
          message: 'Evaluacion obtenida no es válida',
          type: MessageType.WARNING
        };
        return;
      }

      const indexEspecialidad = this.getIndexEspecialidad(this.especialidad ?? '');
      if (indexEspecialidad) {
        this.psicologiaEvaluationId = perfil.id_evaluacion;
        this.especialista[indexEspecialidad] = {
          nombreCompleto: perfil.especialista_responsable,
          dui: '',
        };
        this.agendaId[indexEspecialidad] = perfil.id_evaluacion;

        this.updateTab(this.especialidad!, true, {
          horaAgendado: perfil.hora,
          fechaAgendado: perfil.fecha,
          perfilIniciado: perfil.respuestas.length > 0,
          current: true
        });
      }

      const agenda = await this.catalogoServiceCOR.getTipoDeEvaluacion(this.nie, tipoAgenda);
      console.log('AGENDA PARA ACTUAL ---> ', agenda);
      this.updateSubTabEvaluacion(this.especialidad!, true, agenda.fecha ?? '', agenda.hora ?? '', true);
    } catch (ex) {
      console.error('Error al cargar especialista actual', ex);
    }
  }
  onMessage(event: {
    title: string;
    message: string;
    messageType: MessageType;
    showMessage?: boolean;
  }) {
    this.userMessage.message = event.message;
    this.userMessage.titleMessage = event.title;
    this.userMessage.type = event.messageType;
    this.userMessage.showMessage = event.showMessage ?? true;
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
        readOnlyEvaluacion: true,
        onAgendar: this.agendar.bind(this),
        onEvaluationAgendar: this.agendarEvaluacion.bind(this),
        current: false,
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
        readOnlyEvaluacion: true,
        onAgendar: this.agendar.bind(this),
        onEvaluationAgendar: this.agendarEvaluacion.bind(this),
        current: false,
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
        readOnlyEvaluacion: true,
        onAgendar: this.agendar.bind(this),
        onEvaluationAgendar: this.agendarEvaluacion.bind(this),
        current: false,
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
  updateSubTabEvaluacion(tabName:string,agendado: boolean, fecha: string, hora:string, current?:boolean) {
    const index = this.agendaTabs.findIndex(tab => tab.name === tabName);
    console.log('agenda tab to update --> index -->', index);
    if (index === -1) {
      return;
    }
    this.agendaTabs[index] = this.getTabs(this.agendaTabs[index].name)[0];

    console.log('agenda tab to update --> index -->', index);
    console.log('agenda tab to update --> xxx -->', this.agendaTabs[index]);
    this.agendaTabs[index].agendadoEvaluacion = agendado;
    this.agendaTabs[index].horaAgendado = hora;
    this.agendaTabs[index].fechaAgendado = fecha;
    this.agendaTabs[index].current = current ?? false;

  }
  updateTab(name: string, agendado: boolean, newTabData?: {
    horaAgendado?: string;
    fechaAgendado?: string;
    readonly?: boolean;
    readonlyEvaluacion?: boolean;
    perfilIniciado?: boolean;
    current?:boolean;
  }) {
    if (name === 'psicologo') {
      this.agendado[iEspecialidadEvaluacion.PSICOLOGIA] = agendado;
    }
    if (name === 'lenguaje') {
      this.agendado[iEspecialidadEvaluacion.LENGUAJE] = agendado;
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
        if (newTabData) {
          console.log('to put ', newTabData.current ?? false);
          this.agendaTabs[index].fechaAgendado = newTabData.fechaAgendado;
          this.agendaTabs[index].horaAgendado = newTabData.horaAgendado;
          this.agendaTabs[index].readOnly = newTabData.readonly ?? false;
          this.agendaTabs[index].readOnlyEvaluacion = newTabData.readonlyEvaluacion ?? false;
          this.agendaTabs[index].perfilIniciado = newTabData.perfilIniciado ?? false;
          this.agendaTabs[index].current = newTabData.current;
          console.log('to put 2', this.agendaTabs[index].current );
          console.log('here new data --> ', this.agendaTabs[index]);
          return;
        }
        console.log('index --> ', newTabData);
        console.log('index --> ', index);
        console.log('here new data --> ', this.agendaTabs[index]);
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
    try {
      await this.catalogoServiceCOR.deleteEvaluacionCor(
        event.evaluationId.toString()
      );
      this.agendado[event.especialidad] = false;
      this.updateTab(event.especialidad, false,{
        fechaAgendado: '',
        horaAgendado: '',
        current: true
      });
    } catch (ex: unknown) {
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
  async agendarEvaluacion(event: IAgendaEvaluationParams) {
    console.log('agendarEvaluacion in --> ','estudiante-evaluaciones');

    console.log('event.evaluationTime', event.evaluationTime);
    console.log('event.evaluationDate', event.evaluationDate);
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
    console.log('event.evaluationTime', event.evaluationTime);
    console.log('event.evaluationDate', event.evaluationDate);

    const timeToSave = this.formatTimeToHHMM(event.evaluationTime);
    const dateToSave = this.formatDateToDDMMYYYY(event.evaluationDate);

    if (dateToSave === '' || timeToSave === '') {
      this.userMessage.showMessage = true;
      this.userMessage.message = 'problema de fecha y hora';
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.type = MessageType.WARNING;
      this.pageLoading = false;
      return;
    }

    const obj: ISaveQuestionary = {
      id_estudiante_fk: this.studentInfo?.id_est_pk,
      id_especialista: this.idPersona,
      id_tipo_evaluacion: event.tipoEvaluacion,
      fecha: dateToSave,
      hora: timeToSave,
      id_evaluacion: null,
      respuestas: [],
    };
    console.log('obj to save')
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
      this.userMessage.message =
        'Problema con la session del usuario, cierrela y vuelvala a iniciar';
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.type = MessageType.DANGER;
      this.pageLoading = false;
      return;
    }
    console.log('before try');
    try {
      const respuesta = await this.catalogoServiceCOR.saveReporte(
        obj,
        event.especialidad
      );
      console.log('respuesta ', respuesta);
    } catch (ex: unknown) {
      console.log('catch estudiante evaluaciones');
      const error = ex as ResponseError;
      this.userMessage.showMessage = true;
      this.userMessage.titleMessage = 'Error';
      this.userMessage.message = error.message;
      this.userMessage.type = MessageType.DANGER;
    }
    this.pageLoading = false;
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
    if (event.profileTime === null || event.profileDate === null) {
      this.userMessage.showMessage = true;
      this.userMessage.message = 'Debes llenar la fecha y hora para agendar';
      this.userMessage.titleMessage = '¡Atención!';
      this.pageLoading = false;
      return;
    }

    const currentDate = new Date();

    if (event.profileDate < currentDate) {
      this.userMessage.showMessage = true;
      this.userMessage.message =
        'La fecha de la agenda no puede ser menor que la fecha actual';
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.type = MessageType.DANGER;
      this.pageLoading = false;
      return;
    }

    const timeToSave = this.formatTimeToHHMM(event.profileTime);
    const dateToSave = this.formatDateToDDMMYYYY(event.profileDate);

    if (dateToSave === '' || timeToSave === '') {
      this.userMessage.showMessage = true;
      this.userMessage.message = 'problema de fecha y hora';
      this.userMessage.titleMessage = '¡Atención!';
      this.userMessage.type = MessageType.WARNING;
      this.pageLoading = false;
      return;
    }

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
      this.userMessage.message =
        'Problema con la session del usuario, cierrela y vuelvala a iniciar';
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
        this.updateTab(this.especialidad, true,{
          horaAgendado: respuesta.hora,
          fechaAgendado: respuesta.fecha
        });
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
