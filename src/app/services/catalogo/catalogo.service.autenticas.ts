import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Sgp_tempEstudiantes } from 'src/app/models/sgp_temp_estudiantes';
import { environment } from 'src/app/environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceAutenticas {
  //////////private API_SERVER_URL = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}`;//v1
  private API_SERVER_URL = `${environment.API_SERVER_URL}`;//v2
  private API_SERVER_SELLOS_FIRMAS = `${this.API_SERVER_URL}/SgSellosFirmasRest/`;




  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }





  public dirSubSelFir(sec_pk: number): Promise<any> {
   
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_SELLOS_FIRMAS}buscarSelFirPorSedPk/${sec_pk}`;
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


