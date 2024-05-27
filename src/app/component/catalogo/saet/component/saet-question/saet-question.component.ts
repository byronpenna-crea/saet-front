import {Component, Input} from '@angular/core';
import {QuestionType} from "../../shared/component.config";
import {SaetInputArgs} from "../saet-input/saet-input.component";
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

  constructor(private router: Router) {
    console.log('options ', this.options);
  }
  QuestionType = QuestionType;
  abiertaComponentArgs:SaetInputArgs = {
    icon: undefined,
    text: "",
  }

}
