import {Component, Inject} from '@angular/core';
import {BaseComponent} from "../../BaseComponent";
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {userMessageInit} from "../../shared/messages.model";
import {QuestionsComponent} from "../../QuestionsComponent";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-estudiante-detalle-paei',
  templateUrl: './estudiante-detalle-paei.component.html',
  styleUrls: ['./estudiante-detalle-paei.component.css']
})
export class EstudianteDetallePaeiComponent extends QuestionsComponent implements IMessageComponent{

  cuestionariosTableMode: number[] = []
  userMessage: UserMessage = userMessageInit;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ){
    const especialidadTarget:string = "paei";
    super(document, catalogoServiceCOR, route, router, confirmationService, especialidadTarget);
    this.catalogoServiceCOR.getPAEIQuestions().then((result) => {
      this.corSurveys.push(...result.cuestionarios);
    });

  }
}