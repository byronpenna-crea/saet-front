import {Component, ViewChild} from '@angular/core';
import {DaiBaseComponent} from "../../DaiBaseComponent";
import {IMessageComponent} from "../../interfaces/message-component.interface";
import {iSurvey} from "../../shared/survey";
import {SAET_MODULE} from "../../shared/evaluaciones";

@Component({
  selector: 'app-dai-atencion-personalizada',
  templateUrl: './dai-atencion-personalizada.component.html',
  styleUrls: ['./dai-atencion-personalizada.component.css']
})
export class DaiAtencionPersonalizadaComponent extends DaiBaseComponent
  implements IMessageComponent{
  @ViewChild('cd') confirmDialog: any;
  values: { [key: string]: string } = {};
  corSurveys: iSurvey[] = [];
  baseUrl = '/menu/dai/saet-atencion-personalizada';


  protected readonly SAET_MODULE = SAET_MODULE;
}
