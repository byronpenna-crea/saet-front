import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Personas } from '../models/personas';
import { HttpHeaders } from '@angular/common/http';
import { Usuarios } from '../models/usuarios';
import { Usuarios_login } from '../models/usuarios_login';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Sgp_menus } from '../models/sgp_menus';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeguridadService {
  datosLogin!: any;
  public opcion_menu!: string | null;
  usuario!: Usuarios;
  private API_SERVER = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaUsuarios08032023/`;
  //////private API_SERVER_MENUS_OPCIONES = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaMenusOpcionesMenus08032023/`; //v1
  private API_SERVER_MENUS_OPCIONES = `${environment.API_SERVER_URL}/listaMenusOpcionesMenus08032023/`; //v2
  //////private API_SERVER_MENUS_PRINCIPALES = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaMenusPrincipales/`; //v1
  private API_SERVER_MENUS_PRINCIPALES = `${environment.API_SERVER_URL}/listaMenusPrincipales/`; //v2
  private API_SERVER_MENUS = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaMenus08032023/`;
  private API_SERVER_SUB_MENUS = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaSubMenus08032023/`;
  private API_SERVER_SUB_LISTA_DEPARTAMENTOS = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDepartamentos08032023/`;
  private API_SERVER_LISTA_MUNICIPIOS_POR_DEPARTAMENTO = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaMunicipiosPorDepartamento08032023/`;
  private API_SERVER_REGISTRAR_PERSONA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/persona08032023/`;
  /////////private API_SERVER_LOGIN = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/login`; //v1
  /////////private API_SERVER_LOGIN = `${environment.API_SERVER_URL}/login`;//v2
  /////////private API_SERVER_LOGIN = `${environment.API_SERVER_URL}/login`;//v3
  private API_SERVER_LOGIN = `${environment.API_SERVER_URL_SEGURIDAD}/login`; //v4
  /////private API_SERVER_ROLES = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/sg_roles/`; //v1
  private API_SERVER_ROLES = `${environment.API_SERVER_URL}/sg_roles/`; //v2

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.datosLogin = {};
  }

  /*

    public getAllUsuarios():Observable<any>{
       console.log("Estoy en seguridad servicio-02");
      return this.httpClient.get(this.API_SERVER)

    }

  */

  ///*
  public getAllUsuarios(): Promise<any> {
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(
            new Error('Hubo un error al obtener los datos: ' + error.message)
          );
        });
    });
  }

  //*/

  /*
  public getAllMenusUsuarios():Observable<any>{

// Obtener el token de la cookie
const token: string | null = localStorage.getItem('token');

console.log("Estoy en menusUsuarios: "+token);

// Configurar las opciones de la solicitud HTTP con el token
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
};


    console.log("Estoy en seguridad servicio-02");
   return this.httpClient.get(this.API_SERVER_MENUS_OPCIONES, httpOptions)

 }

*/

  public getAllMenusUsuarios(ope_codigo: string): Promise<any> {
    //const token: string | null = localStorage.getItem('token');
    const token: string | null = this.cookieService.get('token');
    const dui: string | null = localStorage.getItem('dui');
    const url = `${this.API_SERVER_MENUS_OPCIONES}${dui}/${ope_codigo}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(
            new Error('Hubo un error al obtener los datos: ' + error.message)
          );
        });
    });
  }

  public getAllRolesUsuarios(): Promise<any> {
    //const token: string | null = localStorage.getItem('token');
    const token: string | null = this.cookieService.get('token');
    const dui: string | null = localStorage.getItem('dui');
    const url = `${this.API_SERVER_MENUS_OPCIONES}buscarRolesPorDui/${dui}`;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(
            new Error('Hubo un error al obtener los datos: ' + error.message)
          );
        });
    });
  }

  public getAllMenusPrincipales(): Promise<any> {
    //const token: string | null = localStorage.getItem('token');
    const token: string | null = this.cookieService.get('token');
    const dui: string | null = localStorage.getItem('dui');
    const url = `${this.API_SERVER_MENUS_PRINCIPALES}${dui}`;
    console.log('El token es: ' + token);
    console.log('El dui es: ' + dui);
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(
            new Error('Hubo un error al obtener los datos: ' + error.message)
          );
        });
    });
  }

  public getAllMenus(): Observable<any> {
    return this.httpClient.get(this.API_SERVER_MENUS);
  }

  public getAllSubMenus(): Observable<any> {
    return this.httpClient.get(this.API_SERVER_SUB_MENUS);
  }

  /*

  public getAllDepartamentos():Observable<any>{

    return this.httpClient.get(this.API_SERVER_SUB_LISTA_DEPARTAMENTOS)

  }

  */

  public getAllDepartamentos(): Promise<any> {
    const url = this.API_SERVER_SUB_LISTA_DEPARTAMENTOS;
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(
            new Error('Hubo un error al obtener los datos: ' + error.message)
          );
        });
    });
  }

  /*
  public getAllaMunicipiosPorDepartamento(idDepartamento:any):Observable<any>{

    console.log("Esstoy dentro del metodo01: "+idDepartamento);

     return this.httpClient.get(this.API_SERVER_LISTA_MUNICIPIOS_POR_DEPARTAMENTO+idDepartamento);

       }

  */

  public getAllMunicipiosPorDepartamento(idDepartamento: any): Promise<any> {
    const url = `${this.API_SERVER_LISTA_MUNICIPIOS_POR_DEPARTAMENTO}${idDepartamento}`;
    const token: string | null = this.cookieService.get('token');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(
            new Error('Hubo un error al obtener los datos: ' + error.message)
          );
        });
    });
  }

  obtenerDatosPorDUI(dui: string): Promise<any> {
    const url = `${this.API_SERVER_REGISTRAR_PERSONA}${dui}`;
    const token: string | null = this.cookieService.get('token');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(
            new Error('Hubo un error al obtener los datos: ' + error.message)
          );
        });
    });
  }

  /*
       public savePersona(persona:Personas): Observable<any>{

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'

          })};

        return this.httpClient.post(this.API_SERVER_REGISTRAR_PERSONA,persona, httpOptions);

          }

  */

  public savePersona(persona: Personas): Promise<any> {
    const url = this.API_SERVER_REGISTRAR_PERSONA;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(persona),
    };

    return new Promise((resolve, reject) => {
      fetch(url, httpOptions)
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo guardar los datos'));
          }
        })
        .catch(error => {
          reject(
            new Error('Hubo un error al guardar los datos: ' + error.message)
          );
        });
    });
  }

  /*
          validarUsuario(usuario: string, contrasena: string): Observable<any> {
            this.datosLogin = { usuario, contrasena };
            return this.httpClient.post(this.API_SERVER_LOGIN, this.datosLogin, { observe: 'response' }).pipe(
              map((response: HttpResponse<any>) => {

                const token = response.body.token;
                const nombre = response.body.nombre;
                const dui = response.body.dui;



                if (token) {
                  //localStorage.setItem('token', token);
                  //console.log("Estoy dentro del if del token, el valor del usuario es: "+this.datosLogin.usuario)
                  localStorage.setItem('nombre', nombre);
                  localStorage.setItem('dui', dui);
                  console.log("Estoy dentro del if del token, el valor del nombre es: "+nombre)
                  console.log("Estoy dentro del if del token, el valor del dui es: "+dui)
                  localStorage.setItem('usuario', this.datosLogin.usuario);
                  this.router.navigate(['/menu']);
                }

                return token;
              })
            );


          }


  */

  //Para el sigest.
  validarUsuario(usu_codigo: string, usu_password: string): Observable<any> {
    this.datosLogin = { usu_codigo, usu_password };

    const datosMockeados =
      usu_codigo === 'usuario_psicologia' && usu_password === 'pass_psicologia'
        ? {
            body: {
              token: 'token_simulado',
              nombre: 'Francisca Eunice Lopez Orellana',
              dui: '05012569-0',
              id_persona: 3,
              primer_nombre: 'Francisca',
              primer_apellido: 'Lopez',
              especialidad: 'psicologia',
            },
          }
        : usu_codigo === 'usuario_psicologia2' &&
            usu_password === 'pass_psicologia2'
          ? {
              body: {
                token: 'token_simulado',
                nombre: 'Byron Aldair Peña Portillo',
                dui: '00000000-0',
                id_persona: 4,
                primer_nombre: 'Rosa',
                primer_apellido: 'García',
                especialidad: 'psicologia',
              },
            }
          : usu_codigo === 'usuario_pedagogia' &&
              usu_password === 'pass_pedagogia'
            ? {
                body: {
                  token: 'token_simulado',
                  nombre: 'Rosa Emilia García Pérez',
                  dui: '03546699-1',
                  id_persona: 5,
                  primer_nombre: 'Rosa',
                  primer_apellido: 'García',
                  especialidad: 'pedagogia',
                },
              }
            : usu_codigo === 'usuario_pedagogia2' &&
                usu_password === 'pass_pedagogia2'
              ? {
                  body: {
                    token: 'token_simulado',
                    nombre: 'Miguel Ángel Torres López',
                    dui: '12345678-9',
                    id_persona: 7,
                    primer_nombre: 'Miguel',
                    primer_apellido: 'Torres',
                    especialidad: 'pedagogia',
                  },
                }
              : usu_codigo === 'usuario_lenguaje' &&
                  usu_password === 'pass_lenguaje'
                ? {
                    body: {
                      token: 'token_simulado',
                      nombre: 'Edgardo José Gómez Peraza',
                      dui: '00000000-0',
                      id_persona: 6,
                      primer_nombre: 'Edgardo',
                      primer_apellido: 'Gómez',
                      especialidad: 'lenguaje',
                    },
                  }
                : usu_codigo === 'usuario_lenguaje2' &&
                    usu_password === 'pass_lenguaje2'
                  ? {
                      body: {
                        token: 'token_simulado',
                        nombre: 'Ana María González Ruiz',
                        dui: '98765432-1',
                        id_persona: 8,
                        primer_nombre: 'Ana',
                        primer_apellido: 'González',
                        especialidad: 'lenguaje',
                      },
                    }
                  : {};

    return of(datosMockeados).pipe(
      map((response: any) => {
        const token = response.body.token;
        const nombre = response.body.nombre;
        const dui = response.body.dui;
        const id_persona = response.body.id_persona;
        const primer_nombre = response.body.primer_nombre;
        const primer_apellido = response.body.primer_apellido;
        const especialidad = response.body.especialidad;

        localStorage.setItem('nombre', nombre);
        localStorage.setItem('dui', dui);
        localStorage.setItem('id_persona', id_persona.toString());
        localStorage.setItem('primer_nombre', primer_nombre);
        localStorage.setItem('primer_apellido', primer_apellido);
        localStorage.setItem('usuario', this.datosLogin.usu_codigo);
        localStorage.setItem('especialidad', especialidad);
        return token; // Devolver el token simulado
      })
    );

    return this.httpClient
      .post(this.API_SERVER_LOGIN, this.datosLogin, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          const token = response.body.token;
          const nombre = response.body.nombre;
          const dui = response.body.dui;
          const id_persona = response.body.id_persona;
          const primer_nombre = response.body.primer_nombre;
          const primer_apellido = response.body.primer_apellido;
          const especialidad = response.body.especialidad;

          //if (token) {
          //localStorage.setItem('token', token);
          //console.log("Estoy dentro del if del token, el valor del usuario es: "+this.datosLogin.usuario)
          localStorage.setItem('nombre', nombre);
          localStorage.setItem('dui', dui);
          localStorage.setItem('id_persona', id_persona);
          localStorage.setItem('primer_nombre', primer_nombre);
          localStorage.setItem('primer_apellido', primer_apellido);
          localStorage.setItem('especialidad', especialidad);

          //console.log("Estoy dentro del if del token, el valor del nombre es: "+nombre)
          //console.log("Estoy dentro del if del token, el valor del dui es: "+dui)
          localStorage.setItem('usuario', this.datosLogin.usuario);
          this.router.navigate(['/inicio']);
          //}

          return token;
        })
      );
  }

  opcionMenuPricipal(opcion_menu: string) {
    this.opcion_menu = opcion_menu;
  }

  /*
  validarUsuario(usuario: string, contrasena: string): Observable<any> {
    this.datosLogin = { usuario, contrasena };

    return this.httpClient.post(this.API_SERVER_LOGIN, this.datosLogin, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {

        const jsonResponse = response.body;
        const token = jsonResponse.token;
        console.log("Estoy en validarUsuario 01: "+token);

        if (token) {
          //localStorage.setItem('token', token);
          console.log("Estoy en validarUsuario 02: "+token);
          localStorage.setItem('usuario', this.datosLogin.usuario);
          this.router.navigate(['/menu']);
        }
        return token;
      })
    );
  }
  */

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('dui');
    localStorage.removeItem('usuario');
    localStorage.removeItem('nombre');
    this.cookieService.deleteAll();
    // Aquí podrías agregar una redirección a la página de inicio de sesión
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  obtenerRolesPorUsuario(dui_usuario: any): Promise<any> {
    const url = `${this.API_SERVER_ROLES}${dui_usuario}`;
    const token: string | null = this.cookieService.get('token');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(
            new Error('Hubo un error al obtener los datos: ' + error.message)
          );
        });
    });
  }
}
