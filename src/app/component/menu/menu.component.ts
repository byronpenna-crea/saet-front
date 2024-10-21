import { Component, ComponentRef, ViewChild, HostListener } from '@angular/core';
import { MenuItem } from "primeng/api";
import { Sgp_menus_opciones_menus } from 'src/app/models/sgp_menus_opciones_menus';
import { Usuarios } from 'src/app/models/usuarios';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ThemeService } from 'src/app/services/ThemeService';
import { MatDrawer } from '@angular/material/sidenav';
import { InicioComponent } from '../inicio/inicio.component';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  shouldScroll = false;
  isDarkMode!: boolean;



  constructor(private menuService: SeguridadService,private cookieService: CookieService,
    //private inicioComponent:InicioComponent
    //,public themeService: ThemeService
  ) {


  }

  title = 'MINEDUCYT';
  gfg: MenuItem[] = [];
  gfgv2: MenuItem[] = [];
  gfgv3: MenuItem[] = [];
  lista_menus_opciones_menu: Sgp_menus_opciones_menus[] = [];
  menuOpcionesMenu!: Sgp_menus_opciones_menus;
  item!: MenuItem;
  nombre_usuario!: string | null;
  rolApoyo?: string = '';
  subRolApoyo?: string;
  @ViewChild('drawer') drawer!: MatDrawer;
  isMobileMenuVisible: boolean = false;
  opcion_menu!: string | null;


  @HostListener('window:resize')
  onWindowResize() {
    this.updateMobileMenuVisibility();
  }

  updateMobileMenuVisibility() {
    const screenWidth = window.innerWidth;
    this.isMobileMenuVisible = screenWidth > 600;
    if (this.drawer) {
      this.drawer.toggle(this.isMobileMenuVisible);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
    if (this.drawer) {
      this.drawer.toggle(this.isMobileMenuVisible);
    }
  }


/*
//v1
 ngOnInit() {
    this.updateMobileMenuVisibility();
    this.nombre_usuario = localStorage.getItem('nombre');


    const menuMap = new Map();




    this.menuService.getAllMenusUsuarios()
      .then(response => {
        //console.log(response)

        this.lista_menus_opciones_menu = response;


        this.lista_menus_opciones_menu.forEach(m => {
          console.log("Estoy dentro del menú_opciones_menu: " + m.id_menu_opcione_menu);
          console.log("Estoy dentro del menú: " + m.id_menu.id_menu);
          console.log("Estoy dentro del opción: " + m.id_opcion_menu.id_opcion_menu);
        });

        this.lista_menus_opciones_menu.forEach(m => {
          const menuLabel = m.id_menu.nombre_menu;
          const menuIcon = m.id_menu.icono;
          const menuItem: MenuItem = {
            label: '' + menuLabel,
            icon: '' + menuIcon,
            items: []
          };

          const menuItemChild: MenuItem = {
            label: '' + m.id_opcion_menu.nombre_opcion,
            icon: '' + m.id_opcion_menu.icono,
            routerLink: '' + m.id_opcion_menu.router_link
          };

          // Verifica si el menú principal ya está en el mapa
          if (menuMap.has(menuLabel)) {
            // Si ya existe, agrega el menuItemChild al submenú existente
            const menu = menuMap.get(menuLabel);
            menu.items?.push(menuItemChild);
          } else {
            // Si no existe, crea un nuevo objeto MenuItem para el menú principal
            menuItem.items?.push(menuItemChild);
            menuMap.set(menuLabel, menuItem);
          }
        });

        menuMap.forEach(menu => {
          this.gfgv2.push(menu);
        });
        this.gfgv2;
        this.gfgv3 = this.gfgv2;
        // console.log(this.menuItems);
      }).catch(error => {

      });








  }

  cerrarSesion() {
    this.menuService.cerrarSesion();
  }


  };


*/

ngOnInit() {
  this.updateMobileMenuVisibility();
  this.nombre_usuario = localStorage.getItem('nombre');
  this.rolApoyo = localStorage.getItem('rolApoyo') ?? '';
  this.subRolApoyo = localStorage.getItem('especialidad') ?? undefined;
  const menuMap = new Map();
  this.opcion_menu=this.cookieService.get('opcionMenuPrincipal');

    this.menuService.getAllMenusUsuarios(this.opcion_menu)
      .then(response => {
        this.lista_menus_opciones_menu = response;
        ////////console.log(this.lista_menus_opciones_menu);

        // Filtrar duplicados en función de id_menu y id_opcion_menu
        const filteredMenus = this.lista_menus_opciones_menu.filter((value, index, self) => {
          const id_menu = value.id_menu.id_menu;
          const id_opcion_menu = value.id_opcion_menu.id_opcion_menu;
          return self.findIndex(v => v.id_menu.id_menu === id_menu && v.id_opcion_menu.id_opcion_menu === id_opcion_menu) === index;
        });

        filteredMenus.forEach(m => {
          const menuLabel = m.id_menu.nombre_menu;
          const menuIcon = m.id_menu.icono;
          const menuItem: MenuItem = {
            label: '' + menuLabel,
            icon: '' + menuIcon,
            items: []
          };

          const menuItemChild: MenuItem = {
            label: '' + m.id_opcion_menu.nombre_opcion,
            icon: '' + m.id_opcion_menu.icono,
            routerLink: '' + m.id_opcion_menu.router_link
          };

          // Verifica si el menú principal ya está en el mapa
          if (menuMap.has(menuLabel)) {
            // Si ya existe, agrega el menuItemChild al submenú existente
            const menu = menuMap.get(menuLabel);
            menu.items?.push(menuItemChild);
          } else {
            // Si no existe, crea un nuevo objeto MenuItem para el menú principal
            menuItem.items?.push(menuItemChild);
            menuMap.set(menuLabel, menuItem);
          }
        });

        menuMap.forEach(menu => {
          this.gfgv2.push(menu);
        });
        this.gfgv2;
        this.gfgv3 = this.gfgv2;
        // Resto del código
      }).catch(error => {
        // Manejar errores si es necesario
      });



}

cerrarSesion() {
  this.menuService.cerrarSesion();
}
};
