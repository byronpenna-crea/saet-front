import {Component, Input, OnChanges, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {IconComponent} from "../../shared/component.config";

export enum IconDirection{
  RIGHT,
  LEFT
}
export interface SaetInputArgs {
  text?: string;
  iconDirection?:IconDirection;
  icon?: IconComponent
}
export interface KeyValue {
  key: string;
  value: string;
}
@Component({
  selector: 'app-saet-input',
  templateUrl: './saet-input.component.html',
  styleUrls: ['./saet-input.component.css']
})
export class SaetInputComponent implements OnChanges{
  @Output() inputChange = new EventEmitter<KeyValue>();
  @Input() testId:string = "";
  @Input() value:string = "";
  @Input() name:string = "";
  @Input() inputArgs: SaetInputArgs = {
    iconDirection: IconDirection.RIGHT,
    icon: undefined
  }
  @Input() disabled:boolean = false;
  spanClases: string = "";

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.inputChange.emit({
      key: input.name,
      value: input.value
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.updateSpan();
  }


  private updateSpan() {
  }
}
