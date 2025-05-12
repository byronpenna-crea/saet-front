import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionType } from '../../shared/component.config';
import { KeyValue, SaetInputArgs } from '../saet-input/saet-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saet-question',
  templateUrl: './saet-question.component.html',
  styleUrls: ['./saet-question.component.css'],
})
export class SaetQuestionComponent {
  @Input() type: QuestionType = QuestionType.ABIERTA;
  @Input() tableMode: boolean = false;
  @Input() options: KeyValue[] = [];
  @Input() name: string = '';
  @Input() testId: string = '';
  @Output() onChange = new EventEmitter<KeyValue>();
  @Output() checkboxChange = new EventEmitter<KeyValue[]>();
  @Output() textAreaChange = new EventEmitter<KeyValue>();
  @Input() value: string = '';
  @Input() values: { [key: string]: string } = {};
  @Input() storedValues: { [key: string]: string } = {};
  @Input() idPregunta: number = 0;
  @Input() readonly: boolean = false;
  constructor() {}
  isDifferent(key: string): boolean {
    return this.values[key] !== this.storedValues[key];
  }
  onCheckBoxChange(event: KeyValue[]) {
    this.checkboxChange.emit(event);
  }
  onTimeChange(event: Date){
    const hours = event.getHours().toString().padStart(2, '0');
    const minutes = event.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    console.log('time changed ', formattedTime);
    console.log('time changed ', this.idPregunta);

    this.onChange.emit({
      key: `input_${this.idPregunta.toString()}`,
      value: formattedTime
    });
  }
  onInputChange(event: KeyValue) {
    this.onChange.emit(event);
  }
  onTextAreaChange(event: KeyValue){
    this.textAreaChange.emit(event);
  }
  QuestionType = QuestionType;
  abiertaComponentArgs: SaetInputArgs = {
    icon: undefined,
    text: this.value,
  };
}
