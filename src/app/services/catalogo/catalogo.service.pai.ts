import {Injectable} from "@angular/core";
import {CatalogoServiceSaet} from "../shared/saet";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {IGuardianData} from "./catalogo.service.cor";
import {SurveyResponse} from "../../component/catalogo/saet/shared/survey";

@Injectable({
  providedIn: 'root',
})
export class CatalogoServicePai extends CatalogoServiceSaet {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    cookieService: CookieService
  ) {
    super(cookieService);
  }
  public async getPAIQuestions(): Promise<SurveyResponse> {
    const url = `${this.API_SERVER_URL}/pai/preguntas`;
    return this.getRequest<SurveyResponse>(url);
  }
}
