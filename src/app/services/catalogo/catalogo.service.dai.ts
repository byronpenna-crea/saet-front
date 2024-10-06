import {CatalogoServiceSaet} from "../shared/saet";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {SurveyResponse} from "../../component/catalogo/saet/shared/survey";

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

  public getDaiCaracterizacionQuestion(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(
      `${this.API_SERVER_URL}/caracterizacion/dai/preguntas`
    );
  }
}
