import { Component, Inject } from '@angular/core';
import { SeguridadService } from '../../../services/seguridad.service';
import { CookieService } from 'ngx-cookie-service';
import { CatalogoServiceUsuarios } from '../../../services/catalogo/catalogo.service.usuarios';
import {
  iStep,
  StepStatus,
} from './component/status-table/status-table.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'saet',
  templateUrl: './saet.component.html',
  styleUrls: ['./saet.component.css'],
})
export class SaetComponent {
  constructor(
    private menuService: SeguridadService,
    private cookieService: CookieService,
    private catalogoServiceUsuarios: CatalogoServiceUsuarios,
    @Inject(DOCUMENT) private document: Document
    //,public themeService: ThemeService
  ) {}
  stepData: iStep[] = [
    { name: 'COR especialista en psicologia', status: StepStatus.VALIDATED },
    { name: 'COR especialista en Pedagogía', status: StepStatus.VALIDATED },
    {
      name: 'COR especialista en Habla y lenguaje',
      status: StepStatus.PENDING,
    },
    { name: 'Coordinador(a) del COR', status: StepStatus.VALIDATED },
  ];
  ngOnInit() {}
}
