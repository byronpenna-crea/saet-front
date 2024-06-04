import {Component} from '@angular/core';
import {ButtonStyle, SaetButtonArgs} from "../../component/saet-button/saet-button.component";
import {TableColumn} from "../../component/saet-table/saet-table.component";
import {Router} from "@angular/router";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {IMessageComponent, MessageType, UserMessage} from "../../interfaces/message-component.interface";
import {userMessageInit} from "../../shared/messages.model";

interface Estudiante {
  nie: string;
  primerNombre: string;
  primerApellido: string;
  fechaNacimiento: string;
  EstadoApoyo: string;
  verDetalle: string;
  Acciones: null;
}
interface flowTableInterface {
  responsable: string;
  estadoApoyo: string;
  verDetalle: string;
}
/*interface tableInterface {
  cor: string;
  dai: string;
  ce: string;
  eee: string;
  codai: string;
  criedv: string
}*/

@Component({
  selector: 'app-buscar-estudiante',
  templateUrl: './buscar-estudiante.component.html',
  styleUrls: ['./buscar-estudiante.component.css']
})
export class BuscarEstudianteComponent implements IMessageComponent{
  inputNIE: string = '';
  userMessage: UserMessage = userMessageInit;
  cnResult: number = 0;
  onInputChange(value: string) {
    this.inputNIE = value;
  }

  constructor(private router: Router,
  private catalogoServiceCOR: CatalogoServiceCor
  ) {
  }

  showTable = false;
  showError = false;
  errorMessage = "";
  searchedNIE = "";

  flowColumns:TableColumn<flowTableInterface>[] = [
    {key: "responsable", header: "Responsables"},
    {key: "estadoApoyo", header: "Estado de apoyo"},
    {key: "verDetalle", header: "Ver detalle"},

  ]
  flowData = [
    { col1: 'Centro de Orientación y Recursos (COR)', col2: 'Sin atención', href: '/menu/saet-datos-estudiante' },
    { col1: 'Docente de Apoyo a la Inclusión (DAI)', col2: 'Sin atención', href: '' },
    { col1: 'Consejería Escolar (CE)', col2: 'Sin atención', href: '' },
    { col1: 'Escuela de Educación Especial (EEE)', col2: 'Sin atención', href: '' },
    { col1: 'Comité Departamental de Apoyo a la Inclusión (CODAI)', col2: 'Sin atención', href: '' },
    { col1: 'Centro de Recursos de Inclusión Educativa (CRIE-DV)', col2: 'Sin atención', href: '' },
  ]
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
  async goTo(link:string){
    if(link !== '' && link !== '#'){
      await this.router.navigate([link,  this.inputNIE ]);
    }
  }
  async toggleTable() {
    this.userMessage.showMessage = false;
    if (this.inputNIE) {
      try {
        const result = await this.catalogoServiceCOR.getStudentInfo(this.inputNIE);
        this.cnResult = 1;
        this.studentData = [
          {
            nie: result.estudiante.nie,
            EstadoApoyo: "Indefinido",
            fechaNacimiento: result.estudiante.fechaNacimiento,
            primerNombre: result.estudiante.nombreCompleto.split(' ')[0],
            primerApellido: result.estudiante.nombreCompleto.split(' ')[2],
            verDetalle: "Ver", Acciones: null}
        ]
        this.userMessage = {
          showMessage: false,
          message: "",
          titleMessage: "",
          type: MessageType.SUCCESS
        }
        /*this.showError = false;
        this.errorMessage = "";*/
        this.showTable = true;
      } catch (error) {

        this.userMessage = {
          showMessage: true,
          message: "Error al obtener la información del estudiante",
          type: MessageType.DANGER
        }



        this.showTable = false;
        console.error('error console', error);
      }
    }else{
      this.userMessage = {
        showMessage: true,
        message: "Escribe el NIE para realizar busqueda",
        titleMessage: "",
        type: MessageType.WARNING
      }

      this.showTable = false;
    }
  }

  searchButton:SaetButtonArgs = {
    buttonStyle: ButtonStyle.BLUE,
    text: "Buscar"
  }

  cleanInput() {
    this.inputNIE = ''
    this.userMessage.showMessage = false;
    this.showTable = false;
  }

  navigateToDetails() {
    if (this.inputNIE) {
      this.router.navigate(['/menu/saet-datos-estudiante',  this.inputNIE ]);
    }
  }

}
