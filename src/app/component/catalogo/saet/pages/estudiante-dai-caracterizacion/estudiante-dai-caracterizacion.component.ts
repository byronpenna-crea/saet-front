import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../BaseComponent';
import {
  IMessageComponent,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { DOCUMENT } from '@angular/common';
import { CatalogoServiceCor } from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { iSurvey } from '../../shared/survey';
import { QuestionType } from '../../shared/component.config';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { FormMode } from '../../QuestionsComponent';

@Component({
  selector: 'app-estudiante-dai-caracterizacion',
  templateUrl: './estudiante-dai-caracterizacion.component.html',
  styleUrls: ['./estudiante-dai-caracterizacion.component.css'],
})
export class EstudianteDaiCaracterizacionComponent
  extends BaseComponent
  implements IMessageComponent, OnInit
{
  @ViewChild('cd') confirmDialog: any;
  userMessage: UserMessage = userMessageInit;
  values: { [key: string]: string } = {};
  corSurveys: iSurvey[] = [];
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService
  ) {
    super(document, catalogoServiceCOR, route, router);
    catalogoServiceCOR.getDaiCaracterizacionQuestion().then(result => {
      this.corSurveys.push(...result.cuestionarios);
    });
  }
  formMode: FormMode = FormMode.CREATE;
  formModeEnum = FormMode;
  override async ngOnInit() {
    await super.ngOnInit();
    this.route.paramMap.subscribe(params => {
      const storedValues = localStorage.getItem(
        `dai-caracterizacion-${this.nie}`
      );
      if (storedValues) {
        this.values = JSON.parse(storedValues);
      }
    });
  }

  async salir() {
    this.confirmationService.confirm({
      message:
        'Al darle click en <b>Salir de edición sin guardar</b> perderá todo el progreso de edición realizado.',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('acept');
      },
      reject: () => {
        console.log('reject');
      },
    });
  }

  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem(
      `dai-caracterizacion-${this.nie}`,
      JSON.stringify(this.values)
    );
  }
  onchange(keyValue: KeyValue) {
    console.log('onchange triggered', keyValue);
    this.values[keyValue.key] = keyValue.value;
    console.log('onchange triggered values', this.values);
    localStorage.setItem(
      `dai-caracterizacion-${this.nie}`,
      JSON.stringify(this.values)
    );
  }
  acceptConfirmDialog() {
    this.confirmationService.close();
  }
  convertString(input: string): string {
    let result = input.toLowerCase();

    const accentsMap: { [key: string]: string } = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      ü: 'u',
      ñ: 'n',
    };

    result = result.replace(/[áéíóúüñ]/g, match => accentsMap[match]);

    result = result.replace(/\s+/g, '_');

    return result;
  }
  getName(name: string): string {
    return this.convertString(name);
  }
  getOptions(options: { id_opcion: number; opcion: string }[]): KeyValue[] {
    return options.map(
      option =>
        ({
          key: option.id_opcion ? option.id_opcion.toString() : '',
          value: option.opcion,
        }) as KeyValue
    );
  }
  async rejectConfirmDialog() {
    await this.router.navigate([
      'menu/saet-caracterizacion-estudiante',
      this.nie,
    ]);
  }
  async entrarEditMode() {}
  async save() {}
  async retornarCaracterizacion() {}
  async update() {}
  async generatePDF() {}
}
