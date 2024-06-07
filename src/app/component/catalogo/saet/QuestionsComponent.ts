import {Inject, Injectable} from "@angular/core";
import {CatalogoServiceCor, StudentDetail} from "../../../services/catalogo/catalogo.service.cor";
import {DOCUMENT} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseComponent} from "./BaseComponent";
import {IOptionType} from "./component/saet-question/saet-question.component";
import {QuestionType} from "./shared/component.config";
import {iSurvey} from "./shared/survey";

@Injectable()
export class QuestionsComponent extends BaseComponent {
  corSurveys:iSurvey[] = [];
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router
  ){
    super(document, catalogoServiceCOR, route, router);
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