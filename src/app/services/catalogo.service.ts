import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

private API_SERVER_All_BODEGA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeBodegas/`;
private API_SERVER_REGISTRAR_BODEGA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeBodegas/crearBodega`;
private API_SERVER_EDITAR_BODEGA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeBodegas/editarBodega`;
private API_SERVER_ELIMINAR_BODEGA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeBodegas/eliminarBodega`;


  constructor(private httpClient: HttpClient, private router: Router,private cookieService: CookieService) { }


  public getAllBodegas(): Promise<any> {
    console.log("Estoy en seguridad servicio-02");
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_All_BODEGA, {
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





  public deleteBodega(id: number): Promise<any> {
    const url = `${this.API_SERVER_ELIMINAR_BODEGA}/${id}`;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id)
    };

    return new Promise((resolve, reject) => {
      fetch(url, httpOptions)
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject(new Error('No se pudo eliminar la bodega'));
        }
      })
      .catch(error => {
        reject(new Error('Hubo un error al eliminar la bodega: ' + error.message));
      });
    });
}


  /*

  public deleteBodega(id: number): Promise<any> {
    const url = `${this.API_SERVER_ELIMINAR_BODEGA}/${id}`;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    return new Promise((resolve, reject) => {
      fetch(url, httpOptions)
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject(new Error('No se pudo eliminar la bodega'));
        }
      })
      .catch(error => {
        reject(new Error('Hubo un error al eliminar la bodega: ' + error.message));
      });
    });
  }

*/






}
