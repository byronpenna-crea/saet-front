import {Component, Output, EventEmitter, Input} from '@angular/core';
import {KeyValue} from "../saet-input/saet-input.component";

@Component({
  selector: 'app-saet-radio',
  templateUrl: './saet-radio.component.html',
  styleUrls: ['./saet-radio.component.css']
})
export class SaetRadioComponent {
  @Output() radioChange = new EventEmitter<KeyValue>();
  @Input() name: string = "";
  @Input() options: KeyValue[] = [];
  @Input() selectedValue: string = "";
  @Input() disabled: boolean = false;

  onRadioChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('options', this.options);
    console.log('input ', input);
    console.log('selected before ', this.selectedValue);
    this.selectedValue = input.value;
    this.radioChange.emit({
      key: input.name,
      value: input.value
    });
  }
}
