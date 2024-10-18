export enum EnumDepartamentos {
  AHUACHAPAN = 1,
  USULUTAN = 2,
  SONSONATE = 3,
  CUSCATLAN = 4,
  LA_PAZ = 5,
  LA_UNION = 6,
  LA_LIBERTAD = 7,
  SAN_VICENTE = 8,
  MORAZAN = 9,
  SAN_MIGUEL = 10,
  SAN_SALVADOR = 11,
  SANTA_ANA = 12,
  CHALATENANGO = 13,
  CABANAS = 14,
}
export interface Departamento {
  codigo_departamento: string;
  nombre_departamento: string;
}
export interface Sexo {
  sex_codigo: string;
  sex_nombre: string;
}
export interface Zona {
  zone_codigo: string;
  zone_nombre: string;
}
export const catalgoZona: Zona[] = [
  {
    zone_codigo: 'oriental',
    zone_nombre: 'oriental',
  },
  {
    zone_codigo: 'central',
    zone_nombre: 'central',
  },
  {
    zone_codigo: 'occidental',
    zone_nombre: 'occidental',
  },
];
export const catalogoSexo: Sexo[] = [
  {
    sex_codigo: '0',
    sex_nombre: 'Desconocido',
  },
  {
    sex_codigo: '1',
    sex_nombre: 'Hombre',
  },
  {
    sex_codigo: '2',
    sex_nombre: 'Mujer',
  },
];
export const catalogoDepartamento: Departamento[] = [
  {
    codigo_departamento: EnumDepartamentos.AHUACHAPAN.toString(),
    nombre_departamento: 'Ahuachapán',
  },
  {
    codigo_departamento: EnumDepartamentos.USULUTAN.toString(),
    nombre_departamento: 'Usulután',
  },
  {
    codigo_departamento: EnumDepartamentos.SONSONATE.toString(),
    nombre_departamento: 'Sonsonate',
  },
  {
    codigo_departamento: EnumDepartamentos.CUSCATLAN.toString(),
    nombre_departamento: 'Cuscatlán',
  },
  {
    codigo_departamento: EnumDepartamentos.LA_PAZ.toString(),
    nombre_departamento: 'La Paz',
  },
  {
    codigo_departamento: EnumDepartamentos.LA_UNION.toString(),
    nombre_departamento: 'La Unión',
  },
  {
    codigo_departamento: EnumDepartamentos.LA_LIBERTAD.toString(),
    nombre_departamento: 'La Libertad',
  },
  {
    codigo_departamento: EnumDepartamentos.SAN_VICENTE.toString(),
    nombre_departamento: 'San Vicente',
  },
  {
    codigo_departamento: EnumDepartamentos.MORAZAN.toString(),
    nombre_departamento: 'Morazán',
  },
  {
    codigo_departamento: EnumDepartamentos.SAN_MIGUEL.toString(),
    nombre_departamento: 'San Miguel',
  },
  {
    codigo_departamento: EnumDepartamentos.SAN_SALVADOR.toString(),
    nombre_departamento: 'San Salvador',
  },
  {
    codigo_departamento: EnumDepartamentos.SANTA_ANA.toString(),
    nombre_departamento: 'Santa Ana',
  },
  {
    codigo_departamento: EnumDepartamentos.CHALATENANGO.toString(),
    nombre_departamento: 'Chalatenango',
  },
  {
    codigo_departamento: EnumDepartamentos.CABANAS.toString(),
    nombre_departamento: 'Cabañas',
  },
];
