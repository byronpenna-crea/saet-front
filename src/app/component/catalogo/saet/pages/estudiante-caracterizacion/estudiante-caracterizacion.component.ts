import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {QuestionType} from "../../shared/component.config";
import {IOptionType} from "../../component/saet-question/saet-question.component";
interface IinformationTab {
  labels: string[],
  values: string[],
  legend: string,
  isActive: boolean
}
interface iQuestion {
  tipoPregunta: string,
  pregunta: string,
  opcion: { id_option: number, opcion: string }[]
}
interface iSurvey {
  titulo: string,
  preguntas: iQuestion[]
}
@Component({
  selector: 'app-estudiante-caracterizacion',
  templateUrl: './estudiante-caracterizacion.component.html',
  styleUrls: ['./estudiante-caracterizacion.component.css']
})
export class EstudianteCaracterizacionComponent {
  nie:string = "";
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

  corSurveys:iSurvey[] = [];
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceCOR: CatalogoServiceCor,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
      }
    });

    catalogoServiceCOR.getQuestions().then((result) => {
      this.corSurveys.push(...result.cuestionarios);
      this.corSurveys.map((x) => {
        console.log('Survey ',x);
      })
    });
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
  getName(name:string): string {
    return this.convertString(name)
  }
  getOptions(options: { id_option: number, opcion: string }[]): IOptionType[] {
    console.log('get opcion', options);
    return options.map( (option) => ({key: option.id_option ? option.id_option.toString(): "", value: option.opcion}) as IOptionType );
  }
}
