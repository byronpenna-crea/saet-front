import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {BaseComponent} from "../../BaseComponent";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-dai-estudiante-datos-generales',
  templateUrl: './dai-estudiante-datos-generales.component.html',
  styleUrls: ['./dai-estudiante-datos-generales.component.css']
})
export class DaiEstudianteDatosGeneralesComponent extends BaseComponent {
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    private cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    router: Router
  ) {
    super(document, catalogoServiceCOR, route, router);

  }
}
