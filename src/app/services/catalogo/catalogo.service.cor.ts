import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Injectable} from "@angular/core";
import {iQuestion, iQuestionSave, iSurvey, SurveyResponse} from "../../component/catalogo/saet/shared/survey";

export interface StudentDetail {
  nie: string;
  nui: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string[];
  correo: string;
  id_est_pk: number;
}
export interface StudentInfoResponse {
  estudiante: StudentDetail,
  centroEducativo: {
    nombre: string;
    codigo: string;
    direccion: string;
    ultimoGradoCursado:string;
    gradoActual:string;
    seccion:string;
    docenteOrientador:string;
    telefonoOrientador:string[];
    correoOrientador: string;
  },
  responsables: {
    nombre: string;
    dui: string;
    nit: string;
    direccion: string;
    telefono: string
  }

}
export interface IGetCaracterizacion {
  id_caracterizacion: number,
  respuestas:iQuestion[]
}
export interface ISaveQuestionary {
  id_evaluacion: number | null,
  id_estudiante_fk: number,
  id_especialista: number,
  id_tipo_evaluacion: number,
  fecha: string,
  hora: string,
  respuestas: iQuestionSave[]
}
export interface ISaveCaracterizacion {
  id_caracterizacion: number | null,
  id_estudiante_fk: number,
  id_especialista: number,
  id_docente_apoyo: number,
  id_modulo: number,
  respuestas: iQuestionSave[],
  grupoFamiliar: {
    grupo_familiar_pk: number | null,
    primer_nombre: string,
    segundo_nombre: string,
    tercer_nombre: string,
    primer_apellido: string,
    segundo_apellido: string,
    tercer_apellido: string,
    edad: number,
    parentesco: string,
    nivel_educativo: string,
    ocupacion: string
  }[]
}
@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceCor {
  private API_SERVER_URL = `${environment.API_SERVER_URL}`;//v2
  private API_SERVER_COR = `${this.API_SERVER_URL}caracterizacion/cor/preguntas`;
  private API_SERVER_QUESTIONS = `${this.API_SERVER_URL}evaluacion/cor/pedagogia/preguntas`;
  private API_SERVER_LENGUAJE_HABLA_QUESTIONS = `${this.API_SERVER_URL}evaluacion/cor/lenguaje_habla/preguntas`;
  private API_SERVER_PSICOLOGIA_QUESTIONS = `${this.API_SERVER_URL}evaluacion/cor/psicologia/preguntas`;
  private API_SERVER_PEDAGOGIA_QUESTIONS = `${this.API_SERVER_URL}evaluacion/cor/pedagogia/preguntas`;

  private API_SERVER_ESTUDIANTE = `${this.API_SERVER_URL}tempEstudiantesSigesv2/buscarEstudiantePorNIE?nie=[NIE]`
  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {

  }


  token: string | null = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwNDIzMjYzOTUiLCJleHAiOjE3MTQ4NjA5NjgsInVzdV9jb2RpZ28iOiIwNDIzMjYzOTUifQ.3FaRNEQHzr5kwxYCjRA8iigf9ttoYN3UrpBdEBa7_GbpAQyroMWBxb2PWWYnKWowyeZq8AL3ViT4lmrQ-HWjQQ"; //this.cookieService.get('token');
  public getStudentInfo(NIE:string): Promise<StudentInfoResponse> {
    try{
      return new Promise((resolve, reject) => {
        fetch(this.API_SERVER_ESTUDIANTE.replace('[NIE]', NIE), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            throw new Error('No se pudo obtener los datos');
          }
        }).catch(error => {
          reject(new Error(error.message));
        })
      })
    }catch (err: unknown) {
      console.log("catch error");
      if (err instanceof Error) {
        throw new Error('error no controlado' + err.message);
      }
      throw new Error('error no controlado');
    }

  }
  private async postRequest<T,U>(url: string, data: T): Promise<U> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener los datos');
    }

    return response.json();
  }

  public savePsicologia(cuestionarioPsicologia:ISaveQuestionary){
    const url = `${this.API_SERVER_URL}evaluacion/cor/psicologia/`;
    return this.postRequest<ISaveQuestionary,ISaveQuestionary>(url, cuestionarioPsicologia);
  }
  public savePedagogia (cuestionarioPedagogia:ISaveQuestionary){
    const url = `${this.API_SERVER_URL}evaluacion/cor/pedagogia/`;
    return this.postRequest<ISaveQuestionary,ISaveQuestionary>(url, cuestionarioPedagogia);
  }
  public saveLenguaje(cuestionarioLenguaje:ISaveQuestionary){
    const url = `${this.API_SERVER_URL}evaluacion/cor/lenguaje_habla/`;
    return this.postRequest<ISaveQuestionary,ISaveQuestionary>(url, cuestionarioLenguaje);
  }

  public saveCaracterizacion(caracterizacion: ISaveCaracterizacion) {
    const url = `${this.API_SERVER_URL}caracterizacion/cor`;
    return this.postRequest<ISaveCaracterizacion,ISaveCaracterizacion>(url, caracterizacion);
  }

  public getCaracterizacionPorNIE(nie:string): Promise<IGetCaracterizacion>{
    //
    const url = `${this.API_SERVER_URL}caracterizacion/cor/${nie}`;
    return new Promise((resolve, reject) => {
      fetch(url, {
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
    });
  }

  public getSurveyQuestions(url: string): Promise<SurveyResponse> {
    return new Promise((resolve, reject) => {
      fetch(url, {
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
    });
  }

  public getPsicologiaQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(this.API_SERVER_PSICOLOGIA_QUESTIONS);
  }
  public getLenguajeHablaQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(this.API_SERVER_LENGUAJE_HABLA_QUESTIONS);
  }
  public getPedagogiaQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(this.API_SERVER_PEDAGOGIA_QUESTIONS);
  }
  public getCORQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(this.API_SERVER_COR);
  }
  public getQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(this.API_SERVER_QUESTIONS);
  }
}
