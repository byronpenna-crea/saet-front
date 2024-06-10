import {Component, Input, Output, EventEmitter} from '@angular/core';
import {KeyValue} from "../saet-input/saet-input.component";

@Component({
  selector: 'app-saet-checkbox',
  templateUrl: './saet-checkbox.component.html',
  styleUrls: ['./saet-checkbox.component.css']
})
export class SaetCheckboxComponent {
  @Output() checkboxChange = new EventEmitter<KeyValue[]>();
  @Input() name: string = "";
  @Input() options: KeyValue[] = [];
  @Input() selectedValues: string[] = [];
  @Input() disabled: boolean = false;

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('input ', input);
    if (input.checked) {
      this.selectedValues.push(input.value);
    } else {
      const index = this.selectedValues.indexOf(input.value);
      if (index > -1) {
        this.selectedValues.splice(index, 1);
      }
    }
    this.checkboxChange.emit(this.selectedValues.map(value => ({ key: this.name, value }))
    );

  }
}
