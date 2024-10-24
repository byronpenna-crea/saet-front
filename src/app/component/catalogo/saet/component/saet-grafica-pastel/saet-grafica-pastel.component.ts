import { Component, Input } from '@angular/core';

interface DataItem {
  name: string;
  value: number;
}
@Component({
  selector: 'app-saet-grafica-pastel',
  templateUrl: './saet-grafica-pastel.component.html',
  styleUrls: ['./saet-grafica-pastel.component.css'],
})
export class SaetGraficaPastelComponent {
  @Input() single: DataItem[] = [];
  view: [number, number] = [700, 400];

  // options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor() {}

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
