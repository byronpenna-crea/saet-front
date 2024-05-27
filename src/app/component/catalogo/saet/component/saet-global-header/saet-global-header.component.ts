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
      { name: 'datosGenerales', url: '/caracterizacion', text: 'DATOS GENERALES' },
      { name: 'Caracterizacion', url: `#/menu/saet-caracterizacion-estudiante/${this.nie}`, text: 'CARACTERIZACIÓN' },
      { name: 'evaluaciones', url: '/evaluaciones', text: 'EVALUACIONES' },
      { name: 'paei', url: '/paei', text: 'PAEI' }
    ];
  }
  isSelected(name: string): boolean {
    console.log('passed name', name);
    console.log('selected tab ',this.selectedTab );
    return this.selectedTab === name;
  }

}
