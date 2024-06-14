import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IconComponent} from "../../shared/component.config";

@Component({
  selector: 'app-saet-confirm',
  templateUrl: './saet-confirm.component.html',
  styleUrls: ['./saet-confirm.component.css']
})
export class SaetConfirmComponent {
  @Input() title: string = "";
  @Input() acceptButtonText: string = "";
  @Input() cancelButtonText: string = "";
  @Input() acceptIcon?: IconComponent = undefined;
  @Input() rejectIcon?: IconComponent = undefined;
  @Output() onAccept = new EventEmitter<void>();
  @Output() onReject = new EventEmitter<void>();

  iconComponent: IconComponent = IconComponent.PLUS;
  reject() {
    this.onReject.emit();
  }
  accept() {
    this.onAccept.emit();
  }
}
