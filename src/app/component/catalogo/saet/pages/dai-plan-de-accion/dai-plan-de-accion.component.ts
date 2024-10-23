import {Component, Inject, ViewChild} from '@angular/core';
import {DaiBaseComponent} from "../../DaiBaseComponent";
import {IMessageComponent} from "../../interfaces/message-component.interface";
import {iQuestion, iSurvey} from "../../shared/survey";
import {IValuesForm} from "../../QuestionsComponent";
import {SAET_MODULE} from "../../shared/evaluaciones";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceDai} from "../../../../../services/catalogo/catalogo.service.dai";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";
import {TabInput} from "../estudiante-evaluaciones/estudiante-evaluaciones.component";
import {ButtonStyle} from "../../component/saet-button/saet-button.component";
import {IconComponent} from "../../shared/component.config";

@Component({
  selector: 'app-dai-plan-de-accion',
  templateUrl: './dai-plan-de-accion.component.html',
  styleUrls: ['./dai-plan-de-accion.component.css']
})
export class DaiPlanDeAccionComponent
  extends DaiBaseComponent
  implements IMessageComponent
{
  @ViewChild('cd') confirmDialog: any;
  values: { [key: string]: string } = {};
  corSurveys: iSurvey[] = [];
  baseUrl = '/menu/dai/plan-accion';
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceDai: CatalogoServiceDai,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService
  ) {
    super(document, catalogoServiceDai, route, router);
    this.pageLoading = true;
    this.pageLoading = false;
  }
  respuestasToValues(respuestas: iQuestion[]) {
    const values: IValuesForm = {};
    respuestas.forEach(respuesta => {
      const radioKey = `radio_${respuesta.id_pregunta}`;
      const inputKey = `input_${respuesta.id_pregunta}`;

      if (respuesta.opcion.length > 0) {
        values[radioKey] = respuesta.opcion[0].opcion_pregunta_pk.toString();
      }
      values[inputKey] = respuesta.respuesta ?? '';
    });
    return values;
  }

  protected readonly SAET_MODULE = SAET_MODULE;
  async iniciar() {
    await this.router.navigate(['/menu/saet-lenguaje-habla/', this.nie]);
  }
  acceptConfirmDialog() {
    this.confirmationService.close();
  }
  async rejectConfirmDialog() {
    await this.router.navigate([
      'dai/saet-caracterizacion-estudiante/',
      this.nie,
    ]);
  }
  agendaTabs: TabInput[] = [];
  protected readonly ButtonStyle = ButtonStyle;
  protected readonly IconComponent = IconComponent;
  protected readonly buttonStyle = ButtonStyle;
  protected readonly buttonIcon = IconComponent;
}
