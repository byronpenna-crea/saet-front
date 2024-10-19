import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  IMessageComponent,
  MessageType,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import { ResponseError } from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { IconComponent } from '../../shared/component.config';
import { QuarterBaseComponent } from '../../QuarterBaseComponent';
import {
  CatalogoServiceQuarterReport,
  ISaveQuarterReport,
} from '../../../../../services/catalogo/catalogo.service.quater_report';
import { iQuestion, iQuestionSave } from '../../shared/survey';
import { IValuesForm } from '../../QuestionsComponent';

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
  respuestasToValues(respuestas: iQuestion[]) {
    const values: IValuesForm = {};
    respuestas.forEach(respuesta => {
      const radioKey = `radio_${respuesta.id_pregunta}`;
      const inputKey = `richtext_${respuesta.id_pregunta}`;

      if (respuesta.opcion !== undefined && respuesta.opcion.length > 0) {
        values[radioKey] = respuesta.opcion[0].opcion_pregunta_pk.toString();
      }
      values[inputKey] = respuesta.respuesta ?? '';
    });
    return values;
  }
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

        /*
         */

        console.log('stored values in constructor ', this.values);
        const questionPromise = catalogoServiceQuarterReport.getQuestions();
        const answerPromise = catalogoServiceQuarterReport.getByNie(this.nie);
        Promise.all([questionPromise, answerPromise]).then(
          ([questionResult, answerPromise]) => {
            console.log('Qeustion result ', questionResult);
            console.log('answerPromise ', answerPromise.respuestas);
            const respuestas = this.respuestasToValues(
              answerPromise.respuestas ?? []
            );
            this.values = {
              ...this.values,
              ...respuestas,
            };
          }
        );
        const storedValues = localStorage.getItem(
          `${this.localStorageKey}-${this.nie}`
        );
        if (storedValues) {
          this.values = JSON.parse(storedValues);
        }
      }
    } catch (e) {
      console.log('error en constructor', e);
    }
  }
  async salir() {
    await this.router.navigate(['menu/saet-buscar/', this.nie]);
  }
  async save() {
    console.log('to save xxxx----');
    const respuestas = this.getAnswerObject(this.values);
    console.log('respuestas here ', respuestas);
    const studentId = this.studentInfo?.id_est_pk ?? 0;
    if (studentId === 0) {
      this.userMessage.showMessage = true;
      this.userMessage.message = 'El estudiante es requerido';
      this.userMessage.type = MessageType.WARNING;
      return;
    }

    const objToSave: ISaveQuarterReport = {
      id_estudiante_fk: studentId,
      respuestas: respuestas,
    };
    await this.catalogoServiceQuarterReport.save(objToSave);
    console.log('respuestas to save', objToSave);
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
