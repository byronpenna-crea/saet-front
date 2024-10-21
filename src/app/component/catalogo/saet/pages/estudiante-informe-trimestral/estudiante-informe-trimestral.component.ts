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
import { ButtonStyle } from '../../component/saet-button/saet-button.component';

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
  tableData: {
    number: string;
    tableHeaderStudentName: string;
    tableHeaderStudentSex: string;
    tableHeaderStudentAge: number;
    tableHeaderStudentGrade: number;
    tableHeaderStudentSchool: string;
    tableHeaderStudentCity: string;
  }[] = [];
  async btnRegresar() {
    await this.router.navigate(['menu/saet-buscar']);
  }
  reportId = 0;
  mainButtonText = 'Guardar y continuar';
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
        //const questionPromise = catalogoServiceQuarterReport.getQuestions();
        console.log(this.nie);
        const answerPromise = catalogoServiceQuarterReport.getByNie(this.nie);
        Promise.all([answerPromise]).then(
          ([answerPromise]) => {
            console.log('answer -------------------');
            console.log(answerPromise);
            console.log('answer -------------------');
            this.reportId = answerPromise.id_informe_pk;
            this.mainButtonText = 'Actualizar y continuar';
            const respuestas = this.respuestasToValues(
              answerPromise.respuestas ?? []
            );
            this.values = {
              ...this.values,
              ...respuestas,
            };
          }
        ).catch(([answerCatch]) => {
          console.log('Answer catch --------------',answerCatch);
        });
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
      id_informe_pk: this.reportId,
      id_estudiante_fk: studentId,
      respuestas: respuestas,
    };
    if(this.reportId !== 0){
      await this.catalogoServiceQuarterReport.update(objToSave);
    }else{
      await this.catalogoServiceQuarterReport.save(objToSave);
    }
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
    if (localStorage.getItem('dui') === null) {
      this.router.navigate(['/login']);
    }
    if (this.inputNIE) {
      try {
        this.pageLoading = true;
        const result = await this.catalogoServiceQuarterReport.getStudentInfo(
          this.inputNIE
        );
        const atentidos =
          await this.catalogoServiceQuarterReport.getAtendidosByDui(
            localStorage.getItem('dui') ?? ''
          );
        console.log('result here ', atentidos);
        this.tableData = [
          {
            number: '1',
            tableHeaderStudentName: 'Byron Aldair Pena',
            tableHeaderStudentSex: 'M',
            tableHeaderStudentAge: 30,
            tableHeaderStudentGrade: 9,
            tableHeaderStudentSchool: 'Ricaldone',
            tableHeaderStudentCity: 'Soyapango',
          },
        ];
        console.log('atendidos map ----------', atentidos);
        this.tableData = atentidos.map(atendido => {
          return {
            number: atendido.per_nie.toString(),
            tableHeaderStudentName: atendido.nombre_completo,
            tableHeaderStudentSex: '',
            tableHeaderStudentAge: 0,
            tableHeaderStudentGrade: 9,
            tableHeaderStudentSchool: '',
            tableHeaderStudentCity: '',
          };
        });
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
  protected readonly IconCompoment = IconComponent;
  protected readonly ButtonStyle = ButtonStyle;
}
