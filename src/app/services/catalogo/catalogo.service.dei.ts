import {CatalogoServiceSaet} from "../shared/saet";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Departamentos} from "../../models/departamentos";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class CatalogoServiceDei extends CatalogoServiceSaet {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    super();
  }

  public getAllDepartamentos(): Promise<Departamentos[]> {

    const url = `${environment.API_SERVER_URL}/listaDepartamentos08032023/`;
    const token: string | null = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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