import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KeyValue } from '../saet-input/saet-input.component';

@Component({
  selector: 'app-saet-text-area',
  templateUrl: './saet-text-area.component.html',
  styleUrls: ['./saet-text-area.component.css'],
})
export class SaetTextAreaComponent {
  @Output() inputChange = new EventEmitter<KeyValue>();
  @Input() disabled: boolean = false;
  @Input() value: string = '';
  @Input() name: string = '';
  @Input() testId: string = '';
  onInputChange(newValue: string) {
    this.inputChange.emit({
      key: this.name,
      value: newValue,
    });
  }
}
