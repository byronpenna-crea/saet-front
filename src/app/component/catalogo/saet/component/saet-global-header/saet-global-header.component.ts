import { Component, Inject, Input, OnInit } from '@angular/core';
import { CatalogoServiceCor } from "../../../../../services/catalogo/catalogo.service.cor";
import { DOCUMENT } from "@angular/common";

interface BreadcrumbItem {
  href: string;
  text: string;
}
@Component({
  selector: 'app-saet-global-header',
  templateUrl: './saet-global-header.component.html',
  styleUrls: ['./saet-global-header.component.css']
})
export class SaetGlobalHeaderComponent implements OnInit {
  @Input() nie: string = "";
  @Input() nombreCompleto: string = "";
  @Input() selectedTab: string = '';
  tabMenu: { url: string, text: string, name: string, readOnly: boolean }[] = [];
  @Input() breadcrumb: BreadcrumbItem[] = [];

  @Input() _readOnlyEvaluaciones: boolean = true;
  @Input() _readOnlyPaei: boolean = true;

  @Input()
  set readOnlyEvaluaciones(value: boolean) {
    this._readOnlyEvaluaciones = value;
    this.generateTabs();
  }
  @Input()
  set readOnlyPaei(value: boolean) {

    this._readOnlyPaei = value;
    this.generateTabs();
  }

  generateTabs() {
    this.tabMenu = [
      { name: 'datosGenerales', url: `#/menu/saet-datos-estudiante/${this.nie}`, text: 'Datos generales', readOnly: false },
      { name: 'Caracterizacion', url: `#/menu/saet-caracterizacion-estudiante/${this.nie}`, text: 'Caracterización', readOnly: false },
      { name: 'evaluaciones', url: `#/menu/saet-evaluaciones/${this.nie}`, text: 'Evaluaciones', readOnly: this._readOnlyEvaluaciones },
      { name: 'paei', url: `#/menu/saet-paei/${this.nie}`, text: 'PAEI', readOnly: this._readOnlyPaei }
    ];
  }

  ngOnInit() {
    this.generateTabs();
  }

  isSelected(name: string): boolean {
    return this.selectedTab === name;
  }
  handleClick(event: MouseEvent, url: string, readOnly: boolean) {

    if (readOnly || url === '' || url === '#') {
      event.preventDefault();
    }
  }
}
