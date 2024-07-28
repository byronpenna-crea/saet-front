import { Component, Inject } from '@angular/core';
import { FormMode, QuestionsComponent } from '../../QuestionsComponent';
import {
  IMessageComponent,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveQuestionary,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { userMessageInit } from '../../shared/messages.model';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import { ConfirmationService } from 'primeng/api';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';

@Component({
  selector: 'app-estudiante-cuestionario-psicologia',
  templateUrl: './estudiante-cuestionario-psicologia.component.html',
  styleUrls: ['./estudiante-cuestionario-psicologia.component.css'],
})
export class EstudianteCuestionarioPsicologiaComponent
  extends QuestionsComponent
  implements IMessageComponent
{
  userMessage: UserMessage = userMessageInit;
  btnStyle = ButtonStyle;
  btnIcon = IconComponent;
  cuestionariosTableMode: number[] = [7, 10, 11, 12, 13];
  override async ngOnInit() {
    await super.ngOnInit();
    console.log('init');
    if (this.readOnlyEvaluaciones) {
      await this.router.navigate([
        '/menu/saet-caracterizacion-estudiante',
        this.nie,
      ]);
    }
  }
  idEvaluacion: number = 0;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ) {
    const especialidadTarget: string = 'psicologia';
    super(
      document,
      catalogoServiceCOR,
      route,
      router,
      confirmationService,
      especialidadTarget
    );

    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.psicologo_perfil)
      .then(response => {
        this.idEvaluacion = response.id_evaluacion;
        this.handleMode(
          response.id_evaluacion,
          'menu/saet-psicologia',
          this.formMode
        );

        console.log('Evaluacion here ', response);
        console.log('values here ', this.values);
        console.log('transformed response ', this.responseToValues(response));

        this.values = {
          ...this.values,
          ...this.responseToValues(response),
        };
        console.log('this values ... ', this.values);
      })
      .catch(ex => {
        console.log('ex here', ex);
      });

    catalogoServiceCOR.getPsicologiaQuestions().then(result => {
      this.showActionButtons = true;
      this.corSurveys.push(...result.cuestionarios);
    });
  }
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }

  save() {
    const objToSave: ISaveQuestionary = this.getQuestionaryObject();
    console.log('obj to save', objToSave);
    objToSave.id_evaluacion = this.idEvaluacion;
    const x = this.catalogoServiceCOR.updatePsicologia(objToSave);
  }

  override salirEditMode(): string {
    const url = super.salirEditMode();
    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.psicologo_perfil)
      .then(response => {
        this.values = {
          ...this.responseToValues(response),
        };
      });
    this.router.navigateByUrl(url);
    return '';
  }
  message: string = '';
  showMessage: boolean = false;
  titleMessage: string = '';
}
