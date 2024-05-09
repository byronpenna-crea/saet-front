import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {QuestionType} from "../../shared/component.config";

interface IinformationTab {
  labels: string[],
  values: string[],
  legend: string,
  isActive: boolean
}
interface iQuestion {
  tipoPregunta: string,
  pregunta: string,
  opcion: string[]
}
interface iSurvey {
  titulo: string,
  preguntas: iQuestion[]
}
enum informationTabMapping {
  NOMBRE_COMPLETO = 0
}
@Component({
  selector: 'app-estudiante-datos-generales',
  templateUrl: './estudiante-datos-generales.component.html',
  styleUrls: ['./estudiante-datos-generales.component.css']
})


export class EstudianteDatosGeneralesComponent {
  corSurveys:iSurvey[] = [];

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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceCOR: CatalogoServiceCor,
    private cdr: ChangeDetectorRef

  ){

    catalogoServiceCOR.getQuestions().then((result) => {
      this.corSurveys.push(...result.cuestionarios);
      this.corSurveys.map((x) => {
        console.log(x);
      })
    });

    catalogoServiceCOR.getStudentInfo('20217333').then((result) => {
      this.generalInformation = {
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
        values: [
          result.estudiante.nombreCompleto,
          result.estudiante.nie,
          result.estudiante.fechaNacimiento,
          result.estudiante.direccion,
          result.estudiante.telefono[0],
          result.estudiante.correo
        ]
      };
      this.cdr.markForCheck();
    })
  }

  QuestionType = QuestionType;
  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }


}
