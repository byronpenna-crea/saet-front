import {Component, Input, OnChanges, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {IconComponent} from "../../shared/component.config";

export enum IconDirection{
  RIGHT,
  LEFT
}
export interface SaetInputArgs {
  text: string;
  iconDirection?:IconDirection;
  icon?: IconComponent
}

@Component({
  selector: 'app-saet-input',
  templateUrl: './saet-input.component.html',
  styleUrls: ['./saet-input.component.css']
})
export class SaetInputComponent implements OnChanges{
  @Output() inputChange = new EventEmitter<string>();
  @Input() testId:string = "";
  @Input() inputArgs: SaetInputArgs = {
    text: "",
    iconDirection: IconDirection.RIGHT,
    icon: undefined
  }

  spanClases: string = "";

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.inputChange.emit(input.value);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.updateSpan();
  }


  private updateSpan() {
  }
}
