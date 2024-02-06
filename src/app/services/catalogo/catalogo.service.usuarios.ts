import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Usuarios } from 'src/app/models/usuarios'; // Asegúrate de que la ruta al modelo sea correcta.
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceUsuarios {

  private API_SERVER_USUARIOS = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeUsuarios/`;
  private API_SERVER_REGISTRAR_USUARIO = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeUsuarios/crearUsuario`;
  private API_SERVER_EDITAR_USUARIO = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeUsuarios/editarUsuario`;
  private API_SERVER_ELIMINAR_USUARIO = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeUsuarios/eliminarUsuario`;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) { }

  public saveUsuario(usuario: Usuarios): Promise<any> {
    const url = this.API_SERVER_REGISTRAR_USUARIO;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
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

  public getAllUsuarios(): Promise<any> {
    console.log("Estoy en getAllUsuarios del servicio");
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_USUARIOS, {
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
          reject(new Error('No se pudieron obtener los datos'));
        }
      })
      .catch(error => {
        reject(new Error('Hubo un error al obtener los datos: ' + error.message));
      });
    });
  }

  public editUsuario(usuario: Usuarios): Promise<any> {
    const url = `${this.API_SERVER_EDITAR_USUARIO}/${usuario.dui_usuario}`;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
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

  public deleteUsuario(dui_usuario: string): Promise<any> {
    const url = `${this.API_SERVER_ELIMINAR_USUARIO}/${dui_usuario}`;
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
          reject(new Error('No se pudo eliminar el usuario'));
        }
      })
      .catch(error => {
        reject(new Error('Hubo un error al eliminar el usuario: ' + error.message));
      });
    });
  }



  
public buscarUsuarioPorDui(dui_usuario: any): Promise<any> {
  const url = `${this.API_SERVER_USUARIOS}${dui_usuario}`;
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
