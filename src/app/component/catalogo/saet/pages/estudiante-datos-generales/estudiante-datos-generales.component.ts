import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseComponent} from "../../BaseComponent";
import {generalInformationInit, institutionalInfoInit, trustedAdultInfoInit} from "../../shared/information-tab.model";

interface IinformationTab {
  labels: string[],
  values: string[],
  legend: string,
  isActive: boolean
}
interface iQuestion {
  tipoPregunta: string,
  pregunta: string,
  opcion: { id_opcion: number, opcion: string }[]
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


export class EstudianteDatosGeneralesComponent extends BaseComponent{
  corSurveys:iSurvey[] = [];

  generalInformation:IinformationTab = generalInformationInit;
  trustedAdultInfo:IinformationTab = trustedAdultInfoInit;
  institutionalInfo:IinformationTab = institutionalInfoInit;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    private cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    router: Router
  ){
    super(document, catalogoServiceCOR, route, router);
    this.loadStudentInfo().then((estudiante) => {
      const { generalInformation, institutionalInfo, trustedAdultInfo } = this.populateStudentInformation(estudiante);

      this.generalInformation = {
        ...this.generalInformation,
        values: [
          ...generalInformation.values
        ]
      }

      this.institutionalInfo = {
        ...this.institutionalInfo,
        values: [
          ...institutionalInfo.values
        ]
      }

      this.trustedAdultInfo = {
        ...this.trustedAdultInfo,
        values: [
          ...trustedAdultInfo.values
        ]
      }
      console.log("trusted adult info ",trustedAdultInfo);
      this.cdr.markForCheck();
    }).catch((e) => {
      console.log('Error loading student info in derived component:', e);
    });
  }

  handleDatosGeneralesClick(): void {
    this.router.navigate(['/#/saet']);
  }
}
