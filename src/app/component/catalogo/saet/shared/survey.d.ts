export interface iQuestion {
  id_pregunta: number,
  tipoPregunta: string,
  pregunta: string,
  opcion: { id_opcion: number, opcion: string }[];
  respuesta?: string
}
export interface iQuestionSave {
  id_pregunta: number,
  opcion: { id_opcion: number, opcion: string }[];
  respuesta: string
}
export interface iSurvey {
  id_cuestionario: number,
  titulo: string,
  preguntas: iQuestion[]
}
interface SurveyResponse {
  cuestionarios: iSurvey[]
}
