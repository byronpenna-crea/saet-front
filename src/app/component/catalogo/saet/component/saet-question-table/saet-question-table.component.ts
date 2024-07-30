import { Component, Input, Output, EventEmitter } from '@angular/core';
import { iSurvey } from '../../shared/survey';
import { KeyValue } from '../saet-input/saet-input.component';
import { FormMode, IValuesForm } from '../../QuestionsComponent';

@Component({
  selector: 'app-saet-question-table',
  templateUrl: './saet-question-table.component.html',
  styleUrls: ['./saet-question-table.component.css'],
})
export class SaetQuestionTableComponent {
  @Input() corSurvey?: iSurvey = undefined;
  @Output() onchangeQuestions = new EventEmitter<KeyValue>();
  @Input() getOptions?: (
    options: { id_opcion: number; opcion: string }[]
  ) => KeyValue[];
  @Input() values: IValuesForm = {};
  formModeEnum = FormMode;
  @Input() formMode: FormMode = FormMode.CREATE;
}
