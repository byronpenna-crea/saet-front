import {environment} from "../../environments/environment";
import {HttpMethod, iEspecialidadEvaluacion} from "./saet-types";
import {SaetRoutes} from "./saet-routes";
import {ResponseError, StudentInfoResponse} from "../catalogo/catalogo.service.cor";
import {CookieService} from "ngx-cookie-service";
import {SurveyResponse} from "../../component/catalogo/saet/shared/survey";

export const iRouteEspecialidad: { [key in iEspecialidadEvaluacion]: string } = {
  [iEspecialidadEvaluacion.PSICOLOGIA] : 'psicologia',
  [iEspecialidadEvaluacion.LENGUAJE] : 'lenguaje_habla',
  [iEspecialidadEvaluacion.PEDAGOGIA] : 'pedagogia',
}
export class CatalogoServiceSaet {
  protected MockedToken:string | null =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwNDIzMjYzOTUiLCJleHAiOjE3MTQ4NjA5NjgsInVzdV9jb2RpZ28iOiIwNDIzMjYzOTUifQ.3FaRNEQHzr5kwxYCjRA8iigf9ttoYN3UrpBdEBa7_GbpAQyroMWBxb2PWWYnKWowyeZq8AL3ViT4lmrQ-HWjQQ';
  protected API_SERVER_URL = `${environment.API_SERVER_URL}`;
  protected saetRoutes:SaetRoutes;
  constructor(
    protected cookieService: CookieService
  ){
    this.saetRoutes = new SaetRoutes(this.API_SERVER_URL);
  }
  private API_SERVER_ESTUDIANTE = `${this.API_SERVER_URL}/tempEstudiantesSigesv2/buscarEstudiantePorNIE?nie=[NIE]`;

  public async getStudentInfo(NIE: string): Promise<StudentInfoResponse> {
    const url = this.API_SERVER_ESTUDIANTE.replace('[NIE]', NIE);
    console.log('url ', url);
    try {
      const response = await this.doRequest<undefined>(
        url,
        undefined,
        HttpMethod.GET
      );
      console.log('response get ', response);

      if (!response.ok) {
        console.log('here ', response);
        let errorMessage = "";
        if(response.status === 401){
          throw new ResponseError(response.status, 'No Autorizado');
        }

        try{
          const errorResponse = await response.json();
          errorMessage = errorResponse.message;
        }catch (e){

        }

        throw new ResponseError(response.status, errorMessage);
      }

      return response.json();
    } catch (e: unknown) {
      const error = e as ResponseError;
      throw error;
    }
  }

  public async getSurveyQuestions(url: string): Promise<SurveyResponse> {
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
      const error = e as Error;
      const errorDetails = JSON.parse(error.message);
      throw new Error(errorDetails.message);
    }
  }
  protected async doRequest<T>(
    url: string,
    data?: T,
    method: HttpMethod = HttpMethod.POST
  ): Promise<Response> {
    const fetchObject: RequestInit = {
      method: method,
      headers: {
        Authorization: `Bearer ${this.cookieService.get('token')}`,
        'Content-Type': 'application/json',
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    };

    if (fetchObject.body === undefined) {
      delete fetchObject.body;
    }

    const response = await fetch(url, fetchObject);

    // Check if the response is not successful (status 200-299)
    if (!response.ok) {
      let errorMessage = '';
      if(response.status === 401){
        throw new ResponseError(response.status, 'No Autorizado');
      }
      try{
        const errorResponse = await response.json();
        errorMessage = errorResponse.message;
      }catch (e){

      }

      throw new ResponseError(response.status, errorMessage);
    }

    return response;
  }

  protected async getRequest<T>(url: string): Promise<T>{
    const response = await this.doRequest<T>(
      url,
      undefined,
      HttpMethod.GET
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new ResponseError(response.status, errorResponse.message);
    }

    return response.json();
  }
  protected async putRequest<T, U>(url: string, data: T): Promise<U> {
    const response = await this.doRequest<T>(url, data, HttpMethod.PUT);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new ResponseError(response.status, errorResponse.message);
    }

    return response.json();
  }
  protected async postRequest<T, U>(url: string, data: T): Promise<U> {
    try {
      const response = await this.doRequest<T>(url, data);
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
}
