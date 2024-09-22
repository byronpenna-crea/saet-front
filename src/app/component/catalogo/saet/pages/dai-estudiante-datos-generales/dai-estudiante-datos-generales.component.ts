import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {CorBaseComponent} from "../../CorBaseComponent";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {SAET_MODULE} from "../../shared/evaluaciones";
import {DaiBaseComponent} from "../../DaiBaseComponent";
import {CatalogoServiceDai} from "../../../../../services/catalogo/catalogo.service.dai";
import {generalInformationInit, institutionalInfoInit, trustedAdultInfoInit} from "../../shared/information-tab.model";
import {IinformationTab} from "../../component/tabs/tabs.component";

@Component({
  selector: 'app-dai-estudiante-datos-generales',
  templateUrl: './dai-estudiante-datos-generales.component.html',
  styleUrls: ['./dai-estudiante-datos-generales.component.css']
})
export class DaiEstudianteDatosGeneralesComponent extends DaiBaseComponent {
  generalInformation: IinformationTab = generalInformationInit;
  trustedAdultInfo: IinformationTab = trustedAdultInfoInit;
  institutionalInfo: IinformationTab = institutionalInfoInit;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceDai: CatalogoServiceDai,
    private cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    router: Router
  ) {
    super(document, catalogoServiceDai, route, router);
    this.pageLoading = true;
    this.loadStudentInfo()
      .then(estudiante => {
        const { generalInformation, institutionalInfo, trustedAdultInfo } =
          this.populateStudentInformation(estudiante);
        this.generalInformation = {
          ...this.generalInformation,
          values: [...generalInformation.values],
        };

        this.institutionalInfo = {
          ...this.institutionalInfo,
          values: [...institutionalInfo.values],
        };

        this.trustedAdultInfo = {
          ...this.trustedAdultInfo,
          values: [...trustedAdultInfo.values],
        };
        console.log('trusted adult info ', trustedAdultInfo);
        this.cdr.markForCheck();
      })
      .catch(e => {
        console.log('Error loading student info in derived component:', e);
      }).finally(() => {

      this.pageLoading = false;
    });
  }

  protected readonly SAET_MODULE = SAET_MODULE;
}
