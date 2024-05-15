import {Component, TemplateRef, ViewChild} from '@angular/core';
import {ButtonStyle, SaetButtonArgs} from "../../component/saet-button/saet-button.component";
import {IconComponent} from "../../shared/component.config";
import {TableColumn} from "../../component/saet-table/saet-table.component";
import {Route, Router} from "@angular/router";

interface Estudiante {
  nie: string;
  primerNombre: string;
  primerApellido: string;
  fechaNacimiento: string;
  EstadoApoyo: string;
  verDetalle: string;
  Acciones: null;
}
@Component({
  selector: 'app-buscar-estudiante',
  templateUrl: './buscar-estudiante.component.html',
  styleUrls: ['./buscar-estudiante.component.css']
})
export class BuscarEstudianteComponent {
  inputNIE: string = '';
  onInputChange(value: string) {
    this.inputNIE = value;
  }
  constructor(private router: Router) {}

  showTable = false;

  studentTableColumns:TableColumn<Estudiante>[] = [
    { key: "nie", header: "NIE" },
    { key: "primerApellido", header: "Primer apellido" },
    { key: "primerNombre", header: "Primer nombre"},
    { key: "fechaNacimiento", header: "Fecha nacimiento" },
    { key: "EstadoApoyo", header: "Estado de apoyo" },
    { key: "Acciones", header: "Acciones" }
  ];

  studentData: Estudiante[] = [
    {nie: "1234", EstadoApoyo: "Indefinido", fechaNacimiento: "23/12/2010", primerNombre: "Carlos", primerApellido: "Mejia", verDetalle: "Ver", Acciones: null}
  ]
  toggleTable() {
    this.showTable = !this.showTable;
  }

  searchButton:SaetButtonArgs = {
    buttonStyle: ButtonStyle.BLUE,
    text: "Buscar"
  }

  cleanInput() {
    console.log('clean input');
    this.inputNIE = ''
  }

  navigateToDetails() {
    if (this.inputNIE) {
      this.router.navigate(['/menu/saet-datos-estudiante',  this.inputNIE ]);
    }
  }

}
