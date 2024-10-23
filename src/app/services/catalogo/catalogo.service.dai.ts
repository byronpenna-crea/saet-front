import {CatalogoServiceSaet} from "../shared/saet";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {SurveyResponse} from "../../component/catalogo/saet/shared/survey";
import {
  ISaveCaracterizacion,
  ISaveCaracterizacionDAI,
  IUpdateCaracterizacion,
  IUpdateCaracterizacionDAI
} from "./catalogo.service.cor";

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
  public getDaiCaracterizacionQuestion(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(
      `${this.API_SERVER_URL}/caracterizacion/dai/preguntas`
    );
  }
}
