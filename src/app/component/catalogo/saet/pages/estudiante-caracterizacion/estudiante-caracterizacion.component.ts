import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveCaracterizacion,
  StudentDetail,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IMessageComponent,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { CorBaseComponent } from '../../CorBaseComponent';
import { SAET_MODULE } from '../../shared/evaluaciones';
import { IconComponent } from '../../shared/component.config';

@Component({
  selector: 'app-estudiante-caracterizacion',
  templateUrl: './estudiante-caracterizacion.component.html',
  styleUrls: ['./estudiante-caracterizacion.component.css'],
})
export class EstudianteCaracterizacionComponent
  extends CorBaseComponent
  implements IMessageComponent
{
  nombreUsuario = '';
  especialidad = '';
  readonlyInput = true;
  buttonIcon = IconComponent;
  async goTo(link: string) {
    if (link !== '' && link !== '#') {
      await this.router.navigate([link, this.nie]);
    }
  }
  override ngOnInit = async () => {
    await super.ngOnInit();
  };

  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router
  ) {
    super(document, catalogoServiceCOR, route, router);
    this.pageLoading = true;
    this.userMessage.showMessage = false;
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
      }
    });

    this.nombreUsuario = localStorage.getItem('nombre') ?? '';
    this.initCaracterizacion().then(() => {
      console.log('caracterizacion here ', this.caracterizacion);
      if (
        this.caracterizacion &&
        this.caracterizacion?.id_caracterizacion !== 0
      ) {
        this.nombreUsuario = this.caracterizacion.especialista_responsable;
      }
      this.especialidad = localStorage.getItem('especialidad')
        ? `Especialista en ${localStorage.getItem('especialidad')} - ${localStorage.getItem('rolApoyo')}`
        : '';

      catalogoServiceCOR
        .getStudentInfo(this.nie)
        .then(result => {
          this.studentInfo = result.estudiante;
        })
        .finally(() => {
          this.pageLoading = false;
        });
    });
  }
}
