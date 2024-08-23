import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ButtonStyle} from "../saet-button/saet-button.component";

@Component({
  selector: 'app-saet-tarjeta-informe',
  templateUrl: './saet-tarjeta-informe.component.html',
  styleUrls: ['./saet-tarjeta-informe.component.css']
})
export class SaetTarjetaInformeComponent implements OnChanges{
  @Input() numero: number = 0;
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  @Input() style:ButtonStyle = ButtonStyle.WHITE;
  styleClasses: string = 'tarjeta-informe';
  ngOnChanges(changes: SimpleChanges) {
    this.updateStyleClasses();
  }
  private updateStyleClasses() {
    this.styleClasses = 'tarjeta-informe ';
    switch (this.style) {
      case ButtonStyle.WHITE:
        this.styleClasses += 'saet-button-white';
        break;
      case ButtonStyle.BLUE:
        this.styleClasses += 'saet-button-blue';
        break;
    }
  }
}
