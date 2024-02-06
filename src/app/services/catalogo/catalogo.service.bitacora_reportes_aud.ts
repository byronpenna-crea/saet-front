import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceBitacoraReportesAud {

///////private API_SERVER_ALL_TABLERO = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/tableros/`;//v1
private API_SERVER_ALL_TABLERO = `${environment.API_SERVER_URL}/tableros/`;//v2

//////private API_SERVER_ALL_BITACORA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeBitacoraReportesAud/`;//v1
private API_SERVER_ALL_BITACORA = `${environment.API_SERVER_URL}/listaDeBitacoraReportesAud/`;//v2

private API_SERVER_REGISTRAR_BITACORA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeBitacoraReportesAud/crearBitacora`;
private API_SERVER_EDITAR_BITACORA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeBitacoraReportesAud/editarBitacora`;
private API_SERVER_ELIMINAR_BITACORA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeBitacoraReportesAud/eliminarBitacora`;

  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }

  public saveBitacora(bitacora: any): Promise<any> {
    const url = this.API_SERVER_REGISTRAR_BITACORA;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bitacora)
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

  public editBitacora(bitacora: any): Promise<any> {
    const url = `${this.API_SERVER_EDITAR_BITACORA}/${bitacora.id_bitacora_reporte_aud}`;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bitacora)
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

  public deleteBitacora(id: number): Promise<any> {
    const url = `${this.API_SERVER_ELIMINAR_BITACORA}/${id}`;
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
          reject(new Error('No se pudo eliminar la bitácora'));
        }
      })
      .catch(error => {
        reject(new Error('Hubo un error al eliminar la bitácora: ' + error.message));
      });
    });
  }


  obtenerDatosTableroPorReporte(id_reporte: number): Promise<any> {
    const url = `${this.API_SERVER_ALL_TABLERO}${id_reporte}`;
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
