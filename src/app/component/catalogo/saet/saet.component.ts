import {Component} from "@angular/core";
import {SeguridadService} from "../../../services/seguridad.service";
import {CookieService} from "ngx-cookie-service";
import {CatalogoServiceUsuarios} from "../../../services/catalogo/catalogo.service.usuarios";

@Component({
  selector: 'saet',
  templateUrl: './saet.component.html',
  styleUrls: ['./saet.component.css']
})
export class SaetComponent {
  constructor(private menuService: SeguridadService,
              private cookieService: CookieService,
              private catalogoServiceUsuarios: CatalogoServiceUsuarios,
              //,public themeService: ThemeService
  ) {
    console.log("constructor")
  }
  ngOnInit() {
    console.log("ini");
  }
}
