import { Component, Input, OnInit } from '@angular/core';
import { SAET_MODULE } from '../../shared/evaluaciones';

interface BreadcrumbItem {
  href: string;
  text: string;
}
@Component({
  selector: 'app-saet-global-header',
  templateUrl: './saet-global-header.component.html',
  styleUrls: ['./saet-global-header.component.css'],
})
export class SaetGlobalHeaderComponent implements OnInit {
  @Input() nie: string = '';
  @Input() nombreCompleto: string = '';
  @Input() selectedTab: string = '';
  @Input() module:SAET_MODULE = SAET_MODULE.COR;
  @Input() tabMenu: {
    url: string;
    text: string;
    name: string;
    readOnly: boolean;
    testId?: string;
  }[] = [];
  @Input() breadcrumb: BreadcrumbItem[] = [];

  @Input() _readOnlyEvaluaciones: boolean = true;
  @Input() _readOnlyPaei: boolean = true;

  getModuleString() {
    switch (this.module) {
      case SAET_MODULE.COR:
        return 'COR';
      case SAET_MODULE.DAI:
        return 'DAI';
    }
  }
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
  generateTabs(){
    switch (this.module) {
      case SAET_MODULE.DAI:
        console.log('dai tabs');
        this.generateDAITabs();
        return;
      case SAET_MODULE.COR:
        console.log('here cor');
        this.generateCORTabs();
        return;
    }
  }
  generateDAITabs() {
    this.tabMenu = [
      {
        name: 'datosGenerales',
        url: `#/menu/dai/saet-datos-estudiante/${this.nie}`,
        text: 'Datos generales',
        readOnly: false,
        testId: 'tab-datos-generales',
      },
      {
        name: 'Caracterizacion',
        url: `#/menu/dai/saet-caracterizacion-estudiante/${this.nie}`,
        text: 'Caracterización',
        readOnly: false,
        testId: 'tab-caracterizacion',
      },
    ];
  }
  generateCORTabs() {
    this.tabMenu = [
      {
        name: 'datosGenerales',
        url: `#/menu/saet-datos-estudiante/${this.nie}`,
        text: 'Datos generales',
        readOnly: false,
        testId: 'tab-datos-generales',
      },
      {
        name: 'Caracterizacion',
        url: `#/menu/saet-caracterizacion-estudiante/${this.nie}`,
        text: 'Caracterización',
        readOnly: false,
        testId: 'tab-caracterizacion',
      },
      {
        name: 'evaluaciones',
        url: `#/menu/saet-evaluaciones/${this.nie}`,
        text: 'Evaluaciones',
        readOnly: this._readOnlyEvaluaciones,
        testId: 'tab-evaluaciones',
      },
      {
        name: 'paei',
        url: `#/menu/saet-paei/${this.nie}`,
        text: 'PAEI',
        readOnly: this._readOnlyPaei,
        testId: 'tab-paei',
      },
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
