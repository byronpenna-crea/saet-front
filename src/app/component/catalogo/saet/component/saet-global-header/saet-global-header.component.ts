import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-saet-global-header',
  templateUrl: './saet-global-header.component.html',
  styleUrls: ['./saet-global-header.component.css']
})
export class SaetGlobalHeaderComponent {
  @Input() nie:string = "";
  @Input() nombreCompleto: string = "";
  @Input() selectedTab: string = '';
  tabMenu: { url: string, text: string, name:string }[] = [];


  ngOnInit() {
    this.tabMenu = [
      { name: 'datosGenerales', url: `#/menu/saet-datos-estudiante/${this.nie}`, text: 'DATOS GENERALES' },
      { name: 'Caracterizacion', url: `#/menu/saet-caracterizacion-estudiante/${this.nie}`, text: 'CARACTERIZACIÓN' },
      { name: 'evaluaciones', url: `#/menu/saet-evaluaciones/${this.nie}`, text: 'EVALUACIONES' },
      { name: 'paei', url: '/paei', text: 'PAEI' }
    ];
  }
  isSelected(name: string): boolean {
    return this.selectedTab === name;
  }

}
