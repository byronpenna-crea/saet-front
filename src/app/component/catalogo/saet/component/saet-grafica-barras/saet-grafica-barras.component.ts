import { Component, Input } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';
export enum Direction {
  VERTICAL = 0,
  LANDSCAPE = 1,
}
interface DataItem {
  name: string;
  value: number;
}
@Component({
  selector: 'app-saet-grafica-barras',
  templateUrl: './saet-grafica-barras.component.html',
  styleUrls: ['./saet-grafica-barras.component.css'],
})
export class SaetGraficaBarrasComponent {
  @Input() single: DataItem[] = [];

  view: [number, number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  barPadding = 20;
  direction = Direction;
  @Input() mode: Direction = Direction.VERTICAL;
  colorScheme = '#5AA454';
  schemeTye: ScaleType = ScaleType.Ordinal;
  constructor() {
    // La propiedad single ya está inicializada directamente
  }

  onSelect(event: any): void {
    console.log(event);
  }
}
