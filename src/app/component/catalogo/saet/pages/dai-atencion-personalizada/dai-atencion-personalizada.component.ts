import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { DaiBaseComponent } from '../../DaiBaseComponent';
import { IMessageComponent } from '../../interfaces/message-component.interface';
import { iSurvey } from '../../shared/survey';
import { SAET_MODULE } from '../../shared/evaluaciones';
import { TabInput } from '../estudiante-evaluaciones/estudiante-evaluaciones.component';
import { DOCUMENT } from '@angular/common';
import { CatalogoServiceCor } from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogoServiceDai } from '../../../../../services/catalogo/catalogo.service.dai';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-dai-atencion-personalizada',
  templateUrl: './dai-atencion-personalizada.component.html',
  styleUrls: ['./dai-atencion-personalizada.component.css'],
})
export class DaiAtencionPersonalizadaComponent
  extends DaiBaseComponent
  implements IMessageComponent
{
  @ViewChild('cd') confirmDialog: any;
  values: { [key: string]: string } = {};
  corSurveys: iSurvey[] = [];
  baseUrl = '/menu/dai/saet-atencion-personalizada';

  protected readonly SAET_MODULE = SAET_MODULE;
  agendaTabs: TabInput[] = [];
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceDai: CatalogoServiceDai,
    route: ActivatedRoute,
    router: Router,
    private confirmationService: ConfirmationService
  ) {
    super(document, catalogoServiceDai, route, router);

  }
}
