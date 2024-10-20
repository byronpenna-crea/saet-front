import { Inject, Injectable } from '@angular/core';
import { CatalogoServiceDei } from '../../../services/catalogo/catalogo.service.dei';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from '../../../services/ThemeService';
import { Router } from '@angular/router';
import {StudentDetail} from "../../../services/catalogo/catalogo.service.cor";

@Injectable()
export class DeiBaseComponent {

  nie = '';
  studentInfo?: StudentDetail;
  constructor(protected router: Router) {}
  redirectTo(url: string) {
    this.router.navigate([url]);
  }
}
