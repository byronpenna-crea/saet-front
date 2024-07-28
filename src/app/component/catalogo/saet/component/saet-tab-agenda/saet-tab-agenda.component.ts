import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { ButtonStyle } from '../saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';
import { iEspecialidadEvaluacion } from '../../../../../services/catalogo/catalogo.service.cor';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';

export interface IAgendaParams {
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
}
@Component({
  selector: 'app-saet-tab-agenda',
  templateUrl: './saet-tab-agenda.component.html',
  styleUrls: ['./saet-tab-agenda.component.css'],
})
export class SaetTabAgendaComponent {
  @Input() agendado: boolean = false;
  @Input() especialidad?: iEspecialidadEvaluacion;
  @Input() readOnly: boolean = false;
  @Input() leyend: string = '';
  @Input() especialistaAgendado: IAgendaEspecialista = {
    dui: '',
    nombreCompleto: '',
  };
  @Input() evaluationId: number = 0;
  @Input() agendaId: number = 0;
  @Output() onIniciar = new EventEmitter<void>();
  @Output() onAgendar = new EventEmitter<IAgendaParams>();
  @Output() onCancelarAgenda = new EventEmitter<IOnCancelarAgenda>();
  @Output() onMessage = new EventEmitter<{
    title: string;
    message: string;
    messageType: MessageType;
  }>();
  @Input() tabMessage: UserMessage = {
    showMessage: false,
    titleMessage: '',
    message: '',
    type: MessageType.SUCCESS,
  };
  @Input() tipoEvaluacion: TIPO_EVALUACION = TIPO_EVALUACION.psicologo_perfil;
  buttonStyle = ButtonStyle;
  buttonIcon = IconComponent;

  evaluationDate: Date | null = new Date();
  evaluationTime: Date | null = null;

  onFechaEvaluacionSelect(event: Date) {
    console.log('Fecha de evaluación seleccionada:', event);
    this.evaluationDate = event;
  }

  onHoraEvaluacionSelect(event: Date) {
    console.log('Hora de evaluación seleccionada:');
    this.evaluationTime = event;
  }

  agendar() {
    if (!this.readOnly) {
      if (this.evaluationDate !== null && this.evaluationTime !== null) {
        this.onAgendar.emit({
          evaluationDate: this.evaluationDate,
          evaluationTime: this.evaluationTime,
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
      this.onCancelarAgenda.emit({
        evaluationId: this.agendaId,
        especialidad: this.especialidad ?? iEspecialidadEvaluacion.PSICOLOGIA,
      });
    }
  }
  iniciar() {
    if (!this.readOnly) {
      this.onIniciar.emit();
    }
  }
}
