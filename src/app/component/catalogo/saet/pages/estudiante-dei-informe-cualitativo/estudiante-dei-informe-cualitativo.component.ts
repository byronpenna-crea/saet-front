import { Component } from '@angular/core';
import {DeiBaseComponent} from "../../DeiBaseComponent";
import {ButtonStyle} from "../../component/saet-button/saet-button.component";
import {IconComponent} from "../../shared/component.config";
import {UserMessage} from "../../interfaces/message-component.interface";
import {userMessageInit} from "../../shared/messages.model";
import {KeyValue} from "../../component/saet-input/saet-input.component";

@Component({
  selector: 'app-estudiante-dei-informe-cualitativo',
  templateUrl: './estudiante-dei-informe-cualitativo.component.html',
  styleUrls: ['./estudiante-dei-informe-cualitativo.component.css']
})
export class EstudianteDeiInformeCualitativoComponent extends DeiBaseComponent{
  protected readonly ButtonStyle = ButtonStyle;
  protected readonly IconCompoment = IconComponent;

  userMessage: UserMessage = userMessageInit;

  inputNIE = '';
  cnResult = 0;
  showTable = false;

  onInputChange(keyValue: KeyValue) {
    this.inputNIE = keyValue.value;
  }
  async toggleTable() {

  }
  cleanInput() {
    this.inputNIE = '';
    this.userMessage.showMessage = false;
    this.showTable = false;
  }

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
