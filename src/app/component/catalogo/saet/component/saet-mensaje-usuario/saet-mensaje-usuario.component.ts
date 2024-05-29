import {Component, Input} from '@angular/core';
enum Type {
  ERROR,
  SUCCESS
}
@Component({
  selector: 'app-saet-mensaje-usuario',
  templateUrl: './saet-mensaje-usuario.component.html',
  styleUrls: ['./saet-mensaje-usuario.component.css']
})
export class SaetMensajeUsuarioComponent {
  @Input() message:string = "";
  @Input() title:string = "";
  @Input() messageType:Type = Type.SUCCESS;
  @Input() show:boolean = false;

  type = Type;
}
