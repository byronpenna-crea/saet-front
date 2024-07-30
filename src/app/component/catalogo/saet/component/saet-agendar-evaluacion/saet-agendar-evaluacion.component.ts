import { Component, Input } from '@angular/core';
import { IAgendaEspecialista } from '../saet-tab-agenda/saet-tab-agenda.component';
import { IconComponent } from '../../shared/component.config';
import { ButtonStyle } from '../saet-button/saet-button.component';

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

  evaluationDate: Date | null = null;
  evaluationTime: Date | null = null;

  buttonIcon = IconComponent;
  buttonStyle = ButtonStyle;
}
