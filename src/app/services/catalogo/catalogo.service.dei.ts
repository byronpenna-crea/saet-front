import {CatalogoServiceSaet} from "../shared/saet";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Departamentos} from "../../models/departamentos";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
export interface Schools {
  sed_pk: number,
  sed_codigo: number,
  sed_nombre: string,
  sed_correo_electronico: string
}
export interface PaeiGraficaResultado {
  resultados: PaeiGrafica[];
}
export interface PaeiGrafica {
  departamento: string;
  total: number;
}
export interface IGetDificultad {
  dificultad: string,
  total: number
}
export interface ISaveDificultad {
  est_pk: number,
  dificultades: number[]
}
export interface IFiltroDatosPaei{
  codigosDepartamentoRegion: string[]  | null,
  fechaInicio: string | null,
  fechaFin: string | null,
  estadoSocializado: number,
  estadoProceso: number,
  estadoFinalizado: number
}
export interface IFiltrosDificultad {
  codigosDepartamentoRegion: string[]  | null,
  fechaInicio: string | null,
  fechaFin: string | null
}
export interface PersonaApoyo {
  id: number,
  per_fk: {
    per_pk: number,
    per_primer_nombre: string,
    per_segundo_nombre: string,
    per_nombre_busqueda: string,
    per_email: string
  },
  rol_pk: {
    rol_pk: number,
    rol: string,
    description: string
  },
  sub_rol_fk: {
    sub_rol_pk: number,
    subcategoria: string
  }
  nombre_completo: string,
  dui: string,
  correo: string
}
@Injectable({
  providedIn: 'root',
})

export class CatalogoServiceDei extends CatalogoServiceSaet {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    cookieService: CookieService
  ) {
    super(cookieService);
  }
  public getPAEIByEstado(obj:IFiltroDatosPaei):Promise<PaeiGraficaResultado>{
    //console.log('estado', estado)
    const url = `${environment.API_SERVER_URL}/dei/datos-paei?estadoFinalizado=4`;
    return this.postRequest<IFiltroDatosPaei,PaeiGraficaResultado>(
      url,
      obj,
    );
    // return new Promise((resolve, reject) => {
    //   fetch(url, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${this.cookieService.get('token')}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //     .then(response => {
    //       if (response.ok) {
    //         resolve(response.json());
    //       } else {
    //         reject(new Error('No se pudo obtener los datos'));
    //       }
    //     })
    //     .catch(error => {
    //       reject(new Error('Hubo un error al obtener los datos: ' + error.message));
    //     });
    // });
  }
  public getPersonaApoyoByDui(dui:string):Promise<PersonaApoyo>{
    const url = `${environment.API_SERVER_URL}/tempEstudiantesSigesv2/personaApoyoByDui/${dui}`;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.cookieService.get('token')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al obtener los datos: ' + error.message));
        });
    });
  }
  public getGraficaDificultad():Promise<{resultados: IGetDificultad[]}> {
    const url = `${environment.API_SERVER_URL}/dei/datos-dificultad`;
    return this.postRequest<IFiltrosDificultad,{resultados: IGetDificultad[]} >(
      url,
      {
        fechaFin: null,
        codigosDepartamentoRegion: null,
        fechaInicio: null
      },
    );
    // return new Promise((resolve, reject) => {
    //   fetch(url, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${this.cookieService.get('token')}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //     .then(response => {
    //       if (response.ok) {
    //         resolve(response.json());
    //       } else {
    //         reject(new Error('No se pudo obtener los datos'));
    //       }
    //     })
    //     .catch(error => {
    //       reject(new Error('Hubo un error al obtener los datos: ' + error.message));
    //     });
    // });
  }
  public getDaiCount():Promise<number> {
    const url = `${environment.API_SERVER_URL}/tempEstudiantesSigesv2/dai/count`;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.cookieService.get('token')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al obtener los datos: ' + error.message));
        });
    });
  }
  public getCorCount():Promise<number> {
    const url = `${environment.API_SERVER_URL}/tempEstudiantesSigesv2/cor/count`;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.cookieService.get('token')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al obtener los datos: ' + error.message));
        });
    });
  }
  public getAllSchools():Promise<Schools[]>{
    const url = `${environment.API_SERVER_URL}/sedes/dei`;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.cookieService.get('token')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al obtener los datos: ' + error.message));
        });
    });
  }
  public getAllDepartamentos(): Promise<Departamentos[]> {
    const url = `${environment.API_SERVER_URL}/listaDepartamentos08032023/`;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.cookieService.get('token')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al obtener los datos: ' + error.message));
        });
    });
  }
}
