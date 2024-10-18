import { Component, Inject } from '@angular/core';
import { CorBaseComponent } from '../../CorBaseComponent';
import {
  IMessageComponent,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { DOCUMENT } from '@angular/common';
import { CatalogoServiceCor } from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';
import { TableColumn } from '../../component/saet-table/saet-table.component';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';

interface estadoValidacionTableInterface {
  especialista: string;
  estado: string;
  verDetalle: string;
}
@Component({
  selector: 'app-estudiante-paei',
  templateUrl: './estudiante-paei.component.html',
  styleUrls: ['./estudiante-paei.component.css'],
})
export class EstudiantePaeiComponent
  extends CorBaseComponent
  implements IMessageComponent
{
  override ngOnInit = async () => {
    await super.ngOnInit();
  };
  buttonStyle = ButtonStyle;
  buttonIcon = IconComponent;
  nombreEspecialista: {
    [key in TIPO_EVALUACION]?: {
      nombre: string;
      dui: string;
    };
  } = {};
  tipoEvaluacion = TIPO_EVALUACION;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router
  ) {
    super(document, catalogoServiceCOR, route, router);
    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.psicologo_perfil)
      .then(response => {
        this.nombreEspecialista[TIPO_EVALUACION.psicologo_perfil] = {
          nombre: response.especialista_responsable,
          dui: '',
        };
      });
    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.pedagogo_perfil)
      .then(response => {
        this.nombreEspecialista[TIPO_EVALUACION.pedagogo_perfil] = {
          nombre: response.especialista_responsable,
          dui: '',
        };
      });
    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.logopeda_perfil)
      .then(response => {
        this.nombreEspecialista[TIPO_EVALUACION.logopeda_perfil] = {
          nombre: response.especialista_responsable,
          dui: '',
        };
      });
  }
  estadoValidacionColumns: TableColumn<estadoValidacionTableInterface>[] = [
    { key: 'especialista', header: 'Especialista' },
    { key: 'estado', header: 'Estado' },
    { key: 'verDetalle', header: 'Ver detalle' },
  ];
  rowData = [
    { col1: 'Especialista en Psicología', col2: 'No iniciado', col3: '' },
    { col1: 'Especialista en Pedagogía', col2: 'No iniciado', col3: '' },
    { col1: 'Especialista en Habla y lenguaje', col2: 'No iniciado', col3: '' },
    { col1: 'Coordinador(a) de COR', col2: 'No iniciado', col3: '' },
  ];
  async btnVerPaei() {
    await this.router.navigate(['/menu/saet-paei-detalle/', this.nie]);
  }
}
