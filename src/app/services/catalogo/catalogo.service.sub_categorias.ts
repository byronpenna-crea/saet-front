import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Sub_categorias } from 'src/app/models/sub_categorias';
import { environment } from 'src/app/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceSubCategorias {

  private API_SERVER_ALL_SUBCATEGORIAS = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeSubCategorias/`;
  private API_SERVER_REGISTRAR_SUBCATEGORIA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeSubCategorias/crearSubCategoria`;
  private API_SERVER_EDITAR_SUBCATEGORIA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeSubCategorias/editarSubCategoria`;
  private API_SERVER_ELIMINAR_SUBCATEGORIA = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/listaDeSubCategorias/eliminarSubCategoria`;



  constructor(private httpClient: HttpClient, private router: Router,private cookieService: CookieService) { }

  public getAllSubCategorias(): Promise<any> {
    console.log("Estoy en getAllSubCategorias del servicio");
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_ALL_SUBCATEGORIAS, {
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


  public saveSubCategoria(subCategoria: Sub_categorias): Promise<any> {
    const url = this.API_SERVER_REGISTRAR_SUBCATEGORIA;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subCategoria)
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

  public editSubCategoria(subCategoria: Sub_categorias): Promise<any> {
    const url = `${this.API_SERVER_EDITAR_SUBCATEGORIA}/${subCategoria.id_sub_categoria}`;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subCategoria)
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


  public deleteSubCategoria(id: number): Promise<any> {
    const url = `${this.API_SERVER_ELIMINAR_SUBCATEGORIA}/${id}`;
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
            reject(new Error('No se pudo eliminar la subcategoría'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al eliminar la subcategoría: ' + error.message));
        });
    });
  }







}
