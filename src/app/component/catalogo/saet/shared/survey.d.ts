export interface iQuestion {
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
