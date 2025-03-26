import { Component } from '@angular/core';
import { SeguridadService } from '../../../../services/seguridad.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-saet-inicio',
  templateUrl: './saet-inicio.component.html',
  styleUrls: ['./saet-inicio.component.css']
})
export class SaetInicioComponent {
  nombre_usuario!: string | null;
  constructor(private menuService: SeguridadService,
              private cookieService: CookieService
  ){

  }
  ngOnInit() {
    this.nombre_usuario = localStorage.getItem('nombre');
  }
  cerrarSesion() {
    this.menuService.cerrarSesion();
  }
}
