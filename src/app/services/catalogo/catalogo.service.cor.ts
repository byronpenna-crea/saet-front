import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Injectable} from "@angular/core";

export interface StudentInfoResponse {
  estudiante: {
    nie: string;
    nui: string;
    nombreCompleto: string;
    fechaNacimiento: string;
    direccion: string;
    telefono: string[];
    correo: string;
  },
  centroEducativo: {
    nombre: string;
    codigo: string;
    direccion: string;
    ultimoGradoCursado:string;
    gradoActual:string;
    seccion:string;
    docenteOrientador:string;
    telefonoOrientador:string[];
  },
  responsables: {
    nombre: string;
    dui: string;
    nit: string;
    direccion: string;
    telefono: string
  }

}

/*
{
  "estudiante": {
  "nie": 20217333,
    "nui": "7855589",
    "nombreCompleto": "BRYAN JEFFERSON MARTINEZ RAMOS",
    "fechaNacimiento": "2024-05-09",
    "direccion": "COLONIA LA ESPERANZA POLIGONO C Casa #7",
    "telefono": [
    "78995462",
    "76812559"
  ],
    "correo": "20217333@clases.edu.sv"
},


  "centroEducativo": {
  "nombre": "COMPLEJO EDUCATIVO \"PROFESPR MARTIN ROMERO \"",
    "codigo": "10470",
    "direccion": "CARRETERA PANAMERICANA SALIDA A CHALCHUAPA",
    "ultimoGradoCursado": null,
    "gradoActual": "Quinto grado",
    "seccion": "C",
    "docenteOrientador": "Ana Rosa Herrera",
    "correoOrientador": "anarosa@gmail.com",
    "telefonoOrientador": [
    "78478514"
  ]
},

  "responsables": [
  {
    "nombreCompleto": "Alexander Ernesto Marroquin",
    "dui": "0554889-1",
    "nit": "0554889-1",
    "direccion": "Colonia hermita 1",
    "telefono": "78952145"
  }
]
}*/

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceCor {
  private API_SERVER_URL = `${environment.API_SERVER_URL}`;//v2
  private API_SERVER_QUESTIONS = `${this.API_SERVER_URL}/caracterizacion/cor/preguntas`;
  private API_SERVER_ESTUDIANTE = `${this.API_SERVER_URL}/tempEstudiantesSigesv2/buscarEstudiantePorNIE?nie=[NIE]`
  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {

  }


  token: string | null = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwNDIzMjYzOTUiLCJleHAiOjE3MTQ4NjA5NjgsInVzdV9jb2RpZ28iOiIwNDIzMjYzOTUifQ.3FaRNEQHzr5kwxYCjRA8iigf9ttoYN3UrpBdEBa7_GbpAQyroMWBxb2PWWYnKWowyeZq8AL3ViT4lmrQ-HWjQQ"; //this.cookieService.get('token');
  public getStudentInfo(NIE:string): Promise<StudentInfoResponse> {
    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_ESTUDIANTE.replace('[NIE]', NIE), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log('response -------- ', response);
        if (response.ok) {
          resolve(response.json());
        } else {
          reject(new Error('No se pudo obtener los datos'));
        }
      }).catch(error => {
        console.log('response -------- ', error);
        reject(new Error('Hubo un error al obtener los datos: ' + error.message));
      })
    })
  }
  public getQuestions(): Promise<any> {
    //const token: string | null = this.cookieService.get('token');

    return new Promise((resolve, reject) => {
      fetch(this.API_SERVER_QUESTIONS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject(new Error('No se pudo obtener los datos'));
        }
      }).catch(error => {
        reject(new Error('Hubo un error al obtener los datos: ' + error.message));
      })
    })
  }
}
