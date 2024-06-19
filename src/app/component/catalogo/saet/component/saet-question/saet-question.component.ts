import {Component, EventEmitter, Input, Output} from '@angular/core';
import {QuestionType} from "../../shared/component.config";
import {KeyValue, SaetInputArgs} from "../saet-input/saet-input.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-saet-question',
  templateUrl: './saet-question.component.html',
  styleUrls: ['./saet-question.component.css']
})

export class SaetQuestionComponent {
  @Input() type:QuestionType = QuestionType.ABIERTA;
  @Input() tableMode:boolean = false;
  @Input() options:KeyValue[] = [];
  @Input() name:string="";
  @Input() testId:string="";
  @Output() onChange = new EventEmitter<KeyValue>();
  @Output() checkboxChange = new EventEmitter<KeyValue[]>();
  @Input() value: string = "";
  @Input() idPregunta: number = 0;
  @Input() readonly: boolean = false;
  constructor(private router: Router) {
  }
  onCheckBoxChange(event: KeyValue[]){
    this.checkboxChange.emit(event);
  }
  onInputChange(event: KeyValue) {
    this.onChange.emit(event);
  }
  QuestionType = QuestionType;
  abiertaComponentArgs:SaetInputArgs = {
    icon: undefined,
    text: this.value,
  }

}
