import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
export interface TFormData {
  nombreCompleto: string,
  edad: string,
  parentesco: string,
  nivelEducativo: string,
  ocupacion: string,
}
@Component({
  selector: 'app-saet-form-table',
  templateUrl: './saet-form-table.component.html',
  styleUrls: ['./saet-form-table.component.css'],
})

export class SaetFormTableComponent implements OnChanges{
  /* enums y constantes visuales */
  protected readonly formModeEnum = FormMode;
  protected readonly ButtonStyle  = ButtonStyle;
  protected readonly IconComponent = IconComponent;

  /* -------------------------------------------------- */
  /*  Inputs / Outputs                                  */
  /* -------------------------------------------------- */
  @Input()  data: FormTablePariente[] = [];
  @Input() resetChangesCounter: number = 0;
  @Input()  mode: FormMode = FormMode.CREATE;
  @Output() dataChange = new EventEmitter<FormTablePariente[]>();
  originalFormData: TFormData | null = null;
  highlightedRows = new Set<string>();

  /* -------------------------------------------------- */
  /*  Form interno                                      */
  /* -------------------------------------------------- */
  formData:TFormData = {
    nombreCompleto: '',
    edad: '',
    parentesco: '',
    nivelEducativo: '',
    ocupacion: '',
  };

  canAdd    = false;
  canDelete = true;
  private counter = 0;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetChangesCounter'] && changes['resetChangesCounter'].currentValue) {
      this.highlightedRows.clear();
      this.resetForm();
    }
  }
  /* === Helpers de modo ========================================== */
  get isView(): boolean     { return this.mode === FormMode.VIEW; }
  get isEditable(): boolean { return !this.isView; }
  /* -------------------------------------------------- */
  /*  Métodos                                            */
  /* -------------------------------------------------- */
  onInputChange(_: KeyValue, field: keyof TFormData): void {
    if (this.isView) return;

    this.formData[field] = _?.value ?? '';
    this.canAdd = !!this.formData.nombreCompleto.trim();
  }
  editId: string | null = null;
  get isEditing(): boolean {
    return this.editId !== null;
  }
  get visibleColumns(): TableColumn<FormTablePariente>[] {
    return this.isView
      ? this.columns.filter(col => col.key !== 'action')
      : this.columns;
  }
  editarMiembroFamiliar(pariente: FormTablePariente): void {
    if (this.isView) return;

    this.editId = pariente.id;
    this.originalFormData = { ...pariente };
    this.formData = {
      nombreCompleto: pariente.nombreCompleto ?? '',
      edad: pariente.edad ?? '',
      parentesco: pariente.parentesco ?? '',
      nivelEducativo: pariente.nivelEducativo ?? '',
      ocupacion: pariente.ocupacion ?? '',
    };
    this.canAdd = true;
  }
  cancelarEdicion(): void {
    this.resetForm();
  }

  agregarMiembroFamiliar(): void {
    if (this.isView || !this.canAdd) return;

    if (this.editId !== null) {
      this.data = this.data.map(p =>
        p.id === this.editId ? { ...p, ...this.formData } : p
      );
      this.highlightedRows.add(this.editId);
      this.editId = null;
    } else {
      // Agregar
      const pariente: FormTablePariente = {
        id: `tmp-${this.counter++}`,
        ...this.formData,
      };
      this.data = [...this.data, pariente];
    }

    this.dataChange.emit(this.data);
    this.resetForm();
  }

  eliminarMiembroFamiliar(pariente: FormTablePariente): void {
    if (this.isView) return;

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
    this.editId = null;
    this.originalFormData = null;
    this.canAdd = false;
  }
  wasModified(field: keyof TFormData): boolean {
    if (!this.originalFormData) return false;
    console.log('was changed ', this.formData[field] !== this.originalFormData[field]);
    return this.formData[field] !== this.originalFormData[field];
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
