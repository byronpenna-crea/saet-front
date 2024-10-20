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
