import {Component, Input, OnChanges, SimpleChanges, EventEmitter, Output} from '@angular/core';
import {KeyValue} from "../saet-input/saet-input.component";

@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.css']
})
export class RichtextComponent implements OnChanges{
  @Input() text: string = "";
  @Output() inputChange = new EventEmitter<KeyValue>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes["text"]) {
      console.log('Text has changed:', changes["text"].currentValue);
      this.emitInputChange(changes["text"].currentValue);
    }
  }

  onInputChange(event: any) {
    const newValue = event.htmlValue;
    this.text = newValue;
    this.emitInputChange(newValue);
  }

  private emitInputChange(newValue: string) {
    this.inputChange.emit({
      key: 'text',
      value: newValue
    });
  }
}
