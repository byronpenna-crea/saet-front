export enum IconComponent {
  EYE,
  PLUS,
  URL,
  CHECK,
  PRINTER,
  SEARCH
}
export enum QuestionType {
  ABIERTA="abierta",
  MULTIPLE_CON_RESPUESTA = "opcion_multiple_con_respuesta",
  OPCION_UNICA_CON_RESPUESTA = "opcion_unica_con_respuesta",
  OPCION_UNICA = "opcion_unica",
  ABIERTA_CON_RESPUESTA = "abierta_con_respuesta",
  OPCION_MULTIPLE = "opcion_multiple",
}
export const getIconClass = (icon:IconComponent | null) => {
  if(icon === null){
    return "";
  }
  switch (icon) {
    case IconComponent.EYE:
      return "pi pi-eye";
    case IconComponent.CHECK:
      return "pi pi-check";
    case IconComponent.PLUS:
      return "pi pi-plus";
    case IconComponent.URL:
      return "pi pi-link";
    case IconComponent.PRINTER:
      return "pi pi-print";
    case IconComponent.SEARCH:
      return "pi pi-search";
  }
  return "";
}