import {Component, Input, Output, EventEmitter} from '@angular/core';
import {MessageType, UserMessage} from "../../interfaces/message-component.interface";

@Component({
  selector: 'app-saet-tab-agenda',
  templateUrl: './saet-tab-agenda.component.html',
  styleUrls: ['./saet-tab-agenda.component.css']
})
export class SaetTabAgendaComponent {
  @Input() agendado: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() leyend:string = "";
  @Output() onIniciar = new EventEmitter<void>();
  @Output() onAgendar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  @Input() tabMessage: UserMessage = {
    showMessage: false,
    titleMessage: "",
    message: "",
    type: MessageType.SUCCESS
  };
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
