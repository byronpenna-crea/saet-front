import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {iEspecialidadEvaluacion} from "./saet-types";
import {iRouteEspecialidad} from "./saet";
enum URIs  {
  COR_CARACTERIZACION = 'caracterizacion/cor/preguntas',
  OBTENER_REFERENTES = 'tempEstudiantesSigesv2/buscarReferentesPorEstudiante?idEstudiante={id-estudiante}',
  COR_PREGUNTAS_EVALUACION = `evaluacion/cor/{especialidad}/preguntas`,
  COR_PREGUNTAS_REPORTE = `evaluacion/cor/preguntas/reporte`
}
export class SaetRoutes {
  private API_SERVER_URL: string = "";

  constructor(
    serverUrl: string
  ) {
    this.API_SERVER_URL = serverUrl;
  }
  replaceParam(url: string, params: { [key: string]: any }): string {
    return url.replace(/{([^}]+)}/g, (match, key) => {
      return params[key] || match;
    });
  }
  public absolute(route: string, params: { [key: string]: any } = {}): string {
    const interpolatedRoute = this.replaceParam(route, params);
    return `${this.API_SERVER_URL}/${interpolatedRoute}`;
  }
  // obtener
  public OBTENER_REFERENTES(idEstudiante: number): string{
    return this.absolute(URIs.OBTENER_REFERENTES,{
      "id-estudiante": idEstudiante
    });
  }
  public OBTENER_ESTUDIANTE_POR_NIE(nie:string){

  }
  // preguntas
  // COR
  public PREGUNTAS_COR(especialidad:iEspecialidadEvaluacion){
    return this.absolute(URIs.OBTENER_REFERENTES,{
      "especialidad": iRouteEspecialidad[especialidad]
    });
  }
  public PREGUNTAS_COR_EVALUACION(especialidad:iEspecialidadEvaluacion){
    return this.absolute(URIs.COR_PREGUNTAS_EVALUACION,{
      "especialidad": iRouteEspecialidad[especialidad]
    });
  }
  public PREGUNTAS_COR_REPORTE(){
    return this.absolute(URIs.COR_PREGUNTAS_REPORTE);
  }
  public PREGUNTAS_COR_CARACTERIZACION() {
    return this.absolute(URIs.COR_CARACTERIZACION);
  }
}
