import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormMode } from '../../QuestionsComponent';
import { ButtonStyle } from '../saet-button/saet-button.component';
import { IconComponent } from '../../shared/component.config';
import { TableColumn } from '../saet-table/saet-table.component';
import { KeyValue } from '../saet-input/saet-input.component';

export interface FormTablePariente {
  id: string;
  nombreCompleto: string;
  parentesco: string;
  nivelEducativo: string;
  edad: string;
  ocupacion: string;
  action?: string;
}

@Component({
  selector: 'app-saet-form-table',
  templateUrl: './saet-form-table.component.html',
  styleUrls: ['./saet-form-table.component.css'],
})
export class SaetFormTableComponent {
  /* enums y constantes visuales */
  protected readonly formModeEnum = FormMode;
  protected readonly ButtonStyle  = ButtonStyle;
  protected readonly IconComponent = IconComponent;

  /* -------------------------------------------------- */
  /*  Inputs / Outputs                                  */
  /* -------------------------------------------------- */
  @Input()  data: FormTablePariente[] = [];
  @Output() dataChange = new EventEmitter<FormTablePariente[]>();

  /* -------------------------------------------------- */
  /*  Form interno                                      */
  /* -------------------------------------------------- */
  formData = {
    nombreCompleto: '',
    edad: '',
    parentesco: '',
    nivelEducativo: '',
    ocupacion: '',
  };

  canAdd    = false;
  canDelete = true;
  private counter = 0;

  /* -------------------------------------------------- */
  /*  Métodos                                            */
  /* -------------------------------------------------- */
  onInputChange({ key, value }: KeyValue, field: keyof typeof this.formData) {
    this.formData[field] = value;
    this.canAdd = !!this.formData.nombreCompleto.trim();
  }

  agregarMiembroFamiliar(): void {
    if (!this.canAdd) return;

    const pariente: FormTablePariente = {
      id: `tmp-${this.counter++}`,
      ...this.formData,
    };

    this.data = [...this.data, pariente];      // inmutable
    this.dataChange.emit(this.data);
    this.resetForm();
  }

  eliminarMiembroFamiliar(pariente: FormTablePariente): void {
    this.data = this.data.filter(p => p.id !== pariente.id);
    this.dataChange.emit(this.data);
  }

  private resetForm(): void {
    this.formData = {
      nombreCompleto: '',
      edad: '',
      parentesco: '',
      nivelEducativo: '',
      ocupacion: '',
    };
    this.canAdd = false;
  }

  /* -------------------------------------------------- */
  /*  Definición de columnas                             */
  /* -------------------------------------------------- */
  columns: TableColumn<FormTablePariente>[] = [
    { key: 'nombreCompleto', header: 'Nombre completo' },
    { key: 'edad',           header: 'Edad' },
    { key: 'parentesco',     header: 'Parentesco' },
    { key: 'nivelEducativo', header: 'Nivel educativo' },
    { key: 'ocupacion',      header: 'Ocupación' },
    {
      key: 'action',
      header: 'Acciones',
    }
  ];
}
