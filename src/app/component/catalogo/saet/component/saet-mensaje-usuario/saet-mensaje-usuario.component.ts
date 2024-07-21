import { Component, Input } from '@angular/core';
import { MessageType } from '../../interfaces/message-component.interface';

@Component({
  selector: 'app-saet-mensaje-usuario',
  templateUrl: './saet-mensaje-usuario.component.html',
  styleUrls: ['./saet-mensaje-usuario.component.css'],
})
export class SaetMensajeUsuarioComponent {
  @Input() message: string = '';
  @Input() title?: string = '';
  @Input() messageType: MessageType = MessageType.SUCCESS;
  @Input() show: boolean = false;

  type = MessageType;
}
