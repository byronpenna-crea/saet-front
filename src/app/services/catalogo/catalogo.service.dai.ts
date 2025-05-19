import {CatalogoServiceSaet} from "../shared/saet";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {SurveyResponse} from "../../component/catalogo/saet/shared/survey";
import {
  IGetCaracterizacion, IPaeiResponse, IPlanAccionResponse, IReferencaResponse, IRespPlanAccion,
  ISaveCaracterizacion,
  ISaveCaracterizacionDAI, ISavePlanAccion, ISaveQuestionary,
  IUpdateCaracterizacion,
  IUpdateCaracterizacionDAI, IUpdateCaracterizacionDAIResponse, IUpdatePlanAccion, ResponseError,
} from './catalogo.service.cor';
import {HttpMethod} from "../shared/saet-types";
import {PersonaApoyo} from "./catalogo.service.dei";
import { environment } from '../../environments/environment';
export interface ISaveReferencia {
  nie: number,
  id_docente_apoyo: number,
  departamento: string,
  servicio_apoyo: string,
  personal_ejecucion: string,
  referencia_externa: string,
  motivo: string
}
@Injectable({
  providedIn: 'root',
})
export class CatalogoServiceDai extends CatalogoServiceSaet {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    cookieService: CookieService
  ) {
    super(cookieService);
  }
  public async getReferencia(nie:string):Promise<IReferencaResponse>{
    const url = `${environment.API_SERVER_URL}/dai/referencia/nie/${nie}`;
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
  public async saveReferencia(obj:ISaveReferencia){
    //dai/referencia
    const url = `${environment.API_SERVER_URL}/dai/referencia`;
    return this.postRequest<ISaveReferencia, IReferencaResponse>(
      url,
      obj
    );
  }
  public async getReferenciaByNieAndDocenteId(nie:string,especialistaId:string):Promise<IReferencaResponse>{
    const url = `${environment.API_SERVER_URL}/dai/referencia/${nie}?idDocenteApoyo=${especialistaId}`;
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
  public async getCaracterizacionPorNIE(
    nie: string
  ): Promise<IGetCaracterizacion> {
    const url = `${this.API_SERVER_URL}/caracterizacion/dai/${nie}`;
    try {
      const response = await this.doRequest<undefined>(
        url,
        undefined,
        HttpMethod.GET
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(JSON.stringify(errorResponse));
      }
      return response.json();
    } catch (e: unknown) {
      const error = e as ResponseError;
      throw error;
    }
  }
  public saveCaracterizacion(caracterizacion: ISaveCaracterizacionDAI) {
    const url = `${this.API_SERVER_URL}/caracterizacion/dai`;
    return this.postRequest<ISaveCaracterizacionDAI, ISaveCaracterizacionDAI>(
      url,
      caracterizacion
    );
  }
  public  savePlanAccion(cuestionarioPsicologia: ISavePlanAccion): Promise<IRespPlanAccion>  {
    const url = `${this.API_SERVER_URL}/dai/plan_accion`;
    return this.postRequest<ISavePlanAccion, IRespPlanAccion>(
      url,
      cuestionarioPsicologia
    );
  }
  public updatePlanDeAccion(plan: IUpdatePlanAccion): Promise<IUpdatePlanAccion>{
    const url = `${this.API_SERVER_URL}/dai/plan_accion`;
    return this.putRequest<IUpdatePlanAccion, IUpdatePlanAccion>(
      url,
      {
        id_plan_accion: plan.id_plan_accion,
        respuestas: plan.respuestas
      }
    );
  }
  public updateCaracterizacion(caracterizacion: ISaveCaracterizacionDAI) {
    const url = `${this.API_SERVER_URL}/caracterizacion/dai/preguntas`;
    return this.putRequest<IUpdateCaracterizacionDAI, IUpdateCaracterizacionDAIResponse>(
      url,
      {
        id_caracterizacion: caracterizacion?.id_caracterizacion ?? 0,
        id_docente_apoyo: caracterizacion.id_docente_apoyo,
        respuestas: caracterizacion.respuestas
      }
    );
  }
  public async getPlanAccionPerNIE(nie:string): Promise<IPlanAccionResponse> {
    try {
      const url = `${this.API_SERVER_URL}/dai/plan_accion/preguntas/${nie}`;
      const response = await this.doRequest<undefined>(
        url,
        undefined,
        HttpMethod.GET
      );
      console.log('response get ', response);

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(JSON.stringify(errorResponse));
      }

      return response.json();
    } catch (e: unknown) {
      const error = e as Error;
      const errorDetails = JSON.parse(error.message);
      throw new Error(errorDetails.message);
    }
  }
  public async getPlanAccionQuestion(): Promise<SurveyResponse>{
    try {
      const url = `${this.API_SERVER_URL}/dai/plan_accion/preguntas`;
      const response = await this.doRequest<undefined>(
        url,
        undefined,
        HttpMethod.GET
      );
      console.log('response get ', response);

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(JSON.stringify(errorResponse));
      }

      return response.json();
    } catch (e: unknown) {
      const error = e as Error;
      const errorDetails = JSON.parse(error.message);
      throw new Error(errorDetails.message);
    }
  }
  public getDaiCaracterizacionQuestion(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(
      `${this.API_SERVER_URL}/caracterizacion/dai/preguntas`
    );
  }
}
