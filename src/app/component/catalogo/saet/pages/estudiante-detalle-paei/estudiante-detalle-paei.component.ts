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
  userMessage: UserMessage = userMessageInit;
  btnIcon = IconComponent;

  pageLoading = true;
  loadingMessage?:string = undefined;
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
    const respuestas: IQuestionaryAnswer[] = this.getAnswerObject(this.values);
    const objToSave: iPaeiSave = {
      id_paei: null,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_especialista: 2,
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
  }
}
