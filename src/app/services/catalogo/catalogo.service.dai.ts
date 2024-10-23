import {CatalogoServiceSaet} from "../shared/saet";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {SurveyResponse} from "../../component/catalogo/saet/shared/survey";
import {
  IGetCaracterizacion,
  ISaveCaracterizacion,
  ISaveCaracterizacionDAI,
  IUpdateCaracterizacion,
  IUpdateCaracterizacionDAI, ResponseError
} from "./catalogo.service.cor";
import {HttpMethod} from "../shared/saet-types";

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
  public updateCaracterizacion(caracterizacion: ISaveCaracterizacionDAI) {
    const url = `${this.API_SERVER_URL}/caracterizacion/dai/preguntas`;
    return this.putRequest<IUpdateCaracterizacionDAI, IUpdateCaracterizacionDAI>(
      url,
      {
        id_caracterizacion: caracterizacion?.id_caracterizacion ?? 0,
        id_docente_apoyo: caracterizacion.id_docente_apoyo,
        respuestas: caracterizacion.respuestas
      }
    );
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
