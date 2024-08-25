import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Sgp_menu_principal } from 'src/app/models/sgp_menu_principal';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { CatalogoServiceUsuarios } from 'src/app/services/catalogo/catalogo.service.usuarios';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  nombre_usuario!: string | null;
  dui_usuario!: string | null;
  lista_menus_principales: Sgp_menu_principal[] = [];
  W1!: boolean;
  W2!: boolean;
  W3!: boolean;
  W4!: boolean;
  W9!: boolean;
  W10!: boolean;
  W12!: boolean;
  W11!: boolean;
  W7!: boolean;
  W5!: boolean;
  W8!: boolean;
  W6!: boolean;
  W15!: boolean;
  W16!: boolean;
  W18!: boolean;
  W13!: boolean;
  W14!: boolean;
  R34!: boolean;
  W19!: boolean;


  constructor(private menuService: SeguridadService,
    private cookieService: CookieService,
    private catalogoServiceUsuarios: CatalogoServiceUsuarios,
    //,public themeService: ThemeService
  ) {
    // Define tu lista de objetos con la propiedad ope_codigo


  }

  ngOnInit() {

    this.nombre_usuario = localStorage.getItem('nombre');
    //console.log("El nombre del usuario en el menu es: " + this.nombre_usuario);
    this.dui_usuario=localStorage.getItem('dui');




    this.menuService.getAllMenusPrincipales()
      .then(response => {
        console.log('All menus principales ----',response)

        this.lista_menus_principales = response;





        // Itera sobre tu lista de objetos y establece las variables en true según coincidencias
        for (const item of this.lista_menus_principales) {

          if (item.ope_codigo === 'W1') {
            //console.log("Estoy en 1");
            this.W1 = true;
          } else if (item.ope_codigo === 'W2') {
            //console.log("Estoy en 2");
            this.W2 = true;
          }else if (item.ope_codigo === 'W3') {
            //console.log("Estoy en 3");
            this.W3 = true;
          }else if (item.ope_codigo === 'W4') {
            //console.log("Estoy en 4");
            this.W4 = true;
          }else if (item.ope_codigo === 'W9') {
            //console.log("Estoy en 9");
            this.W9 = true;
          }else if (item.ope_codigo === 'W10') {
            //console.log("Estoy en 10");
            this.W10 = true;
          }else if (item.ope_codigo === 'W12') {
            //console.log("Estoy en 12");
            this.W12 = true;
          }else if (item.ope_codigo === 'W11') {
            //console.log("Estoy en 11");
            this.W11 = true;
          }else if (item.ope_codigo === 'W7') {
            //console.log("Estoy en 7");
            this.W7 = true;
          }else if (item.ope_codigo === 'W5') {
            //console.log("Estoy en 5");
            this.W5 = true;
            //this.menuService.opcion_menu='W5';



          }else if (item.ope_codigo === 'W8') {
           // console.log("Estoy en 8");
            this.W8 = true;
          }else if (item.ope_codigo === 'W2') {
            //console.log("Estoy en 2");
            this.W2 = true;
          }else if (item.ope_codigo === 'W6') {
            //console.log("Estoy en 6");
            this.W6 = true;
          }else if (item.ope_codigo === 'W15') {
            //console.log("Estoy en 15");
            this.W15 = true;
          }else if (item.ope_codigo === 'W16') {
            //console.log("Estoy en 16");
            this.W16 = true;
          }else if (item.ope_codigo === 'W18') {
            //console.log("Estoy en 18");
            this.W18 = true;
          }else if (item.ope_codigo === 'W13') {
            //console.log("Estoy en 13");
            this.W13 = true;
          }else if (item.ope_codigo === 'W14') {
            //console.log("Estoy en 14");
            this.W14 = true;
          }else if (item.ope_codigo === 'R34') {
            //console.log("Estoy en 34");
            this.R34 = true;
          }else if (item.ope_codigo === 'W19') {
            //console.log("Estoy en 19");
            this.W19 = true;
          }

          //console.log("La opción en menu principal es***+++: " + item.ope_pk);


        }


      }).catch(error => {
        console.log("Error al obtener el menú de usuarios: " + error)
      });





  }

  cerrarSesion() {
    this.menuService.cerrarSesion();
  }

// Esta función se llama cuando se hace clic en el elemento
cambiarOpcionMenu(opcion: string) {
  console.log("La opción en inicio es: " + opcion);

  this.menuService.opcion_menu = opcion;
  this.cookieService.set('opcionMenuPrincipal',opcion);
}




}
