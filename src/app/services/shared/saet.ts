import {environment} from "../../environments/environment";
import {iEspecialidadEvaluacion} from "./saet-types";
import {SaetRoutes} from "./saet-routes";

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
  constructor(){
    this.saetRoutes = new SaetRoutes(this.API_SERVER_URL);
  }
}
