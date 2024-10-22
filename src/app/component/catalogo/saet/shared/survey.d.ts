export interface iQuestion {
  id_pregunta: number;
  tipoPregunta: string;
  pregunta: string;
  opcion: { id_opcion: number; opcion: string; opcion_pregunta_pk: number }[];
  respuesta?: string;
}
export interface iQuestionSave2 {
  id_pregunta: number;
  opcion: { opcion_pregunta_pk: number; opcion: string }[];
  respuesta: string;
}
export interface iQuestionSave {
  id_pregunta: number;
  opcion: { id_opcion: number; opcion: string; opcion_pregunta_pk?: number }[];
  pregunta?: string;
  respuesta: string;
}
export interface iSurvey {
  id_cuestionario: number;
  titulo: string;
  preguntas: iQuestion[];
}
interface SurveyResponse {
  cuestionarios: iSurvey[];
}
