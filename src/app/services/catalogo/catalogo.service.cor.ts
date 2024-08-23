import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import {
  iQuestion,
  iQuestionSave,
  iSurvey,
  SurveyResponse,
} from '../../component/catalogo/saet/shared/survey';
import { TIPO_EVALUACION } from '../../component/catalogo/saet/shared/evaluaciones';
import { IQuestionaryAnswer } from '../../component/catalogo/saet/QuestionsComponent';
import { HttpMethod, iEspecialidadEvaluacion} from "../shared/saet-types";
import {CatalogoService} from "../catalogo.service";
import {CatalogoServiceSaet} from "../shared/saet";

export interface StudentDetail {
  nie: string;
  nui: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string[];
  correo: string;
  id_est_pk: number;
}
export interface iPaeiUpdate {
  id_paei: number;
}
export interface iPaeiSave {
  id_paei: number | null;
  id_estudiante_fk: number;
  id_especialista: number;
  id_coordinador: number;
  respuestas: IQuestionaryAnswer[];
}

export interface StudentInfoResponse {
  estudiante: StudentDetail;
  centroEducativo: {
    nombre: string;
    codigo: string;
    direccion: string;
    ultimoGradoCursado: string;
    gradoActual: string;
    seccion: string;
    docenteOrientador: string;
    telefonoOrientador: string[];
    correoOrientador: string;
  };
  responsables: {
    nombre: string;
    dui: string;
    nit: string;
    direccion: string;
    telefono: string;
  };
}
export interface IGetCaracterizacion {
  id_caracterizacion: number;
  especialista_responsable: string;
  respuestas: iQuestion[];
}
export interface IEvaluacionResponse {
  id_evaluacion: number;
  especialista_responsable: string;
  respuestas: iQuestionSave[];
}
export interface IQuestionaryHeader {
  id_estudiante_fk: number;
  id_especialista: number;
  id_tipo_evaluacion: number;
  fecha: string;
  hora: string;
}
export interface ISaveQuestionary extends IQuestionaryHeader {
  id_evaluacion: number | null;
  respuestas: iQuestionSave[];
}
export interface IUpdateCaracterizacion {
  id_caracterizacion: number | null;
  respuestas: iQuestionSave[];
  id_especialista: number;
  grupoFamiliar: {
    grupo_familiar_pk: number | null;
    primer_nombre: string;
    segundo_nombre: string;
    tercer_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    tercer_apellido: string;
    edad: number;
    parentesco: string;
    nivel_educativo: string;
    ocupacion: string;
  }[];
}
export interface ISaveCaracterizacion {
  id_caracterizacion: number | null;
  id_estudiante_fk: number;
  id_especialista: number;
  id_docente_apoyo: number;
  id_modulo: number;
  respuestas: iQuestionSave[];
  grupoFamiliar: {
    grupo_familiar_pk: number | null;
    primer_nombre: string;
    segundo_nombre: string;
    tercer_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    tercer_apellido: string;
    edad: number;
    parentesco: string;
    nivel_educativo: string;
    ocupacion: string;
  }[];
}
export class ResponseError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}
@Injectable({
  providedIn: 'root',
})
export class CatalogoServiceCor extends CatalogoServiceSaet {

  //private API_SERVER_COR = `${this.API_SERVER_URL}/caracterizacion/cor/preguntas`;
  //private API_SERVER_QUESTIONS = `${this.API_SERVER_URL}/evaluacion/cor/pedagogia/preguntas`;

