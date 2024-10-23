import {Component, Inject, ViewChild} from '@angular/core';
import {DaiBaseComponent} from "../../DaiBaseComponent";
import {IMessageComponent} from "../../interfaces/message-component.interface";
import {iSurvey} from "../../shared/survey";
import {SAET_MODULE} from "../../shared/evaluaciones";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceDai} from "../../../../../services/catalogo/catalogo.service.dai";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";
import {QuestionType} from "../../shared/component.config";
import {KeyValue} from "../../component/saet-input/saet-input.component";
import {FormMode} from "../../QuestionsComponent";

@Component({
  selector: 'app-dai-plan-de-accion-iniciar',
  templateUrl: './dai-plan-de-accion-iniciar.component.html',
  styleUrls: ['./dai-plan-de-accion-iniciar.component.css']
})
export class DaiPlanDeAccionIniciarComponent
  extends DaiBaseComponent
  implements IMessageComponent
{
  @ViewChild('cd') confirmDialog: any;
  values: { [key: string]: string } = {};
  corSurveys: iSurvey[] = [];
  baseUrl = '/menu/dai/plan-accion-iniciar';


  protected readonly SAET_MODULE = SAET_MODULE;

  acceptConfirmDialog() {
    this.confirmationService.close();
  }
  async rejectConfirmDialog() {
    await this.router.navigate([
      'dai/saet-caracterizacion-estudiante/',
      this.nie,
    ]);
  }
  idEvaluacion = 0;
  valuesKey = '';
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceDai: CatalogoServiceDai,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService
  ) {
    super(document, catalogoServiceDai, route, router);
    this.pageLoading = true;
    const _valuesKey = `${this.nie}_plan_accion_values`;
    this.valuesKey = _valuesKey;
    const planAccionPromise =
      this.catalogoServiceDai.getPlanAccionQuestion();
    Promise.all([planAccionPromise])
      .then(([planAccionResult]) => {
        console.log('result here ', planAccionResult);
        this.corSurveys.push(...planAccionResult.cuestionarios);

      })
    this.pageLoading = false;
  }

  onchangeQuestions(keyValue: KeyValue) {
    console.log('onchange ', keyValue);
    this.values[keyValue.key] = keyValue.value;
    localStorage.setItem(this.valuesKey, JSON.stringify(this.values));
  }
  getQuestionType(type: string): QuestionType {
    return QuestionType[type as keyof typeof QuestionType];
  }
  getName(name: string): string {
    return this.convertString(name);
  }
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  formModeEnum = FormMode;
  formMode: FormMode = FormMode.CREATE;
  getOptions(options: { id_opcion: number; opcion: string }[]): KeyValue[] {
    return options.map(
      option =>
        ({
          key: option.id_opcion ? option.id_opcion.toString() : '',
          value: option.opcion,
        }) as KeyValue
    );
  }
}
