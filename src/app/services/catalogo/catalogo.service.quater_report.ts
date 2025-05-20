import {Injectable} from "@angular/core";
import {CatalogoServiceSaet} from "../shared/saet";
import {HttpClient, HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {IGuardianData, ISaveQuestionary, ResponseError} from "./catalogo.service.cor";
import {iQuestion, iQuestionSave} from "../../component/catalogo/saet/shared/survey";
import {environment} from "../../environments/environment";
export interface IGetQuarterReport {
  id_informe_pk: number,
  respuestas: iQuestion[];
}
export interface ISaveQuarterReport {
  id_informe_pk?: number;
  id_estudiante_fk?: number;
  trimester: number;
  anio: number;
  respuestas: iQuestionSave[];
}
export interface Atendido {
  per_nie: number,
  mat_estudiante_fk: number,
  sed_codigo: number,
  sed_pk: number,
  per_primer_nombre: string,
  per_segundo_nombre: string,
  per_tercer_nombre: string,
  per_primer_apellido: string,
  per_segundo_apellido: string,
  per_tercer_apellido: string,
  /* new ones */
  nombre_completo: string,
  nombres: string,
  apellidos: string,
  sexo: string,
  grado: string,
  edad: number,
  municipio: string,
  centroEducativo: string,
  nie: string,
  dificultades: {
    idDificultad: number,
    dificultad: string
  }[]
}
@Injectable({
  providedIn: 'root',
})
export class CatalogoServiceQuarterReport extends CatalogoServiceSaet {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    cookieService: CookieService
  ) {
    super(cookieService);
  }

  public async update(
    cuestionario: ISaveQuarterReport
  ){
    const url = `${this.API_SERVER_URL}/informe_trimestral/cor/?anio=${cuestionario.anio}&trimestre=${cuestionario.trimester}`;
    try {
      return await this.putRequest<ISaveQuarterReport, ISaveQuarterReport>(
        url,
        cuestionario
      );
    } catch (e) {
      console.log('error ---- ', e);
      throw e;
    }
  }
  public async save(
    cuestionario: ISaveQuarterReport
  ) {
    const url = `${this.API_SERVER_URL}/informe_trimestral/cor`;
    try {
      return await this.postRequest<ISaveQuarterReport, ISaveQuarterReport>(
        url,
        cuestionario
      );
    } catch (e) {
      console.log('error ---- ', e);
      throw e;
    }
  }
  public getQuestions() {
    const url = `${this.API_SERVER_URL}/informe_trimestral/cor`;
    return this.getRequest<IGetQuarterReport[]>(url);
  }
  public getAnswers(anio:number,trimestre:number) {
    const url = `${this.API_SERVER_URL}/informe_trimestral/cor/byTrimestre/?anio=${anio}&trimestre=${trimestre}`;
    try {
      return this.getRequest<IGetQuarterReport>(url);
    }catch (e){
      console.log('error in test ', e);
      return;
    }
  }
  public get() {
    const url = `${this.API_SERVER_URL}/informe_trimestral/cor`;
    return this.getRequest<IGetQuarterReport>(url);
  }

  public getAtendidosByDui(dui:string):Promise<Atendido[]>{
    const url = `${this.API_SERVER_URL}/tempEstudiantesSigesv2/personaApoyo/atendidos/${dui}`;
    console.log('token -->', this.cookieService.get('token'));
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.cookieService.get('token')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            console.log('----------', response);
            const error = new ResponseError(response.status,response.statusText);
            reject(error);
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al obtener los datos: ' + error.message));
        });
    });
  }
}
