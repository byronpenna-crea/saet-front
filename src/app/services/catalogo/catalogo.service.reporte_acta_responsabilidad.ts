import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceReporteActaResponsabilidad {


//////////private API_SERVER_ALL_ACTA_RESPONSABILIDAD = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}/unidadesActivoFijo/`;//v1
private API_SERVER_ALL_ACTA_RESPONSABILIDAD = `${environment.API_SERVER_URL}/unidadesActivoFijo/`;//v2


  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }



  public getAllUnidadesActivoFijo(): Promise<any> {
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_ALL_ACTA_RESPONSABILIDAD, {
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

  public getAllUnidadesActivoFijoPorIdPersona(per_pk:number): Promise<any> {
    const url = `${this.API_SERVER_ALL_ACTA_RESPONSABILIDAD}unidadesActivoFijoPorIdPersona/${per_pk}`;
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


  public getAllUnidadesAdministrativasPorIdPersona(per_pk:number): Promise<any> {
    const url = `${this.API_SERVER_ALL_ACTA_RESPONSABILIDAD}unidadesAdministrativasPorIdPersona/${per_pk}`;
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






  public getAllUnidadesAdministrativas(uad_unidad_activo_fijo_fk:number): Promise<any> {
    const url = `${this.API_SERVER_ALL_ACTA_RESPONSABILIDAD}porUnidadDeActivo/${uad_unidad_activo_fijo_fk}`;
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


  public getAllBienesPorEmpleado(emp_persona_fk:number): Promise<any> {
    const url = `${this.API_SERVER_ALL_ACTA_RESPONSABILIDAD}bienesPorEmpleado/${emp_persona_fk}`;
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


  /*
  imprimirActaResponsabilidad(bde_empleado_fk:number,dui_usuario:string): Promise<any> {
    console.log("Valor01:"+bde_empleado_fk);
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_ALL_ACTA_RESPONSABILIDAD}reporte_01_01/${bde_empleado_fk}/${dui_usuario}`;
  
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.ok) {
          return response.blob(); // Obtener el contenido del archivo como un blob
        } else {
          throw new Error('No se pudo obtener el archivo PDF');
        }
      })
      .catch(error => {
        console.log("Error al obtener el archivo PDF: " + error);
      });
  }
*/


buscarActaResponsabilidad(bde_empleado_fk:number,usuario: string,dui_usuario:string): Promise<any> {
  const token: string | null = this.cookieService.get('token');
  const url = `${this.API_SERVER_ALL_ACTA_RESPONSABILIDAD}acta_responsabilidad_v2/${bde_empleado_fk}/${usuario}/${dui_usuario}`;
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
