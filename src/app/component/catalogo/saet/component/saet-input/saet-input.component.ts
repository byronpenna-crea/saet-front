import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
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
  @Input() inputArgs: SaetInputArgs = {
    text: "",
    iconDirection: IconDirection.RIGHT,
    icon: undefined
  }

  spanClases: string = "";

  ngOnChanges(changes: SimpleChanges) {
    this.updateSpan();
  }


  private updateSpan() {
  }
}
