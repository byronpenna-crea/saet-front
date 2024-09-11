import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormMode} from "../../QuestionsComponent";
import {ButtonStyle} from "../saet-button/saet-button.component";
import {IconComponent} from "../../shared/component.config";
import {TableColumn} from "../saet-table/saet-table.component";
import {KeyValue} from "../saet-input/saet-input.component";

export interface FormTablePariente
{
    id: string;
    nombreCompleto: string;
    parentesco: string;
    nivelEducativo:string;
    ocupacion:string;
    action?: string;
}
@Component({
  selector: 'app-saet-form-table',
  templateUrl: './saet-form-table.component.html',
  styleUrls: ['./saet-form-table.component.css']
})
export class SaetFormTableComponent {

  protected readonly formModeEnum = FormMode;
  protected readonly ButtonStyle = ButtonStyle;
  protected readonly IconComponent = IconComponent;
  cn=0;
  canAdd = false;
  canDelete = true;
  @Input() data:FormTablePariente [] = [];
  @Output() formAdd = new EventEmitter<{
    pariente:FormTablePariente
  }>();

  formData = {
    nombreCompleto: '',
    edad: '',
    nivelEducativo: '',
    parentesco: '',
    ocupacion: ''
  };

  eliminarMiembroFamiliar(event:Event,pariente:FormTablePariente){
    this.data = this.data.filter((data) => {
      return !(
        data.id === pariente.id)
    })
  }
  updateCanAdd() {
    this.canAdd = !!this.formData.nombreCompleto;
  }
  onInputChange(event: KeyValue, field: keyof typeof this.formData) {
    this.formData[field] = event.value;
    this.updateCanAdd();
  }
  agregarMiembroFamiliar(event: Event){
    console.log('pariente to add ');
    const pariente:FormTablePariente = {
      id: `temp-${this.cn}`,
      nombreCompleto: this.formData.nombreCompleto ?? '',
      nivelEducativo: this.formData.nivelEducativo ?? '',
      ocupacion: this.formData.ocupacion ?? '',
      parentesco: this.formData.parentesco ?? ''
    }
    console.log('pariente to add ', pariente);
    console.log('data', this.data);
    this.data !== undefined ? this.data.push(pariente) : this.data = [pariente];
    this.cn++;
    this.formAdd.emit({pariente: pariente});
    this.cleanValues();
  }
  cleanValues() {
    this.formData.nombreCompleto = '';
    this.formData.edad = '';
    this.formData.nivelEducativo = '';
    this.formData.parentesco = '';
    this.formData.ocupacion = '';
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
    },
    {
      key: 'action',
      header: 'Acciones'
    }
  ]
}
