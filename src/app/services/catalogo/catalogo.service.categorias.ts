import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Categorias } from 'src/app/models/categorias';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceCategorias {

  private API_SERVER_ALL_CATEGORIAS = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeCategorias/`;
  private API_SERVER_REGISTRAR_CATEGORIA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeCategorias/crearCategoria`;
  private API_SERVER_EDITAR_CATEGORIA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeCategorias/editarCategoria`;
  private API_SERVER_ELIMINAR_CATEGORIA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeCategorias/eliminarCategoria`;


  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }

  public saveCategoria(categoria: Categorias): Promise<any> {
    console.log("Estoy dentro de service save categorias");
    const url = this.API_SERVER_REGISTRAR_CATEGORIA;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoria)
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



  public getAllCategorias(): Promise<any> {
    console.log("Estoy en getAllCategoriasProveedores del servicio");
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_ALL_CATEGORIAS, {
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
            reject(new Error('No se pudo obtener los datos de las categorias'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al obtener los datos de las categorias: ' + error.message));
        });
    });
  }

  public editCategoria(categoria: Categorias): Promise<any> {
    const url = `${this.API_SERVER_EDITAR_CATEGORIA}/${categoria.id_categoria}`;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoria)
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

  public deleteCategoria(id: number): Promise<any> {
    const url = `${this.API_SERVER_ELIMINAR_CATEGORIA}/${id}`;
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
            reject(new Error('No se pudo eliminar la categoría'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al eliminar la categoría: ' + error.message));
        });
    });
  }



}
