import {Component, EventEmitter, Input, Output} from '@angular/core';
import {KeyValue} from "../saet-input/saet-input.component";

@Component({
  selector: 'app-saet-individual-radio',
  templateUrl: './saet-individual-radio.component.html',
  styleUrls: ['./saet-individual-radio.component.css']
})
export class SaetIndividualRadioComponent {

  @Output() radioChange = new EventEmitter<KeyValue>();
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() selectedValue: string = '';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() checked: boolean = false;

  onRadioChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedValue = input.value;
    this.radioChange.emit({
      key: input.name,
      value: input.value,
    });
  }
}
