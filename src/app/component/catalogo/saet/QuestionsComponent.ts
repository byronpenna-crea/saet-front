import {Inject, Injectable} from "@angular/core";
import {CatalogoServiceCor, StudentDetail} from "../../../services/catalogo/catalogo.service.cor";
import {DOCUMENT} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseComponent} from "./BaseComponent";
import {IconComponent, QuestionType} from "./shared/component.config";
import {iSurvey} from "./shared/survey";
import {KeyValue} from "./component/saet-input/saet-input.component";
import {TIPO_EVALUACION} from "./shared/evaluaciones";
import {ConfirmationService} from "primeng/api";


export interface IValuesForm {
  [key: string]: string;
}

export interface IAnswerOption {
  id_opcion: number;
  opcion: string;
}

export interface IQuestionaryAnswer {
  id_pregunta: number;
  opcion: IAnswerOption[];
  respuesta: string;
}
@Injectable()
export class QuestionsComponent extends BaseComponent {
  corSurveys:iSurvey[] = [];

  values: IValuesForm = {};
  valuesKey:string = "";
  showActionButtons:boolean = false;

  iconCompoment = IconComponent;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService,
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
    console.log('onchange ', keyValue);
    this.values[keyValue.key] = keyValue.value;
    localStorage.setItem(this.valuesKey, JSON.stringify(this.values));
  }
  getQuestionaryObject() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const fecha = `${day}/${month}/${year}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const hora = `${hours}:${minutes}`;

    return {
      id_evaluacion: null,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_especialista: 3,
      id_tipo_evaluacion: TIPO_EVALUACION.psicologo_perfil,
      fecha: fecha,
      hora: hora,
      respuestas: this.getAnswerObject(this.values)
    };
  }
  getAnswerObject(data: IValuesForm): IQuestionaryAnswer[] {
    const result: IQuestionaryAnswer[] = [];

    const keys = Object.keys(data);

    const groupedData = keys.reduce<Record<string, { radio?: string; input?: string }>>((acc, key) => {
      const [type, id] = key.split('_');
      if (!acc[id]) {
        acc[id] = {};
      }
      if (type === 'radio' || type === 'input') {
        acc[id][type] = data[key];
      }
      return acc;
    }, {});

    for (const id in groupedData) {
      if (groupedData.hasOwnProperty(id)) {
        const item: IQuestionaryAnswer = {
          id_pregunta: parseInt(id, 10),
          opcion: [
            {
              id_opcion: parseInt(id, 10),
              opcion: groupedData[id].radio || ""
            }
          ],
          respuesta: groupedData[id].input || "Esta es una prueba para crear evaluacion psicologica"
        };
        result.push(item);
      }
    }

    return result;
  }


  async aceptarSalir() {
    await this.router.navigate(["menu/saet-evaluaciones",this.nie]);
  }
  async continuarEditando() {
    this.confirmationService.close();
  }
  salir() {
    this.confirmationService.confirm({
      message: 'Al darle click en <b>Salir de edición sin guardar</b> perderá todo el progreso de edición realizado.',
      icon: 'pi pi-exclamation-triangle'
    });
  }
}
