interface IinformationTab {
  labels: string[];
  values: string[];
  legend: string;
  isActive: boolean;
}
export const generalInformationInit: IinformationTab = {
  isActive: false,
  legend: 'Datos personales del estudiante',
  labels: [
    'Nombre completo:',
    'NIE:',
    'Fecha de nacimiento:',
    'Dirección:',
    'Teléfono:',
    'Correo electrónico:',
  ],
  values: [],
};

export const trustedAdultInfoInit: IinformationTab = {
  isActive: false,
  legend: 'Datos de responsable(s) del estudiante',
  labels: ['Nombre completo:', 'DUI:', 'NIT:', 'Dirección:', 'Teléfono:'],
  values: [],
};
export const institutionalInfoInit: IinformationTab = {
  isActive: false,
  legend: 'Datos institucionales',
  labels: [
    'Centro Escolar al que pertenece:',
    'Código de Centro Escolar:',
    'Dirección de Centro Escolar:',
    'Último grado cursado:',
    'Grado actual:',
    'Sección:',
    'Docente de aula responsable:',
    'Correo electrónico de docente:',
    'Teléfono de docente:',
  ],
  values: [],
};
