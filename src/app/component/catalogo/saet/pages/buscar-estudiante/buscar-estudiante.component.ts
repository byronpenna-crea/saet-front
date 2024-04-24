import {Component} from '@angular/core';
import {ButtonStyle, SaetButtonArgs} from "../../component/saet-button/saet-button.component";
import {IconComponent} from "../../shared/component.config";
import {TableColumn} from "../../component/saet-table/saet-table.component";
interface Estudiante {
  nie: string;
  primerNombre: string;
  primerApellido: string;
  fechaNacimiento: string;
  EstadoApoyo: string;
  verDetalle: string;
}
@Component({
  selector: 'app-buscar-estudiante',
  templateUrl: './buscar-estudiante.component.html',
  styleUrls: ['./buscar-estudiante.component.css']
})
export class BuscarEstudianteComponent {
  showTable = false;
  studentTableColumns:TableColumn<Estudiante>[] = [
    { key: "nie", header: "NIE" },
    { key: "primerApellido", header: "Primer apellido" },
    { key: "primerNombre", header: "Primer nombre"},
    { key: "fechaNacimiento", header: "Fecha nacimiento" },
    { key: "EstadoApoyo", header: "Estado de apoyo" }
  ];
  studentData: Estudiante[] = [
    {nie: "1234", EstadoApoyo: "Indefinido", fechaNacimiento: "23/12/2010", primerNombre: "Carlos", primerApellido: "Mejia", verDetalle: "Ver"}
  ]
  toggleTable() {
    this.showTable = !this.showTable;
  }

  searchButton:SaetButtonArgs = {
    buttonStyle: ButtonStyle.BLUE,
    text: "Buscar"
  }



}
