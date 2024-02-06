import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceDocumentoEmpleado {

//////private API_SERVER_ALL_DOCUMENTO_EMPLEADO = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/bienesDepreciables/`;//v1
private API_SERVER_ALL_DOCUMENTO_EMPLEADO = `${environment.API_SERVER_URL}/bienesDepreciables/`;//v2
//////////private API_SERVER_ALL_ACTA_RESPONSABILIDAD = `${environment.API_SERVER_URL}/unidadesActivoFijo/`;//v2


  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }



/*
 cargarActaResponsabilidad(bde_empleado_fk: number): Promise<any> {
    const url = `${this.API_SERVER_ALL_DOCUMENTO_EMPLEADO}cargarActaDeResponsabilidad/${bde_empleado_fk}`;//v1
    const token: string | null = this.cookieService.get('token');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
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


  */

  cargarActaResponsabilidad(selectedFile: any, bde_empleado_fk: number): Promise<any> {
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_ALL_DOCUMENTO_EMPLEADO}cargarActaDeResponsabilidad/${bde_empleado_fk}`;

    const formData = new FormData();
    formData.append('archivo', selectedFile);

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData  // Enviamos el archivo en el cuerpo de la solicitud
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















