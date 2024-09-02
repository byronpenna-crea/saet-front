import { Component, Input } from '@angular/core';
import {FormMode} from "../../QuestionsComponent";
import {ButtonStyle} from "../saet-button/saet-button.component";
import {IconComponent} from "../../shared/component.config";
import {TableColumn} from "../saet-table/saet-table.component";

export interface FormTablePariente
{ nombreCompleto: string; parentesco: string; nivelEducativo:string; ocupacion:string; }
@Component({
  selector: 'app-saet-form-table',
  templateUrl: './saet-form-table.component.html',
  styleUrls: ['./saet-form-table.component.css']
})
export class SaetFormTableComponent {

  protected readonly formModeEnum = FormMode;
  protected readonly ButtonStyle = ButtonStyle;
  protected readonly IconComponent = IconComponent;

  @Input() data:FormTablePariente [] = [];

  nombreCompleto = '';
  edad = '';
  nivelEducativo = '';
  parentesco = '';
  ocupacion = '';


  agregarMiembroFamiliar(){
    console.log('Agregar miembro familiar');
  }
  columns:TableColumn<FormTablePariente>[] = [
    {
      key: "nombreCompleto",
      header: 'Nombre completo'
    },
    {
      key: 'nivelEducativo',
      header: 'Nivel educativo'
    },
    {
      key: 'ocupacion',
      header: 'Ocupacion'
    }
  ]
}
