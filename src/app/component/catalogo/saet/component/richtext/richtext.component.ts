import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { KeyValue } from '../saet-input/saet-input.component';

@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.css'],
})
export class RichtextComponent {
  @Input() text: string = '';
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() testId: string = '';
  @Input() disabled: boolean = false;


  @Output() inputChange = new EventEmitter<KeyValue>();

  onInputChange(event: any, name: string) {
    const newValue = event.htmlValue;
    this.text = newValue;
    this.emitInputChange(newValue, name);
  }

  private emitInputChange(newValue: string, key: string) {
    this.inputChange.emit({
      key: key,
      value: newValue,
    });
  }
}
