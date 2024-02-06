import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceSgAfEmpleados {

///////private API_SERVER_ALL_EMPLEADOS = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/sg_af_empleados/`;//v1
private API_SERVER_ALL_EMPLEADOS = `${environment.API_SERVER_URL}/sg_af_empleados/`;//v2
///////private API_SERVER_ALL_BITACORA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeBitacoraReportesAud/`;//v1
///////private API_SERVER_ALL_TABLERO = `${environment.API_SERVER_URL}/tableros/`;//v2
private API_SERVER_ALL_BITACORA = `${environment.API_SERVER_URL}/listaDeBitacoraReportesAud/`;//v2


  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }



  public getAllBitacoras(): Promise<any> {
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_ALL_BITACORA, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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



  public getEmpleadosPorUnidadesAdministrativas(emp_unidad_administrativa_fk:number): Promise<any> {
    const url = `${this.API_SERVER_ALL_EMPLEADOS}porUnidadAdministrativa/${emp_unidad_administrativa_fk}`;//v1
    const token: string | null = this.cookieService.get('token');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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
