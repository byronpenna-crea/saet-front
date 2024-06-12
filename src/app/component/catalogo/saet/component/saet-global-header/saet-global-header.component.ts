import {Component, Input} from '@angular/core';

interface BreadcrumbItem {
  href: string;
  text: string;
}
@Component({
  selector: 'app-saet-global-header',
  templateUrl: './saet-global-header.component.html',
  styleUrls: ['./saet-global-header.component.css']
})
export class SaetGlobalHeaderComponent {
  @Input() nie:string = "";
  @Input() nombreCompleto: string = "";
  @Input() selectedTab: string = '';
  tabMenu: { url: string, text: string, name:string, readOnly: boolean}[] = [];
  @Input() breadcrumb: BreadcrumbItem[] = [];

  enabledEvaluaciones: boolean = true;
  enabledPaei: boolean = true;
  ngOnInit() {
    this.tabMenu = [
      { name: 'datosGenerales', url: `#/menu/saet-datos-estudiante/${this.nie}`, text: 'DATOS GENERALES', readOnly: false },
      { name: 'Caracterizacion', url: `#/menu/saet-caracterizacion-estudiante/${this.nie}`, text: 'CARACTERIZACIÓN', readOnly: false },
      { name: 'evaluaciones', url: `#/menu/saet-evaluaciones/${this.nie}`, text: 'EVALUACIONES', readOnly: this.enabledEvaluaciones },
      { name: 'paei', url: '/paei', text: 'PAEI', readOnly: this.enabledEvaluaciones }
    ];
  }
  isSelected(name: string): boolean {
    return this.selectedTab === name;
  }
  handleClick(event: MouseEvent, url: string, readOnly:boolean) {
    if (readOnly || url === '' || url === '#') {
      event.preventDefault();
    }
  }
}
