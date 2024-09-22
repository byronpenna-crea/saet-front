import { Component } from '@angular/core';
import {ButtonStyle} from "../../component/saet-button/saet-button.component";
import {KeyValue} from "../../component/saet-input/saet-input.component";
import {IconComponent} from "../../shared/component.config";
import {UserMessage} from "../../interfaces/message-component.interface";
import {userMessageInit} from "../../shared/messages.model";
import {DeiBaseComponent} from "../../DeiBaseComponent";

@Component({
  selector: 'app-estudiante-dei-informe-trimestral',
  templateUrl: './estudiante-dei-informe-trimestral.component.html',
  styleUrls: ['./estudiante-dei-informe-trimestral.component.css']
})
export class EstudianteDeiInformeTrimestralComponent extends DeiBaseComponent{
  protected readonly ButtonStyle = ButtonStyle;
  protected readonly IconCompoment = IconComponent;
  userMessage: UserMessage = userMessageInit;

  inputNIE = '';
  showTable = false;
  cnResult = 0;
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
  onTabChange(event: any) {
    const index = event.index;
    console.log('index ',index);
    if (index === 1) {
      this.redirectTo('menu/dei/informe-cuantitativo');
    }
    if (index === 1) {
      this.redirectTo('menu/dei/informe-cuantitativo');
    }
  }
}
