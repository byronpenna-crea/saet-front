import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IAgendaEspecialista, IAgendaParams} from '../saet-tab-agenda/saet-tab-agenda.component';
import { IconComponent } from '../../shared/component.config';
import { ButtonStyle } from '../saet-button/saet-button.component';
import {MessageType} from "../../interfaces/message-component.interface";
import {iEspecialidadEvaluacion} from "../../../../../services/shared/saet-types";
import {TIPO_EVALUACION} from "../../shared/evaluaciones";

@Component({
  selector: 'app-saet-agendar-evaluacion',
  templateUrl: './saet-agendar-evaluacion.component.html',
  styleUrls: ['./saet-agendar-evaluacion.component.css'],
})
export class SaetAgendarEvaluacionComponent {
  @Input() readOnly: boolean = false;
  @Input() especialistaResponsableAgendar: IAgendaEspecialista = {
    dui: '',
    nombreCompleto: '',
  };
  @Input() especialistaResponsableEvaluacion: IAgendaEspecialista = {
    dui: '',
    nombreCompleto: '',
  };
  @Input() especialidad?: iEspecialidadEvaluacion;
  @Input() tipoEvaluacion?: TIPO_EVALUACION;

  @Output() onAgendar = new EventEmitter<IAgendaParams>();
  evaluationDate: Date | null = null;
  evaluationTime: Date | null = null;

  buttonIcon = IconComponent;
  buttonStyle = ButtonStyle;

  agendarEvaluacion() {
    /*this.tipoEvaluacion && this.onAgendar.emit({
      evaluationDate: this.evaluationDate,
      evaluationTime: this.evaluationTime,
      especialidad: this.especialidad,
      tipoEvaluacion: this.tipoEvaluacion ?? undefined,
    });*/
  }
}
