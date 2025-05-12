import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
  readOnlyForm = true;
  tableData: {
    number: string;
    tableHeaderStudentName: string;
    tableHeaderStudentSex: string;
    tableHeaderStudentAge: number;
    tableHeaderStudentGrade: string;
    tableHeaderStudentSchool: string;
    tableHeaderStudentCity: string;
    tableHeaderStudentIssue: string;
  }[] = [];

  trimestres = [
    { numero: 1 },
    { numero: 2 },
    { numero: 3 },
    { numero: 4 }
  ];
  selectedTrimester = 0;
  currentTrimester = 0;
  override ngOnInit(): void {
    super.initialize();
    this.init();
    this.setDefaultTrimester();
  }
  @ViewChild('bottomAnchor') override bottomAnchor!: ElementRef<HTMLDivElement>;
  @ViewChild('topAnchor') override topAnchor!: ElementRef<HTMLDivElement>;

  init() {
    this.route.paramMap.subscribe(() => {
      const storedValues = localStorage.getItem(this.localStorageKey);
      console.log(`stored values -> %%% ${this.localStorageKey}`, storedValues);
      if (storedValues) {
        this.values = JSON.parse(storedValues);
      }
    })
  }
  isTrimesterEnabled(numero: number): boolean {
    return numero <= this.currentTrimester;
  }
  onToggleEdit(row: any): void {
    if (row.editing) {
      this.onSaveDifficulty(row);
    }
    row.editing = !row.editing;
  }

  onSaveDifficulty(row: any): void {
    console.log('Guardar dificultad:', row.difficultyDescription);
  }
  setDefaultTrimester() {
    const currentMonth = new Date().getMonth() + 1; // Enero es 0
    if (currentMonth >= 1 && currentMonth <= 3) {
      this.selectedTrimester = 1;
    } else if (currentMonth >= 4 && currentMonth <= 6) {
      this.selectedTrimester = 2;
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      this.selectedTrimester = 3;
    } else {
      this.selectedTrimester = 4;
    }
    this.currentTrimester = this.selectedTrimester;
  }
  async onSelectTrimester(trimestre: number) {
    this.pageLoading = true;
    this.selectedTrimester = trimestre;
    await this.loadAnswers();
    this.pageLoading = false;
  }
  breadcrumb = [
    { href: '#/menu/saet-inicio', text: 'Inicio' },
  ]
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
  async loadAnswers() {
    this.readOnlyForm = true;
    Object.keys(this.values).forEach(key => {
      if (key.startsWith('richtext_')) {
        this.values[key] = '';
      }
    });
    console.log('selected trimester ', this.selectedTrimester);
    console.log('current trimester ', this.currentTrimester);
    try {
      const answers = await this.catalogoServiceQuarterReport.getAnswers(2025, this.selectedTrimester);
      const storedValues = localStorage.getItem(this.localStorageKey);
      if (storedValues) {
        this.values = JSON.parse(storedValues);
      }
      if(this.selectedTrimester === this.currentTrimester){
        this.readOnlyForm = false;
      }
      console.log('load answers----> #', answers && answers.respuestas);
      console.log('load values----> #', this.values);
      console.log('load values cleaned----> #',this.values);
      if (answers && answers.respuestas) {
        this.reportId = answers.id_informe_pk;
        this.mainButtonText = 'Actualizar y continuar';
        this.storedValues = {};
        for (const respuesta of answers.respuestas) {

          const inputKey = `richtext_${respuesta.id_pregunta}`;
          this.storedValues[inputKey] = respuesta.respuesta ?? '';
        }
      }
      console.log('STORED VALUES HERE ', this.storedValues);
      console.log('VALUES HERE ', this.values);
      this.values = {
        ...this.storedValues,
        ...this.values,
      };
      this.updateHighlights();
      console.log('stored ###########', this.storedValues);
      console.log('values ###########', this.values);
    } catch (e) {
      console.error('Error cargando respuestas:', e);
    }
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
      this.setDefaultTrimester();
      this.toggleTable();
      const answerPromise = catalogoServiceQuarterReport.get();
      try {
        catalogoServiceQuarterReport.getAnswers(2025,this.selectedTrimester )?.then((data) => {
          console.log('promise 2 zzz>>', data);
        });
      }catch (e){
        console.log('error en promise 2', e);
      }

      Promise.all([answerPromise])
        .then(([answerPromise]) => {
          console.log('answer -------------------');
          console.log(answerPromise);
          console.log('answer -------------------');
          this.reportId = answerPromise.id_informe_pk;
          this.mainButtonText = 'Actualizar y continuar';
          const respuestas = this.respuestasToValues(
            answerPromise.respuestas ?? []
          );
          this.values = {
            ...respuestas,
            ...this.values,
          };
        })
        .catch(([answerCatch]) => {
          console.log('Answer catch --------------', answerCatch);
        });
      const storedValues = localStorage.getItem(
        `${this.localStorageKey}-${this.nie}`
      );
      if (storedValues) {
        this.values = JSON.parse(storedValues);
      }
      this.loadAnswers();
    } catch (e) {
      console.log('error en constructor', e);
    }
  }
  async salir() {
    await this.router.navigate(['menu/saet-inicio']);
  }
  async save() {
    this.pageLoading = true;
    this.userMessage.showMessage = false;

    const respuestas = this.getAnswerObject(this.values);

    const objToSave: ISaveQuarterReport = {
      id_informe_pk: this.reportId,
      respuestas: respuestas,
      trimester: this.selectedTrimester,
      anio: 2025
    };
    console.log('obj to save ---> ', objToSave);
    console.log('report id ---> ', this.reportId);


    if (this.reportId !== 0) {
      const updated = await this.catalogoServiceQuarterReport.update(objToSave);
      console.log('updated obj', updated);
      for (const respuesta of updated.respuestas) {
        const inputKey = `richtext_${respuesta.id_pregunta}`;
        this.storedValues[inputKey] = respuesta.respuesta ?? '';
      }
      this.updateHighlights();
    } else {
      await this.catalogoServiceQuarterReport.save(objToSave);
    }

    this.pageLoading = false;
    this.userMessage.showMessage = true;
    this.userMessage.type = MessageType.SUCCESS;
    this.userMessage.message = '¡Los datos han sido guardados exitosamente!';
    this.userMessage.titleMessage = 'Datos actualizados';
  }
  highlight: { [key: string]: boolean } = {};
  values: { [key: string]: string } = {};
  storedValues: { [key: string]: string } = {};
  onInputNIEChange(keyValue: KeyValue) {
    this.inputNIE = keyValue.value;
  }
  isDifferent(key: string): boolean {
    const value = this.values[key] !== null && this.values[key] !== undefined  ? this.values[key] : '';
    const storedValue = this.storedValues[key] !== null && this.storedValues[key] !== undefined  ? this.storedValues[key] : '';
    console.log('stored -->',storedValue);
    console.log('value -->',value);
    console.log('------------');
    return value !== storedValue;
  }
  updateHighlights() {
    this.highlight = {};
    for (const key of Object.keys(this.values)) {
      this.highlight[key] = this.isDifferent(key);
    }
  }
  onInputChange(keyValue: KeyValue) {
    console.log('on change ', keyValue);
    this.values[keyValue.key] = keyValue.value;
    this.highlight[keyValue.key] = this.isDifferent(keyValue.key);
    localStorage.setItem(
      `${this.localStorageKey}`,
      JSON.stringify(this.values)
    );
  }

  cleanInput() {
    this.inputNIE = '';
    this.userMessage.showMessage = false;
    this.showTable = false;
  }
  dataLoadedWithoutResults = false;
  async toggleTable() {
    console.log('toggle table ');
    this.userMessage.showMessage = false;
    if (localStorage.getItem('dui') === null) {
      await this.router.navigate(['/login']);
    }
    try {
      this.pageLoading = true;
      const atentidos =
        await this.catalogoServiceQuarterReport.getAtendidosByDui(
          localStorage.getItem('dui') ?? ''
        );
      console.log('result here ', atentidos);
      this.tableData = [];
      console.log('atendidos map ----------', atentidos);
      this.tableData = atentidos.map(atendido => {
        return {
          number: '',
          tableHeaderStudentName: `${atendido.nombres} ${atendido.apellidos}`,
          tableHeaderStudentSex: atendido.sexo,
          tableHeaderStudentAge: atendido.edad,
          tableHeaderStudentGrade: atendido.grado,
          tableHeaderStudentSchool: atendido.centroEducativo,
          tableHeaderStudentCity: atendido.municipio,
          tableHeaderStudentIssue: atendido.dificultades.length > 0 ? atendido.dificultades.map((dificultad) => {
            return `<span>${dificultad.dificultad}</span><br />`;
          }).join('') : 'Ninguna'
        };
      });
      this.cnResult = 1;
      this.showTable = true;
    } catch (e: unknown) {
      console.log('error here --> ',e);
      const error = e as ResponseError;
      if (error.status === 401) {
        console.log('back to login', error.message);
      }
      if(error.status === 404){
        this.showTable = true;
        /*this.tableData = [
          {
            number: '1',
            tableHeaderStudentName: 'Byron Aldair Pena',
            tableHeaderStudentSex: 'M',
            tableHeaderStudentAge: 30,
            tableHeaderStudentGrade: 9,
            tableHeaderStudentSchool: 'Ricaldone',
            tableHeaderStudentCity: 'Soyapango',
          },
        ]*/
        console.log('table data length', this.tableData.length);
        return;
      }
      this.userMessage = {
        showMessage: true,
        message: error.message,
        type: MessageType.DANGER,
      };
    } finally {
      this.pageLoading = false;
    }

  }

  protected readonly IconComponent = IconComponent;
  protected readonly ButtonStyle = ButtonStyle;
}
