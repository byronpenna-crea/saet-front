import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Sgp_roles } from 'src/app/models/sgp_roles'; // Asegúrate de que la ruta al modelo sea correcta.
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceRoles {
/*
  private API_SERVER_ROLES = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeRoles/`;//v1
  private API_SERVER_REGISTRAR_ROL = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeRoles/crearRol`;//v1
  private API_SERVER_EDITAR_ROL = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeRoles/editarRol`;//v1
  private API_SERVER_ELIMINAR_ROL = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeRoles/eliminarRol`;//v1
*/
  private API_SERVER_ROLES = `${environment.API_SERVER_URL}/listaDeRoles/`;//v2
  private API_SERVER_REGISTRAR_ROL = `${environment.API_SERVER_URL}/listaDeRoles/crearRol`;//v2
  private API_SERVER_EDITAR_ROL = `${environment.API_SERVER_URL}/listaDeRoles/editarRol`;//v2
  private API_SERVER_ELIMINAR_ROL = `${environment.API_SERVER_URL}/listaDeRoles/eliminarRol`;//v2

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) { }

  public saveRol(rol: Sgp_roles): Promise<any> {
    const url = this.API_SERVER_REGISTRAR_ROL;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rol)
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

  public getAllRoles(): Promise<any> {
    console.log("Estoy en getAllRoles del servicio");
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_ROLES, {
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

  public editRol(rol: Sgp_roles): Promise<any> {
    const url = `${this.API_SERVER_EDITAR_ROL}/${rol.rol_pk}`;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rol)
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

  public deleteRol(id: number): Promise<any> {
    const url = `${this.API_SERVER_ELIMINAR_ROL}/${id}`;
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
          reject(new Error('No se pudo eliminar el rol'));
        }
      })
      .catch(error => {
        reject(new Error('Hubo un error al eliminar el rol: ' + error.message));
      });
    });
  }

}
