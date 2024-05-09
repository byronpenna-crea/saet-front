import {Component, Input} from '@angular/core';
import {QuestionType} from "../../shared/component.config";
import {SaetInputArgs} from "../saet-input/saet-input.component";

@Component({
  selector: 'app-saet-question',
  templateUrl: './saet-question.component.html',
  styleUrls: ['./saet-question.component.css']
})
export class SaetQuestionComponent {
  @Input() type:QuestionType = QuestionType.ABIERTA;
  QuestionType = QuestionType;
  abiertaComponentArgs:SaetInputArgs = {
    icon: undefined,
    text: "",
  }
}
