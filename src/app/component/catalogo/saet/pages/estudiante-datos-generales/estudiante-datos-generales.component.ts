import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {QuestionType} from "../../shared/component.config";
import {ActivatedRoute, Router} from "@angular/router";
import {IOptionType} from "../../component/saet-question/saet-question.component";

interface IinformationTab {
  labels: string[],
  values: string[],
  legend: string,
  isActive: boolean
}
interface iQuestion {
  tipoPregunta: string,
  pregunta: string,
  opcion: { id_option: number, opcion: string }[]
}
interface iSurvey {
  titulo: string,
  preguntas: iQuestion[]
}
enum informationTabMapping {
  NOMBRE_COMPLETO = 0
}
@Component({
  selector: 'app-estudiante-datos-generales',
  templateUrl: './estudiante-datos-generales.component.html',
  styleUrls: ['./estudiante-datos-generales.component.css']
})


export class EstudianteDatosGeneralesComponent {
  corSurveys:iSurvey[] = [];
  nie:string = "";
  generalInformation:IinformationTab = {
    isActive: false,
    legend: 'Datos personales del estudiante',
    labels: [
      'Nombre completo:',
      'NIE:',
      'Fecha de nacimiento:',
      'Dirección:',
      'Teléfono:',
      'Correo electrónico:'
    ],
    values: []
  }
  trustedAdultInfo:IinformationTab = {
    isActive: false,
    legend: "Datos de responsable(s) del estudiante",
    labels: [
      'Nombre completo:',
      'DUI:',
      'NIT:',
      'Dirección:',
      'Teléfono:',
    ],
    values: []
  }
  institutionalInfo:IinformationTab = {
    isActive: false,
    legend: "Datos institucionales",
    labels: [
      "Centro Escolar al que pertenece:",
      "Código de Centro Escolar:",
      "Dirección de Centro Escolar:",
      "Último grado cursado:",
      "Grado actual:",
      "Sección:",
      "Docente de aula responsable:",
      "Correo electrónico de docente:",
      "Teléfono de docente:"
    ],
    values: []
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceCOR: CatalogoServiceCor,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
      }
    });

    catalogoServiceCOR.getStudentInfo(this.nie).then((result) => {
      this.generalInformation = {
        ...this.generalInformation,
        values: [
          result.estudiante.nombreCompleto,
          result.estudiante.nie,
          result.estudiante.fechaNacimiento,
          result.estudiante.direccion,
          result.estudiante.telefono[0],
          result.estudiante.correo
        ]
      };
      this.institutionalInfo = {
        ...this.institutionalInfo,
        values: [
          result.centroEducativo.nombre,
          result.centroEducativo.codigo,
          result.centroEducativo.direccion,
          result.centroEducativo.ultimoGradoCursado,
          result.centroEducativo.gradoActual,
          result.centroEducativo.seccion,
          result.centroEducativo.docenteOrientador,
          result.centroEducativo.correoOrientador,
          result.centroEducativo.telefonoOrientador[0]
        ]
      };
      this.trustedAdultInfo = {
        ...this.institutionalInfo,
        values: [
          result.responsables.nombre,
          result.responsables.dui,
          result.responsables.nit,
          result.responsables.direccion,
          result.responsables.telefono,
        ]
      }
      this.cdr.markForCheck();
    })
  }

  handleDatosGeneralesClick(): void {
    this.router.navigate(['/#/saet']);
  }
}
