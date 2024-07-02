import {Component, Input, Output, EventEmitter} from '@angular/core';
import {MessageType, UserMessage} from "../../interfaces/message-component.interface";
import {ButtonStyle} from "../saet-button/saet-button.component";
import {IconComponent} from "../../shared/component.config";

@Component({
  selector: 'app-saet-tab-agenda',
  templateUrl: './saet-tab-agenda.component.html',
  styleUrls: ['./saet-tab-agenda.component.css']
})
export class SaetTabAgendaComponent {
  @Input() agendado: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() leyend:string = "";
  @Input() especialistaAgendado:string = "";
  @Output() onIniciar = new EventEmitter<void>();
  @Output() onAgendar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  @Input() tabMessage: UserMessage = {
    showMessage: false,
    titleMessage: "",
    message: "",
    type: MessageType.SUCCESS
  };

  buttonStyle = ButtonStyle;
  buttonIcon = IconComponent;

  agendar() {
    if(!this.readOnly){
      this.onAgendar.emit();
    }

  }
  cancelar() {
    if(!this.readOnly){
      this.onCancelar.emit();
    }

  }
  iniciar() {
    if(!this.readOnly){
      this.onIniciar.emit();
    }
  }
}
