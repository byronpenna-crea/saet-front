import {Component} from '@angular/core';
import {ScaleType} from "@swimlane/ngx-charts";

interface DataItem {
  name: string;
  value: number;
}
@Component({
  selector: 'app-saet-grafica-barras',
  templateUrl: './saet-grafica-barras.component.html',
  styleUrls: ['./saet-grafica-barras.component.css']
})
export class SaetGraficaBarrasComponent {
  single: DataItem[] = [];

  view: [number, number] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = '';
  barPadding: number = 20;

  colorScheme: string = '#5AA454';
  schemeTye:ScaleType = ScaleType.Ordinal;
  constructor() {
    // La propiedad single ya está inicializada directamente
  }

  onSelect(event: any): void {
    console.log(event);
  }
}
