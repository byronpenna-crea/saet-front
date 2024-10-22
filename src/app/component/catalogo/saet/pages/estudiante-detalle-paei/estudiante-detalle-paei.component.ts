import { Component, Inject } from '@angular/core';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  iPaeiSave,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { userMessageInit } from '../../shared/messages.model';
import {
  IQuestionaryAnswer,
  QuestionsComponent,
} from '../../QuestionsComponent';
import { ConfirmationService } from 'primeng/api';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';
import { KeyValue } from '../../component/saet-input/saet-input.component';

@Component({
  selector: 'app-estudiante-detalle-paei',
  templateUrl: './estudiante-detalle-paei.component.html',
  styleUrls: ['./estudiante-detalle-paei.component.css'],
})
export class EstudianteDetallePaeiComponent
  extends QuestionsComponent
  implements IMessageComponent
{
  cuestionariosTableMode: number[] = [];
  btnIcon = IconComponent;
  loadingMessage?: string = undefined;
  paeiId = 0;
  idPersona = 0;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ) {
    const especialidadTarget = 'paei';
    super(
      document,
      catalogoServiceCOR,
      route,
      router,
      confirmationService,
      especialidadTarget
    );
    this.showActionButtons = true;
    this.pageLoading = true;
    const idPersonaStr = localStorage.getItem('id_persona') ?? '0';
    this.idPersona = isNaN(parseInt(idPersonaStr, 10))
      ? 0
      : parseInt(idPersonaStr, 10)
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
        this.catalogoServiceCOR.getPAEIPerNIE(this.nie).then((response) => {
          console.log('response PAEI ---------- ', response);
          this.paeiId = response.id_paei;
          console.log('this.formMode --- > ',this.formMode)
          this.handleMode(
            response.id_paei,
            'menu/saet-paei-detalle',
            this.formMode
          );
        }).catch((ex) => {
          console.log('ex ---- ', ex);
        })
      }
    });
    this.catalogoServiceCOR.getPAEIQuestions().then(result => {
      this.corSurveys.push(...result.cuestionarios);
      this.pageLoading = false;
    });
  }
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  async save() {
    this.pageLoading = true;
    const respuestas: IQuestionaryAnswer[] = this.getAnswerObject(this.values);
    const objToSave: iPaeiSave = {
      id_paei: this.paeiId,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_estado: 1,
      nie: parseInt(this.nie),
      id_especialista: this.idPersona,
      id_coordinador: 3,
      respuestas: respuestas,
    };
    console.log('obj to save', objToSave);
    try {
      const resp = await this.catalogoServiceCOR.savePAEI(objToSave);
      console.log('saved ', resp);
      this.userMessage.titleMessage = '';
      this.userMessage.message = '';
      this.userMessage.type = MessageType.SUCCESS;
    } catch (e) {
      console.log('error ---- ', e);
    }
    this.pageLoading = false;
  }
}
