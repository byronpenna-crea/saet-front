import { Component } from '@angular/core';
import {ButtonStyle} from "../../component/saet-button/saet-button.component";
import {Direction} from "../../component/saet-grafica-barras/saet-grafica-barras.component";

@Component({
  selector: 'app-estudiante-dei-informe-cuantitativo',
  templateUrl: './estudiante-dei-informe-cuantitativo.component.html',
  styleUrls: ['./estudiante-dei-informe-cuantitativo.component.css']
})
export class EstudianteDeiInformeCuantitativoComponent {
  style = ButtonStyle;
  direction = Direction;
}
