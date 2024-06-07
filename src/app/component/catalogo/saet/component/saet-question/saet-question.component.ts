import {Component, EventEmitter, Input, Output} from '@angular/core';
import {QuestionType} from "../../shared/component.config";
import {KeyValue, SaetInputArgs} from "../saet-input/saet-input.component";
import {Router} from "@angular/router";

export interface IOptionType {
  key: string;
  value: string;
}
@Component({
  selector: 'app-saet-question',
  templateUrl: './saet-question.component.html',
  styleUrls: ['./saet-question.component.css']
})

export class SaetQuestionComponent {
  @Input() type:QuestionType = QuestionType.ABIERTA;
  @Input() options:IOptionType[] = [];
  @Input() name:string="";
  @Input() testId:string="";
  @Output() onChange = new EventEmitter<KeyValue>();
  @Input() value: string = "";
  constructor(private router: Router) {

  }
  onInputChange(event: KeyValue) {
    console.log('event in question  -------------', event);

    this.onChange.emit(event);
  }
  QuestionType = QuestionType;
  abiertaComponentArgs:SaetInputArgs = {
    icon: undefined,
    text: this.value,
  }

}
