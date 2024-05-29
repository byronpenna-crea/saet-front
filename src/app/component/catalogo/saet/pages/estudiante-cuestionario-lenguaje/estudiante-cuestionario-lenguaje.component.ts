import {Component, Inject} from '@angular/core';
import {IMessageComponent} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute} from "@angular/router";
import {QuestionType} from "../../shared/component.config";
import {IOptionType} from "../../component/saet-question/saet-question.component";
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
  selector: 'app-estudiante-cuestionario-lenguaje',
  templateUrl: './estudiante-cuestionario-lenguaje.component.html',
  styleUrls: ['./estudiante-cuestionario-lenguaje.component.css']
})
export class EstudianteCuestionarioLenguajeComponent implements IMessageComponent{
  showMessage:boolean = false;
  message: string = "";
  titleMessage: string = "";

  nie:string = "";
  corSurveys:iSurvey[] = [];
  studentInfo?: StudentDetail;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceCOR: CatalogoServiceCor,
    private route: ActivatedRoute
  ){
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
      }
    });

    catalogoServiceCOR.getLenguajeHablaQuestions().then((result) => {
      this.corSurveys.push(...result.cuestionarios);
    });
    catalogoServiceCOR.getStudentInfo(this.nie).then((result) => {
      this.studentInfo = result.estudiante;
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
  getName(name:string): string {
    return this.convertString(name)
  }
  getOptions(options: { id_option: number, opcion: string }[]): IOptionType[] {
    console.log('get opcion', options);
    return options.map( (option) => ({key: option.id_option ? option.id_option.toString(): "", value: option.opcion}) as IOptionType );
  }
}
