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
export class CatalogoServiceTempEstudiantesSigesV2 {
  //////////private API_SERVER_URL = `${environment.API_SERVER_URL}:${environment.API_SERVER_PORT}`;//v1
  private API_SERVER_URL = `${environment.API_SERVER_URL}`;//v2
  private API_SERVER_TEMP_ESTUDIANTES = `${this.API_SERVER_URL}/tempEstudiantesSigesv2/`;
  private API_SERVER_TEMP_ESTUDIANTES_REPORTE_01 = `${this.API_SERVER_URL}/tempEstudiantesSigesv2/`;
  private API_SERVER_SEDES=`${this.API_SERVER_URL}/sedes/`;



  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }

  public saveTempEstudiante(tempEstudiante: Sgp_tempEstudiantes): Promise<any> {
    const url = `${this.API_SERVER_TEMP_ESTUDIANTES}/crearTempEstudiante`;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tempEstudiante)
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

  public getAllTempEstudiantes(): Promise<any> {
   
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_TEMP_ESTUDIANTES, {
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


  public getAStudentByNiev1(per_nie: string,anio: string): Promise<any> {
   
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_TEMP_ESTUDIANTES}buscarEstudiantePorNieYAnio/${per_nie}/${anio}`;
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


  public getMatriculaPorAnio(per_nie: number,usuario:string,firmante:string,dui_usuario:string,anio: number): Promise<any> {
   
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_TEMP_ESTUDIANTES}autenticas/${per_nie}/${usuario}/${firmante}/${dui_usuario}/${anio}`;
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





  public getAStudentByCodv1(sed_codigo: string,anio: string): Promise<any> {
    
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_TEMP_ESTUDIANTES}buscarEstudiantePorCodigoYAnio/${sed_codigo}/${anio}`;
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



  public getAStudentBySeccion(sec_pk: number): Promise<any> {
    
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_TEMP_ESTUDIANTES}buscarPorSec/${sec_pk}`;
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



  



  public getAStudentByNiev2(per_nie: string): Promise<any> {
    
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_TEMP_ESTUDIANTES}buscarEstudiantePorNieV2/${per_nie}`;
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


  public getAStudentByNievParaTitulos(per_nie: string): Promise<any> {
    
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_TEMP_ESTUDIANTES}buscarPorNieParaTitulos/${per_nie}`;
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



  public getbuscarPorIdPersona(id_persona: string): Promise<any> {
    
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_SEDES}buscarPorDuiPerNat/${id_persona}`;
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


  public getbuscarPorIdPersonaCodSed(id_persona: number,dui: string): Promise<any> {
    
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_SEDES}buscarPorCodSed/${id_persona}/${dui}`;
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





  public editTempEstudiante(tempEstudiante: Sgp_tempEstudiantes): Promise<any> {
    const url = `${this.API_SERVER_TEMP_ESTUDIANTES}/editarTempEstudiante/${tempEstudiante.per_nie}`;
    const token: string | null = this.cookieService.get('token');

    const httpOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tempEstudiante)
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

  public deleteTempEstudiante(perNie: number): Promise<any> {
    const url = `${this.API_SERVER_TEMP_ESTUDIANTES}/eliminarTempEstudiante/${perNie}`;
    const token: string | null = this.cookieService.get('token');
    const httpOptions = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(perNie)
    };
    return new Promise((resolve, reject) => {
      fetch(url, httpOptions)
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('No se pudo eliminar el estudiante'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al eliminar el estudiante: ' + error.message));
        });
    });
  }




/*
  public imprimirFicha(per_nie: number,anio: number): Promise<any> {
    console.log("Estoy en getAllTempEstudiantes del servicio");
    const token: string | null = this.cookieService.get('token');
    const url = `${this.API_SERVER_TEMP_ESTUDIANTES_REPORTE_01}reporte_01/${per_nie}/${anio}`;
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
*/

/* --version donde el backen envia al fronted pdf
imprimirFicha(per_nie: number, ale_anio: number,usuario: string, firmante: string,dui_usuario: string): Promise<any> {
  const token: string | null = this.cookieService.get('token');
  const url = `${this.API_SERVER_TEMP_ESTUDIANTES_REPORTE_01}reporte_01/${per_nie}/${ale_anio}/${usuario}/${firmante}/${dui_usuario}`;

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

imprimirFicha(per_nie: number, ale_anio: number,usuario: string, firmante: string,dui_usuario: string): Promise<any> {
  const token: string | null = this.cookieService.get('token');
  const url = `${this.API_SERVER_TEMP_ESTUDIANTES_REPORTE_01}reporte_01/${per_nie}/${ale_anio}/${usuario}/${firmante}/${dui_usuario}`;

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

imprimirFichaParvularia(per_nie: number, ale_anio: number,usuario: string, firmante: string,dui_usuario: string): Promise<any> {
  const token: string | null = this.cookieService.get('token');
  const url = `${this.API_SERVER_TEMP_ESTUDIANTES_REPORTE_01}certificacion_de_parvularia/${per_nie}/${ale_anio}/${usuario}/${firmante}/${dui_usuario}`;
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



imprimirTitulo(per_nie: number,usuario: string, firmante: string,dui_usuario: string): Promise<any> {
  console.log("Valor01:"+per_nie);
  console.log("Valor02:"+usuario);
  console.log("Valor03:"+firmante);
  const token: string | null = this.cookieService.get('token');
  const url = `${this.API_SERVER_TEMP_ESTUDIANTES_REPORTE_01}reporte_titulos/${per_nie}/${usuario}/${firmante}/${dui_usuario}`;

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


certificacionDeTitulo(per_nie: number,usuario: string, firmante: string,dui_usuario: string): Promise<any> {
  const token: string | null = this.cookieService.get('token');
  const url = `${this.API_SERVER_TEMP_ESTUDIANTES_REPORTE_01}certificacion_titulos_v2/${per_nie}/${usuario}/${firmante}/${dui_usuario}`;
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



certificacionDeParvularia(per_nie: number,ale_anio:number,usuario: string, firmante: string,dui_usuario: string): Promise<any> {
  const token: string | null = this.cookieService.get('token');
  const url = `${this.API_SERVER_TEMP_ESTUDIANTES_REPORTE_01}certificacion_de_parvularia/${per_nie}/${ale_anio}/${usuario}/${firmante}/${dui_usuario}`;
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









imprimirReporteDesarrolloAprendisaje(per_nie: number,mat_estudiante_fk:number,sed_codigo: string,usuario: string,dui_usuario: string): Promise<any> {
  console.log("Valor01:"+per_nie);
  console.log("Valor02:"+mat_estudiante_fk);
  console.log("Valor03:"+usuario);
  console.log("Valor04:"+dui_usuario);
  const token: string | null = this.cookieService.get('token');
  const url = `${this.API_SERVER_TEMP_ESTUDIANTES_REPORTE_01}reporte_03/${per_nie}/${mat_estudiante_fk}/${sed_codigo}/${usuario}/${dui_usuario}`;

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


imprimirReporteCulminacion(per_nie: number,mat_estudiante_fk:number,sed_codigo: string,usuario: string,dui_usuario: string): Promise<any> {
  console.log("Valor01:"+per_nie);
  console.log("Valor02:"+mat_estudiante_fk);
  console.log("Valor03:"+usuario);
  console.log("Valor04:"+dui_usuario);
  const token: string | null = this.cookieService.get('token');
  const url = `${this.API_SERVER_TEMP_ESTUDIANTES_REPORTE_01}reporte_04/${per_nie}/${mat_estudiante_fk}/${sed_codigo}/${usuario}/${dui_usuario}`;

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



}