  /*private API_SERVER_LENGUAJE_HABLA_QUESTIONS = `${this.API_SERVER_URL}/evaluacion/cor/lenguaje_habla/preguntas`;
  private API_SERVER_PSICOLOGIA_QUESTIONS =  `${this.API_SERVER_URL}/evaluacion/cor/psicologia/preguntas`;
  private API_SERVER_PEDAGOGIA_QUESTIONS = `${this.API_SERVER_URL}/evaluacion/cor/pedagogia/preguntas`;
  private API_SERVER_AGENDA_QUESTIONS = `${this.API_SERVER_URL}/evaluacion/cor/preguntas/reporte`;*/
  private API_SERVER_ESTUDIANTE = `${this.API_SERVER_URL}/tempEstudiantesSigesv2/buscarEstudiantePorNIE?nie=[NIE]`;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    super();
  }

   //this.cookieService.get('token');
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
        let errorMessage: string = "";
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
      console.log(' e here --- ', error.message);
      throw error;
    }
  }

  private async doRequest<T>(
    url: string,
    data?: T,
    method: HttpMethod = HttpMethod.POST
  ): Promise<Response> {
    let fetchObject: RequestInit = {
      method: method,
      headers: {
        Authorization: `Bearer ${this.MockedToken}`,
        'Content-Type': 'application/json',
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    };

    // Remove the body property if it's undefined
    if (fetchObject.body === undefined) {
      delete fetchObject.body;
    }

    const response = await fetch(url, fetchObject);

    // Check if the response is not successful (status 200-299)
    if (!response.ok) {
      let errorMessage:string = '';
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
  private async putRequest<T, U>(url: string, data: T): Promise<U> {
    const response = await this.doRequest<T>(url, data, HttpMethod.PUT);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new ResponseError(response.status, errorResponse.message);
    }

    return response.json();
  }
  private async postRequest<T, U>(url: string, data: T): Promise<U> {
    try {
      const response = await this.doRequest<T>(url, data);
      console.log('post request response ');
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(JSON.stringify(errorResponse));
      }
      console.log('hecha post request');
      return response.json();
    } catch (e: unknown) {
      console.log('error in post request ', e);
      const error = e as ResponseError;
      throw error;
    }
  }
  // agendar
  public agendarPsicologia(obj: IQuestionaryHeader) {
    const url = `${this.API_SERVER_URL}/evaluacion/cor/psicologia/`;
    return this.postRequest<IQuestionaryHeader, IQuestionaryHeader>(url, obj);
  }

  // save
  public async saveEvaluacion(
    cuestionario: ISaveQuestionary,
    especialidadEvaluacion: iEspecialidadEvaluacion
  ) {
    const especialidad =
      especialidadEvaluacion === iEspecialidadEvaluacion.LENGUAJE
        ? 'lenguaje_habla'
        : especialidadEvaluacion;
    const url = `${this.API_SERVER_URL}/evaluacion/cor/${especialidad}/`;
    try {
      return await this.postRequest<ISaveQuestionary, ISaveQuestionary>(
        url,
        cuestionario
      );
    } catch (e) {
      console.log('error ---- ', e);
      throw e;
    }
  }
  public async savePsicologia(cuestionarioPsicologia: ISaveQuestionary) {
    console.log('save here post request');
    const url = `${this.API_SERVER_URL}/evaluacion/cor/psicologia/`;
    return this.postRequest<ISaveQuestionary, ISaveQuestionary>(
      url,
      cuestionarioPsicologia
    );
  }
  public async savePedagogia(cuestionarioPedagogia: ISaveQuestionary) {
    const url = `${this.API_SERVER_URL}/evaluacion/cor/pedagogia/`;
    return this.postRequest<ISaveQuestionary, ISaveQuestionary>(
      url,
      cuestionarioPedagogia
    );
  }
  public async saveLenguaje(cuestionarioLenguaje: ISaveQuestionary) {
    const url = `${this.API_SERVER_URL}/evaluacion/cor/lenguaje_habla/`;
    return this.postRequest<ISaveQuestionary, ISaveQuestionary>(
      url,
      cuestionarioLenguaje
    );
  }
  public saveCaracterizacion(caracterizacion: ISaveCaracterizacion) {
    const url = `${this.API_SERVER_URL}/caracterizacion/cor`;
    return this.postRequest<ISaveCaracterizacion, ISaveCaracterizacion>(
      url,
      caracterizacion
    );
  }
  // update
  evaluacionURL: string = `${this.API_SERVER_URL}/evaluacion/cor/`;
  public updatePsicologia(cuestionarioPsicologia: ISaveQuestionary) {
    const tipo = TIPO_EVALUACION.psicologo_perfil;
    return this.putRequest<ISaveQuestionary, ISaveQuestionary>(
      this.evaluacionURL,
      cuestionarioPsicologia
    );
  }
  public updatePedagogia(cuestionarioPedagogia: ISaveQuestionary) {
    const tipo = TIPO_EVALUACION.pedagogo_perfil;
    return this.postRequest<ISaveQuestionary, ISaveQuestionary>(
      this.evaluacionURL,
      cuestionarioPedagogia
    );
  }
  public updateLenguaje(cuestionarioLenguaje: ISaveQuestionary) {
    const tipo = TIPO_EVALUACION.logopeda_perfil;
    return this.postRequest<ISaveQuestionary, ISaveQuestionary>(
      this.evaluacionURL,
      cuestionarioLenguaje
    );
  }

  public updateCaracterizacion(caracterizacion: ISaveCaracterizacion) {
    const url = `${this.API_SERVER_URL}/caracterizacion/cor/preguntas`;
    return this.putRequest<IUpdateCaracterizacion, IUpdateCaracterizacion>(
      url,
      {
        id_caracterizacion: caracterizacion?.id_caracterizacion ?? 0,
        id_especialista: caracterizacion.id_especialista,
        respuestas: caracterizacion.respuestas,
        grupoFamiliar: [],
      }
    );
  }
  // get
  public async getCaracterizacionPorNIE(
    nie: string
  ): Promise<IGetCaracterizacion> {
    //
    const url = `${this.API_SERVER_URL}/caracterizacion/cor/${nie}`;
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

    /*return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject(new Error('No se pudo obtener los datos'));
        }
      }).catch(error => {
        reject(new Error('Hubo un error al obtener los datos: ' + error.message));
      })
    });*/
  }
  // Temporaly method
  public async reset(): Promise<{
    status: number;
    message: '';
  }> {
    const url = `${this.API_SERVER_URL}/reset/all`;
    try {
      const response = await this.doRequest<undefined>(
        url,
        undefined,
        HttpMethod.DELETE
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new ResponseError(response.status, errorResponse.message);
      }
      return {
        status: response.status,
        message: '',
      };
    } catch (e: unknown) {
      const error = e as ResponseError;
      throw error;
    }
  }
  public async getTipoDeEvaluacion(
    nie: string,
    tipoEvaluacion: TIPO_EVALUACION
  ): Promise<IEvaluacionResponse> {
    const url = `${this.API_SERVER_URL}/evaluacion/cor/${nie}?idTipoEvaluacion=${tipoEvaluacion}`;
    try {
      const response = await this.doRequest<undefined>(
        url,
        undefined,
        HttpMethod.GET
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new ResponseError(response.status, errorResponse.message);
      }

      return response.json();
    } catch (e: unknown) {
      const error = e as ResponseError;
      throw error;
    }
  }
  public async getCorEspecialistas(nie: string): Promise<
    {
      id_especialista: number;
      nombre_completo: string;
      especialidad: string;
      dui: string;
    }[]
  > {
    const url = `${this.API_SERVER_URL}/evaluacion/cor/especialistas/${nie}`;
    const response = await this.doRequest<undefined>(
      url,
      undefined,
      HttpMethod.GET
    );
    console.log('response get ', response);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new ResponseError(response.status, errorResponse.message);
    }

    return response.json();
  }
  public async deleteEvaluacionCor(evaluationId: string) {
    const url = `${this.API_SERVER_URL}/evaluacion/cor/${evaluationId}`;
    try {
      const response = await this.doRequest<undefined>(
        url,
        undefined,
        HttpMethod.DELETE
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new ResponseError(response.status, errorResponse.message);
      }
      return {
        status: response.status,
        message: '',
      };
    } catch (e: unknown) {
      const error = e as ResponseError;
      throw error;
    }
  }
  /*public async updatePAEI(){
    try {
      const url = `${this.API_SERVER_URL}/paei/`;
      return await this.postRequest<iPaeiSave, iPaeiSave>(
        url,
        cuestionario
      );
    } catch (e: unknown) {
      const error = e as Error;
      const errorDetails = JSON.parse(error.message);
      throw new Error(errorDetails.message);
    }
  }*/
  public async savePAEI(cuestionario: iPaeiSave) {
    try {
      const url = `${this.API_SERVER_URL}/paei/`;
      return await this.postRequest<iPaeiSave, iPaeiSave>(url, cuestionario);
    } catch (e: unknown) {
      const error = e as Error;
      const errorDetails = JSON.parse(error.message);
      throw new Error(errorDetails.message);
    }
  }
  public async getPAEIPerNIE(nie: string) {
    try {
      const url = `${this.API_SERVER_URL}/paei/${nie}`;
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
  public async getPAEIQuestions() {
    try {
      const url = `${this.API_SERVER_URL}/paei/preguntas`;
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
  //get questions
  public async getSurveyQuestions(url: string): Promise<SurveyResponse> {
    try {
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
  public getDaiFichaVisitasQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(
      `${this.API_SERVER_URL}/dai/ficha_visita/preguntas`
    );
  }
  public getPaiQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(`${this.API_SERVER_URL}/dai/pai/preguntas`);
  }
  public getAgendaQuestions(): Promise<SurveyResponse> {
    //API_SERVER_AGENDA_QUESTIONS
    return this.getSurveyQuestions(this.saetRoutes.PREGUNTAS_COR_REPORTE());
  }
  public getPsicologiaQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(this.saetRoutes.PREGUNTAS_COR_EVALUACION(iEspecialidadEvaluacion.PSICOLOGIA));
  }
  public getLenguajeHablaQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(this.saetRoutes.PREGUNTAS_COR_EVALUACION(iEspecialidadEvaluacion.LENGUAJE));
  }
  public getPedagogiaQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(this.saetRoutes.PREGUNTAS_COR_EVALUACION(iEspecialidadEvaluacion.PEDAGOGIA));
  }
  public getDaiCaracterizacionQuestion(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(
      `${this.API_SERVER_URL}/caracterizacion/dai/preguntas`
    );
  }
  public getCORQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(this.saetRoutes.PREGUNTAS_COR_CARACTERIZACION());
  }
  public getQuestions(): Promise<SurveyResponse> {
    return this.getSurveyQuestions(this.saetRoutes.PREGUNTAS_COR_CARACTERIZACION());
  }
}
