import { Component } from '@angular/core';

interface Series {
  name: string;
  value: number;
}

interface Multi {
  name: string;
  series: Series[];
}

@Component({
  selector: 'app-saet-grafica-linear',
  templateUrl: './saet-grafica-linear.component.html',
  styleUrls: ['./saet-grafica-linear.component.css']
})
export class SaetGraficaLinearComponent {
  multi: Multi[] = [];

  view: [number,number] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  yAxisLabel: string = '';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() {
    Object.assign(this, { multi: this.multi });
  }

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
