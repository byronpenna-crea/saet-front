import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Placas } from 'src/app/models/placas';
import { environment } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServicePlacas {

  private API_SERVER_ALL_PLACAS = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/placas/`;
  private API_SERVER_REGISTRAR_PLACA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/placas/crearPlaca`;
  private API_SERVER_EDITAR_PLACA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/placas/editarPlaca`;
  private API_SERVER_ELIMINAR_PLACA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/placas/eliminarPlaca`;

  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }

  public savePlaca(placa: Placas): Promise<any> {
    const url = this.API_SERVER_REGISTRAR_PLACA;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(placa)
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
          reject(new Error('Hubo un error al guardar los datos: ' + error.message));
        });
    });
  }

  public getAllPlacas(): Promise<any> {
    console.log("Estoy en getAllPlacas del servicio");
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_ALL_PLACAS, {
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

  public editPlaca(placa: Placas): Promise<any> {
    const url = `${this.API_SERVER_EDITAR_PLACA}/${placa.id_placa}`;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(placa)
    };

    return new Promise((resolve, reject) => {
      fetch(url, httpOptions)
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo actualizar los datos'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al actualizar los datos: ' + error.message));
        });
    });
  }

  public deletePlaca(id: number): Promise<any> {
    const url = `${this.API_SERVER_ELIMINAR_PLACA}/${id}`;
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
            reject(new Error('No se pudo eliminar la placa'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al eliminar la placa: ' + error.message));
        });
    });
  }

  obtenerDatosPorPlaca(numero_placa: string): Promise<any> {
    const url = `${this.API_SERVER_ALL_PLACAS}${numero_placa}`;
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
