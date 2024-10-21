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
  id_estudiante_fk: number;
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
  nombre_completo: string
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
    const url = `${this.API_SERVER_URL}/informe_trimestral/cor`;
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
  public getByNie(nie='') {
    if(nie === ''){
      throw new ResponseError(HttpStatusCode.NotFound, 'NIE no definido')
    }
    const url = `${this.API_SERVER_URL}/informe_trimestral/cor/${nie}`;
    return this.getRequest<IGetQuarterReport>(url);
  }

  public getAtendidosByDui(dui:string):Promise<Atendido[]>{
    const url = `${environment.API_SERVER_URL}/tempEstudiantesSigesv2/personaApoyo/atendidos/${dui}`;
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
            reject(new Error('No se pudo obtener los datos'));
          }
        })
        .catch(error => {
          reject(new Error('Hubo un error al obtener los datos: ' + error.message));
        });
    });
  }
}
