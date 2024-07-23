import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CatalogoServiceCor } from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-estudiante-reset',
  templateUrl: './estudiante-reset.component.html',
  styleUrls: ['./estudiante-reset.component.css'],
})
export class EstudianteResetComponent {
  status: string = '';
  constructor(catalogoServiceCOR: CatalogoServiceCor) {
    catalogoServiceCOR.reset().then(result => {
      console.log('result ', result);
      if (result.status === 200 || result.status === 205) {
        this.status = 'Reseteado correctamente';
      } else {
        this.status = 'Error reseteando';
      }
    });
  }
}
