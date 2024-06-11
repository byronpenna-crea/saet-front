import {Component, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {QuestionType} from "../../shared/component.config";
import {IMessageComponent, MessageType, UserMessage} from "../../interfaces/message-component.interface";
import {userMessageInit} from "../../shared/messages.model";
import {KeyValue} from "../../component/saet-input/saet-input.component";


interface IinformationTab {
  labels: string[],
  values: string[],
  legend: string,
  isActive: boolean
}
interface iQuestion {
  id_pregunta: number,
  tipoPregunta: string,
  pregunta: string,
  opcion: { id_opcion: number, opcion: string }[]
}
interface iSurvey {
  titulo: string,
  preguntas: iQuestion[]
}
@Component({
  selector: 'app-estudiante-caracterizacion-iniciar',
  templateUrl: './estudiante-caracterizacion-iniciar.component.html',
  styleUrls: ['./estudiante-caracterizacion-iniciar.component.css']
})
export class EstudianteCaracterizacionIniciarComponent implements IMessageComponent{
  userMessage: UserMessage = userMessageInit;

  nie:string = "";
  studentInfo?: StudentDetail;
  corSurveys:iSurvey[] = [];
  editMode:boolean = false;
  generalInformation:IinformationTab = {
    isActive: false,
    legend: 'Datos personales del estudiante',
    labels: [
      'Nombre completo:',
      'NIE:',
      'Fecha de nacimiento:',
      'Dirección:',
      'Teléfono:',
      'Correo electrónico:'
    ],
    values: []
  }
  institutionalInfo:IinformationTab = {
    isActive: false,
    legend: "Datos institucionales",
    labels: [
      "Centro Escolar al que pertenece:",
      "Código de Centro Escolar:",
      "Dirección de Centro Escolar:",
      "Último grado cursado:",
      "Grado actual:",
      "Sección:",
      "Docente de aula responsable:",
      "Correo electrónico de docente:",
      "Teléfono de docente:"
    ],
    values: []
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceCOR: CatalogoServiceCor,
    private route: ActivatedRoute,
    private router: Router
  ){
    const storedValues = localStorage.getItem('values');
    console.log('stored values ', storedValues);
    if (storedValues) {
      this.values = JSON.parse(storedValues);
    }

    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
      }
    });
    catalogoServiceCOR.getCORQuestions().then((result) => {
      this.corSurveys.push(...result.cuestionarios);

    });
    catalogoServiceCOR.getStudentInfo(this.nie).then((result) => {
      this.studentInfo = result.estudiante;
      this.generalInformation = {
        ...this.generalInformation,
        values: [
          result.estudiante.nombreCompleto,
          result.estudiante.nie,
          result.estudiante.fechaNacimiento,
          result.estudiante.direccion,
          result.estudiante.telefono[0],
          result.estudiante.correo
        ]
      };
      this.institutionalInfo = {
        ...this.institutionalInfo,
        values: [
          result.centroEducativo.nombre,
          result.centroEducativo.codigo,
          result.centroEducativo.direccion,
          result.centroEducativo.ultimoGradoCursado,
          result.centroEducativo.gradoActual,
          result.centroEducativo.seccion,
          result.centroEducativo.docenteOrientador,
          result.centroEducativo.correoOrientador,
          result.centroEducativo.telefonoOrientador[0]
        ]
      };
    })

  }

  QuestionType = QuestionType;
  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }
  convertString(input: string): string {
    let result = input.toLowerCase();

    const accentsMap: { [key: string]: string } = {
      'á': 'a',
      'é': 'e',
      'í': 'i',
      'ó': 'o',
      'ú': 'u',
      'ü': 'u',
      'ñ': 'n',
    };

    result = result.replace(/[áéíóúüñ]/g, match => accentsMap[match]);

    result = result.replace(/\s+/g, '_');

    return result;
  }
  async retornarCaracterizacion() {
    await this.router.navigate(["menu/saet-caracterizacion-estudiante",this.nie]);
  }
  save() {
    this.userMessage = {
      showMessage: true,
      message: "¡Los datos han sido guardados exitosamente!",
      titleMessage: "Datos guardados",
      type: MessageType.SUCCESS
    }
  }

  getName(name:string): string {
    return this.convertString(name);
  }
  values: { [key: string]: string } = {};
  onCheckboxChange(keyValues:KeyValue[]){
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  onchange(keyValue:KeyValue) {
    this.values[keyValue.key] = keyValue.value;
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  getOptions(options: { id_opcion: number, opcion: string }[]): KeyValue[] {
    return options.map( (option) => ({key: option.id_opcion ? option.id_opcion.toString(): "", value: option.opcion}) as KeyValue );
  }

}
