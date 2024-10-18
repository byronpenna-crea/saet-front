import {Injectable} from "@angular/core";
import {CatalogoServiceSaet} from "../shared/saet";
import {HttpClient, HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {IGuardianData, ResponseError} from "./catalogo.service.cor";
import {iQuestion} from "../../component/catalogo/saet/shared/survey";
export interface IGetQuarterReport {
  id_informe_pk: number,
  respuestas: iQuestion[];
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
  public save() {
    const url = `${this.API_SERVER_URL}/informe_trimestral/cor`;
  }
  public getQuestions() {

    const url = `${this.API_SERVER_URL}/informe_trimestral/cor`;
    return this.getRequest<IGetQuarterReport[]>(url);
  }
  public getByNie(nie:string='') {
    if(nie === ''){
      throw new ResponseError(HttpStatusCode.NotFound, 'NIE no definido')
    }
    const url = `${this.API_SERVER_URL}/informe_trimestral/cor/${nie}`;
    return this.getRequest<IGetQuarterReport[]>(url);
  }
}