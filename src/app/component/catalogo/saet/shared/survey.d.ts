export interface iQuestion {
  id_pregunta: number,
  tipoPregunta: string,
  pregunta: string,
  opcion: { id_option: number, opcion: string }[]
}
export interface iSurvey {
  titulo: string,
  preguntas: iQuestion[]
}
interface SurveyResponse {
  cuestionarios: iSurvey[]
}
