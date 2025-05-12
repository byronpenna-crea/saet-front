import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '../saet-input/saet-input.component';

@Component({
  selector: 'app-saet-checkbox',
  templateUrl: './saet-checkbox.component.html',
  styleUrls: ['./saet-checkbox.component.css'],
})
export class SaetCheckboxComponent {
  @Output() checkboxChange = new EventEmitter<KeyValue[]>();
  @Input() name: string = '';
  @Input() options: KeyValue[] = [];
  @Input() selectedValues: string[] = [];
  @Input() disabled: boolean = false;
  @Input() returnFullItem:boolean = false;
  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const isChecked = input.checked;

    if (isChecked) {
      this.selectedValues.push(value);
    } else {
      const index = this.selectedValues.indexOf(value);
      if (index > -1) {
        this.selectedValues.splice(index, 1);
      }
    }

    console.log('input checked ', isChecked);
    console.log('selected values here ', this.selectedValues);
    console.log('options ', this.options);

    let emitValues: KeyValue[];

    if (this.returnFullItem) {
      emitValues = this.selectedValues.map(val => {
        const matchingOption = this.options.find(opt => opt.value === val);
        return matchingOption
          ? { key: matchingOption.key, value: val }
          : { key: this.name, value: val };
      });
    } else {
      emitValues = this.selectedValues.length
        ? this.selectedValues.map(val => ({ key: this.name, value: val }))
        : [{ key: this.name, value: '' }];
    }

    this.checkboxChange.emit(this.returnFullItem ? emitValues : emitValues);
  }
}
