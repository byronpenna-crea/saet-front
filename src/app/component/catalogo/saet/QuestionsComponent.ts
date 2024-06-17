import {Inject, Injectable} from "@angular/core";
import {CatalogoServiceCor, StudentDetail} from "../../../services/catalogo/catalogo.service.cor";
import {DOCUMENT} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseComponent} from "./BaseComponent";
import {QuestionType} from "./shared/component.config";
import {iSurvey} from "./shared/survey";
import {KeyValue} from "./component/saet-input/saet-input.component";

@Injectable()
export class QuestionsComponent extends BaseComponent {
  corSurveys:iSurvey[] = [];
  values: { [key: string]: string } = {};
  valuesKey:string = "";
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    @Inject(DOCUMENT) _valuesKey:string
  ){
    super(document, catalogoServiceCOR, route, router);
    this.valuesKey = _valuesKey;
    const storedValues = localStorage.getItem(_valuesKey);
    if (storedValues) {
      this.values = JSON.parse(storedValues);
    }
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
  getOptions(options: { id_opcion: number, opcion: string }[]): KeyValue[] {
    return options.map( (option) => ({key: option.id_opcion ? option.id_opcion.toString(): "", value: option.opcion}) as KeyValue );
  }

  onchangeQuestions(keyValue:KeyValue) {
    this.values[keyValue.key] = keyValue.value;
    localStorage.setItem(this.valuesKey, JSON.stringify(this.values));
  }
  salir() {
    console.log('salir ', this.values);
  }
}
