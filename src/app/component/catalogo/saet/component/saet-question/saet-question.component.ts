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
  @Output() blurChange = new EventEmitter<KeyValue>();
  @Output() checkboxChange = new EventEmitter<KeyValue[]>();
  @Output() textAreaChange = new EventEmitter<KeyValue>();
  @Input() value: string = '';
  @Input() values: { [key: string]: string } = {};
  @Input() storedValues: { [key: string]: string } = {};
  @Input() idPregunta: number = 0;
  @Input() readonly: boolean = false;
  highlightRichText: { [key: string]: boolean } = {};
  constructor() {}
  isDifferent(key: string): boolean {
    const value =
      this.values[key] !== null && this.values[key] !== undefined
        ? this.values[key]
        : '';
    const storedValue =
      this.storedValues[key] !== null && this.storedValues[key] !== undefined
        ? this.storedValues[key]
        : '';
    console.log('value 1', value);
    console.log('storedvalue 2', storedValue);
    return value !== storedValue;
  }
  isDifferentRichText(key: string): boolean {
    const rawValue = this.values[key] ?? '';
    const rawStoredValue = this.storedValues[key] ?? '';

    // Función para normalizar HTML
    const normalizeHtml = (html: string): string => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return doc.body.innerHTML.trim();
    };

    const value = normalizeHtml(rawValue);
    const storedValue = normalizeHtml(rawStoredValue);

    console.log('Normalized value:', value);
    console.log('Normalized storedValue:', storedValue);

    return value !== storedValue;
  }
  onCheckBoxChange(event: KeyValue[]) {
    this.checkboxChange.emit(event);
  }
  onTimeChange(event: Date) {
    const hours = event.getHours().toString().padStart(2, '0');
    const minutes = event.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    console.log('time changed ', formattedTime);
    console.log('time changed ', this.idPregunta);

    this.onChange.emit({
      key: `input_${this.idPregunta.toString()}`,
      value: formattedTime,
    });
  }
  onInputChange(event: KeyValue) {
    this.onChange.emit(event);
  }
  onBlurRichTextChange(event: KeyValue) {
    console.log('blur inside', event);

    const changed = this.isDifferentRichText(event.key);
    this.highlightRichText[event.key] = changed;

    this.blurChange.emit(event);
    console.log('blur emmited');
  }
  onTextAreaChange(event: KeyValue) {
    this.textAreaChange.emit(event);
  }
  QuestionType = QuestionType;
  abiertaComponentArgs: SaetInputArgs = {
    icon: undefined,
    text: this.value,
  };
}
