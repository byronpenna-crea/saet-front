import { Component } from '@angular/core';
import {DeiBaseComponent} from "../../DeiBaseComponent";

@Component({
  selector: 'app-estudiante-dei-informe-cualitativo',
  templateUrl: './estudiante-dei-informe-cualitativo.component.html',
  styleUrls: ['./estudiante-dei-informe-cualitativo.component.css']
})
export class EstudianteDeiInformeCualitativoComponent extends DeiBaseComponent{
  onTabChange(event: {index:number}) {
    const index = event.index;
    console.log('index ',index);
    if (index === 1) {
      this.redirectTo('menu/dei/informe-cuantitativo');
    }
    if (index === 2) {
      this.redirectTo('menu/dei/informe-trimestral');
    }
  }
}
