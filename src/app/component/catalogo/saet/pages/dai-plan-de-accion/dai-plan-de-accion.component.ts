import { Component, Inject, ViewChild } from '@angular/core';
import { DaiBaseComponent } from '../../DaiBaseComponent';
import {
  IMessageComponent,
  MessageType,
} from '../../interfaces/message-component.interface';
import { iSurvey } from '../../shared/survey';
import { SAET_MODULE } from '../../shared/evaluaciones';
import { DOCUMENT } from '@angular/common';
import { CatalogoServiceDai, ISaveReferencia } from '../../../../../services/catalogo/catalogo.service.dai';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TabInput } from '../estudiante-evaluaciones/estudiante-evaluaciones.component';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';
import { IAgendaEspecialista } from '../../component/saet-tab-agenda/saet-tab-agenda.component';
import { KeyValue } from '../../component/saet-input/saet-input.component';

@Component({
  selector: 'app-dai-plan-de-accion',
  templateUrl: './dai-plan-de-accion.component.html',
  styleUrls: ['./dai-plan-de-accion.component.css'],
})
export class DaiPlanDeAccionComponent
  extends DaiBaseComponent
  implements IMessageComponent
{
  @ViewChild('cd') confirmDialog: any;
  values: { [key: string]: string } = {};
  corSurveys: iSurvey[] = [];
  baseUrl = '/menu/dai/plan-accion';
  especialistaAgendado: IAgendaEspecialista = {
    dui: '',
    nombreCompleto: '',
  };
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceDai: CatalogoServiceDai,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService
  ) {
    super(document, catalogoServiceDai, route, router);
    this.pageLoading = true;

    const storedValues = localStorage.getItem(`plan-accion-${this.nie}`);
    if (storedValues) {
      this.values = JSON.parse(storedValues);
    }

    const nombreCompleto = `${localStorage.getItem('nombre') ?? ''}`;
    const dui = localStorage.getItem('dui') ?? '';
    this.especialistaAgendado = {
      nombreCompleto: nombreCompleto,
      dui: dui,
      especialidad: '',
    };
    console.log('obtener especialista');
    this.catalogoServiceDai
      .getPlanAccionPerNIE(this.nie)
      .then(resp => {
        this.planAccionId = resp.plan_accion_pk;
        console.log('resp', resp);
      }).catch((e) => {
        console.log('e', e);
      });

    this.pageLoading = false;
  }
  planAccionId: number | null = null;
  protected readonly SAET_MODULE = SAET_MODULE;
  async saveReferencia() {
    try {
      this.pageLoading = true;
      const idPersona = localStorage.getItem('id_persona');
      if (idPersona === null) {
        this.userMessage.type = MessageType.WARNING;
        this.userMessage.message = 'Especialista no fue cargado adecuadamente';
        this.userMessage.showMessage = true;
        return;
      }
      console.log('start');
      console.log(this.referenciaForm.referenciaExterna);
      console.log(this.referenciaForm.motivoReferencia);
      console.log(this.referenciaForm.personalEjecucion);
      console.log(this.referenciaForm.servicioApoyo);
      if (
        this.referenciaForm.referenciaExterna === '' ||
        this.referenciaForm.motivoReferencia === '' ||
        this.referenciaForm.personalEjecucion === '' ||
        this.referenciaForm.servicioApoyo === ''
      ) {
        this.userMessage.type = MessageType.WARNING;
        this.userMessage.message = 'Todos los campos son requeridos';
        this.userMessage.showMessage = true;
        return;
      }

      const objToSave: ISaveReferencia = {
        departamento: this.referenciaForm.departamento,
        nie: parseFloat(this.nie),
        motivo: this.referenciaForm.motivoReferencia,
        id_docente_apoyo: parseFloat(idPersona),
        referencia_externa: this.referenciaForm.referenciaExterna,
        personal_ejecucion: this.referenciaForm.personalEjecucion,
        servicio_apoyo: this.referenciaForm.servicioApoyo,
      };
      console.log('obj to save', objToSave);
      const resp = await this.catalogoServiceDai.saveReferencia(objToSave);
      console.log('resp', resp);
      await this.loadTabReferencia();
      this.userMessage.type = MessageType.WARNING;
      this.userMessage.message =
        '¡Se ha enviado un correo electrónico a los demás responsables COR!';
      this.userMessage.titleMessage = "Guardado exitosamente";
      this.userMessage.showMessage = true;

    } catch (e) {
      this.userMessage.type = MessageType.DANGER;
      this.userMessage.message = 'Error';
      this.userMessage.showMessage = true;
    }
    this.pageLoading = false;
  }
  async onMotivoReferenciaChange(event: KeyValue) {
    console.log('motivo referencia change ', event);
    this.referenciaForm.motivoReferencia = event.value;
  }
  async onDepartamentoChange(event: { value:string }) {
    this.referenciaForm.departamento = event.value
    console.log('event', event);
  }
  async onReferenciaExternaChange(event: KeyValue) {
    this.referenciaForm.referenciaExterna = event.value;
  }
  async onPersonalEjecucionChange(event: KeyValue) {
    this.referenciaForm.personalEjecucion = event.value;
  }
  async onServicioApoyoChange(event: KeyValue) {
    this.referenciaForm.servicioApoyo = event.value;
  }
  async onTabChange(event: { index: number }) {
    console.log('event -->', event);
    switch (event.index) {
      case 0:
        // acciones tab
        break;
      case 1:
        // referencia tab
        await this.loadTabReferencia();
        break;
    }
  }
  referenciaForm: {
    idReferencia: number | null;
    servicioApoyo: string;
    personalEjecucion: string;
    referenciaExterna: string;
    motivoReferencia: string;
    departamento: string;
  } = {
    idReferencia: null,
    personalEjecucion: '',
    servicioApoyo: '',
    referenciaExterna: '',
    motivoReferencia: '',
    departamento: 'Centro de Orientación y Recursos (COR)',
  };
  readonlyForm = false;
  async loadTabReferencia() {
    this.pageLoading = true;
    const idPersona = localStorage.getItem('id_persona');
    if (idPersona === null) {
      this.userMessage.showMessage = true;
      this.userMessage.message = 'Especialista no fue cargado adecuadamente';
      this.userMessage.type = MessageType.WARNING;
      return;
    }
    try {
      const referencia =
        await this.catalogoServiceDai.getReferenciaByNieAndDocenteId(
          `${this.nie}`,
          idPersona ?? '0'
        );
      console.log('referencia ---->', referencia);
      this.readonlyForm = true;
      this.referenciaForm.idReferencia = referencia.referencia_pk;
      this.referenciaForm.motivoReferencia = referencia.motivo;
      this.referenciaForm.personalEjecucion = referencia.personal_ejecucion;
      this.referenciaForm.servicioApoyo = referencia.servicio_apoyo;
      this.referenciaForm.referenciaExterna = referencia.referencia_externa;
      console.log('referencia form', this.referenciaForm);
      referencia.referencia_pk;
      console.log('id especialista ', idPersona);
      console.log('referencia', referencia);
    } catch (e) {
      console.log('------ Error --------', e);
    }
    this.pageLoading = false;
  }
  async iniciar() {
    await this.router.navigate(['menu/dai/saet-plan-accion-iniciar', this.nie]);
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
  protected readonly departamentosModulo = [
    {
      code: 'Centro de Orientación y Recursos (COR)',
      value: 'Centro de Orientación y Recursos (COR)',
    },
    {
      code: 'Docente de Apoyo a la Inclusión (DAI)',
      value: 'Docente de Apoyo a la Inclusión (DAI)',
    },
    {
      code: 'Docente de Apoyo a la Inclusión Educativa',
      value: 'Docente de Apoyo a la Inclusión Educativa',
    },
    {
      code: 'Escuela de Educación Especial (EEE)',
      value: 'Escuela de Educación Especial (EEE)',
    },
    {
      code: 'Comité Departamental de Apoyo a la Inclusión (CODAI)',
      value: 'Comité Departamental de Apoyo a la Inclusión (CODAI)',
    },
    {
      code: 'Centro de Recursos de Inclusión Educativa (CRIEDV)',
      value: 'Centro de Recursos de Inclusión Educativa (CRIEDV)',
    },
    //
  ];
}
