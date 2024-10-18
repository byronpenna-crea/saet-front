import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CorBaseComponent } from '../../CorBaseComponent';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import {
  ButtonStyle,
  SaetButtonArgs,
} from '../../component/saet-button/saet-button.component';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ResponseError,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { IconComponent } from '../../shared/component.config';
import { QuarterBaseComponent } from '../../QuarterBaseComponent';
import { CatalogoServiceQuarterReport } from '../../../../../services/catalogo/catalogo.service.quater_report';

@Component({
  selector: 'app-estudiante-informe-trimestral',
  templateUrl: './estudiante-informe-trimestral.component.html',
  styleUrls: ['./estudiante-informe-trimestral.component.css'],
})
export class EstudianteInformeTrimestralComponent
  extends QuarterBaseComponent
  implements IMessageComponent
{
  showTable = false;
  inputNIE = '';
  cnResult = 0;
  localStorageKey = 'quarter-values';
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceQuarterReport: CatalogoServiceQuarterReport,
    private cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    router: Router
  ) {
    super(document, catalogoServiceQuarterReport, route, router);
    try {
      this.inputNIE = this.nie;
      if (this.nie) {
        this.toggleTable();
        const storedValues = localStorage.getItem(
          `${this.localStorageKey}-${this.nie}`
        );
        if (storedValues) {
          this.values = JSON.parse(storedValues);
        }
        console.log('stored values in constructor ', this.values);
        const questionPromise = catalogoServiceQuarterReport.getQuestions();
        const answerPromise = catalogoServiceQuarterReport.getByNie(this.nie);
        Promise.all([questionPromise, answerPromise]).then(
          ([questionResult, answerPromise]) => {
            console.log('Qeustion result ', questionResult);
            console.log('answerPromise ', answerPromise);
          }
        );
      }
    } catch (e) {
      console.log('error en constructor', e);
    }
  }
  async salir() {
    await this.router.navigate(['menu/saet-buscar/', this.nie]);
  }
  async save() {
    const respuestas = this.getAnswerObject(this.values);
    console.log('respuestas ', respuestas);
  }
  values: { [key: string]: string } = {};
  onInputNIEChange(keyValue: KeyValue) {
    this.inputNIE = keyValue.value;
  }
  onInputChange(keyValue: KeyValue) {
    console.log('on change ', keyValue);
    this.values[keyValue.key] = keyValue.value;
    localStorage.setItem(
      `${this.localStorageKey}-${this.nie}`,
      JSON.stringify(this.values)
    );
  }

  cleanInput() {
    this.inputNIE = '';
    this.userMessage.showMessage = false;
    this.showTable = false;
  }
  async toggleTable() {
    this.userMessage.showMessage = false;
    if (this.inputNIE) {
      try {
        this.pageLoading = true;
        const result = await this.catalogoServiceQuarterReport.getStudentInfo(
          this.inputNIE
        );
        console.log('result here ', result);
        this.cnResult = 1;
        this.showTable = true;
      } catch (e: unknown) {
        const error = e as ResponseError;
        if (error.status === 401) {
          console.log('back to login', error.message);
        }
        this.userMessage = {
          showMessage: true,
          message: error.message,
          type: MessageType.DANGER,
        };
      } finally {
        this.pageLoading = false;
      }
    } else {
      this.userMessage = {
        showMessage: true,
        message: 'Escribe el NIE para realizar busqueda',
        titleMessage: '',
        type: MessageType.WARNING,
      };

      this.showTable = false;
    }
  }

  protected readonly IconComponent = IconComponent;
}
