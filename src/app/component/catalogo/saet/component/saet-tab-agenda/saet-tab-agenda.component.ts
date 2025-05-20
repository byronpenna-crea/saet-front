import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { ButtonStyle } from '../saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';

import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import { iEspecialidadEvaluacion } from '../../../../../services/shared/saet-types';
import { DOCUMENT } from '@angular/common';
import { CatalogoServiceCor } from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';

export interface IAgendaParams {
  profileDate: Date | null;
  profileTime: Date | null;

  especialidad?: iEspecialidadEvaluacion;
  tipoEvaluacion: TIPO_EVALUACION;
}
export interface IAgendaEvaluationParams {
  evaluationDate: Date | null;
  evaluationTime: Date | null;

  especialidad?: iEspecialidadEvaluacion;
  tipoEvaluacion: TIPO_EVALUACION;
}
export interface IOnCancelarAgenda {
  evaluationId: number;
  especialidad: iEspecialidadEvaluacion;
}
export interface IAgendaEspecialista {
  nombreCompleto: string;
  dui: string;
  especialidad?: string;
  fechaAgendado?: string;
  horaAgendado?: string;
}
@Component({
  selector: 'app-saet-tab-agenda',
  templateUrl: './saet-tab-agenda.component.html',
  styleUrls: ['./saet-tab-agenda.component.css'],
})
export class SaetTabAgendaComponent {
  @Input() especialidad?: iEspecialidadEvaluacion;
  @Input() perfilIniciado: boolean = false;
  @Input() agendado: boolean = false;
  @Input() agendadoEvaluacion: boolean = false;

  @Input() readOnly: boolean = false;
  @Input() readOnlyEvaluacion: boolean = false;

  @Input() horaAgendado: string = '';
  @Input() fechaAgendado: string = '';
  @Input() current: boolean = false;
  @Input() leyend: string = '';
  @Input() especialistaAgendado: IAgendaEspecialista = {
    dui: '',
    nombreCompleto: '',
  };
  @Input() evaluacionAgendada: {
    hora: string;
    fecha: string;
  } | null = null;
  @Input() evaluationId: number = 0;
  @Input() agendaId: number = 0;
  @Input() nie: string = "";
  @Output() onIniciar = new EventEmitter<void>();
  @Output() onAgendar = new EventEmitter<IAgendaParams>();
  @Output() onEvaluationAgendar = new EventEmitter<IAgendaEvaluationParams>();
  @Output() onCancelarAgenda = new EventEmitter<IOnCancelarAgenda>();
  @Output() onMessage = new EventEmitter<{
    title: string;
    message: string;
    messageType: MessageType;
    showMessage?: boolean;
  }>();
  @Input() tabMessage: UserMessage = {
    showMessage: false,
    titleMessage: '',
    message: '',
    type: MessageType.SUCCESS,
  };
  @Input() tipoEvaluacion: TIPO_EVALUACION = TIPO_EVALUACION.psicologo_perfil;
  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected catalogoServiceCOR: CatalogoServiceCor,
    protected route: ActivatedRoute,
    protected router: Router
  ) {

  }

  buttonStyle = ButtonStyle;
  buttonIcon = IconComponent;

  profileDate: Date | null = new Date();
  profileTime: Date | null = null;

  evaluationDate: Date | null = new Date();
  evaluationTime: Date | null = null;
  onLoadView(event:any){
    console.log('mmmmmm load mmmm', event);
  }
  onChangeView(event: { index:number }) {
    switch (event.index){
      case 0:
        // perfil
        break;
      case 1:
        // agenda
        console.log('agendado evaluacion ->',this.agendadoEvaluacion);
        console.log('read only evaluacion value ->',this.readOnlyEvaluacion);
        if(this.nie === ""){
          console.log('Nie debe ser definido para poder continuar');
          break;
        }
        this.catalogoServiceCOR
          .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.psicologo_agenda)
          .then(response => {
            console.log('tipo de valuacion response XX ->', response);
          })
        break;
    }
    console.log('zzzzzzzzzzzz event zzzzzzzzzzzz', event);
  }
  getSpecialistLabel(specialist: iEspecialidadEvaluacion) {
    switch (specialist) {
      case iEspecialidadEvaluacion.PSICOLOGIA: {
        return 'psicólogo';
      }
      case iEspecialidadEvaluacion.LENGUAJE: {
        return 'lenguaje y habla';
      }
      case iEspecialidadEvaluacion.PEDAGOGIA: {
        return 'pedagogia';
      }
    }
  }
  onFechaEvaluacionSelect(event: Date) {
    this.evaluationDate = event;
  }
  onFechaPerfilSelect(event: Date) {
    this.profileDate = event;
  }
  // ############
  onEvaluationTimeSelect(event: Date) {
    this.evaluationTime = event;
  }
  onEvaluationTimeChange(event: Date) {
    this.evaluationTime = event;
  }
  // ##########
  onHoraPerfilChange(event: Date) {
    this.profileTime = event;
  }
  onHoraPerfilSelect(event: Date) {
    this.profileTime = event;
  }
  agendarEvaluacion() {
    console.log('on emit evaluation date', this.evaluationDate);
    console.log('on emit evaluation time', this.evaluationTime);

    this.onMessage.emit({
      message: '',
      messageType: MessageType.SUCCESS,
      title: '¡Atención!',
      showMessage: false,
    });
    if (!this.readOnlyEvaluacion) {
      if (this.evaluationDate !== null && this.evaluationTime !== null) {
        console.log('emited');
        let tipoEvaluacion: TIPO_EVALUACION | null = null;
        switch (this.tipoEvaluacion) {
          case TIPO_EVALUACION.psicologo_perfil:
            tipoEvaluacion = TIPO_EVALUACION.psicologo_agenda;
            break;
          case TIPO_EVALUACION.pedagogo_perfil:
            tipoEvaluacion = TIPO_EVALUACION.pedagogo_agenda;
            break;
        }

        if (tipoEvaluacion === null) {
          this.onMessage.emit({
            message: 'Tipo de evaluacion no definida correctamente',
            messageType: MessageType.WARNING,
            title: '¡Atención!',
          });
          return;
        }

        this.onEvaluationAgendar.emit({
          evaluationDate: this.evaluationDate,
          evaluationTime: this.evaluationTime,
          especialidad: this.especialidad,
          tipoEvaluacion: tipoEvaluacion ?? null,
        });
      } else {
        this.onMessage.emit({
          message: 'Debes llenar hora y fecha para agendar',
          messageType: MessageType.WARNING,
          title: '¡Atención!',
        });
      }
    }
  }
  agendar() {
    if (!this.readOnly) {
      console.log('fecha ----> ', this.profileDate);
      console.log('hora ----> ', this.profileTime);
      if (this.profileDate !== null && this.profileTime !== null) {
        this.onAgendar.emit({
          profileDate: this.profileDate,
          profileTime: this.profileTime,
          especialidad: this.especialidad,
          tipoEvaluacion: this.tipoEvaluacion ?? null,
        });
      } else {
        this.onMessage.emit({
          message: 'Debes llenar hora y fecha para agendar',
          messageType: MessageType.WARNING,
          title: '¡Atención!',
        });
      }
    }
  }
  cancelar() {
    if (!this.readOnly) {
      console.log('XXX ---- XXX ---', this.agendaId);
      this.onCancelarAgenda.emit({
        evaluationId: this.agendaId,
        especialidad: this.especialidad ?? iEspecialidadEvaluacion.PSICOLOGIA,
      });
    }
  }
  iniciar() {
    if (this.current || !this.readOnly) {
      this.onIniciar.emit();
    }
  }
}
