export enum EnumDepartamentos {
  AHUACHAPAN = 1,
  USULUTAN = 2,
  SONSONATE = 3,
  CUSCATLAN = 4,
  LA_PAZ = 5,
  LA_UNION = 6,
  LA_LIBERTAD = 7,
  SAN_VICENTE = 8,
  MORAZAN=9,
  SAN_MIGUEL=10,
  SAN_SALVADOR=11,
  SANTA_ANA=12,
  CHALATENANGO=13,
  CABANAS=14
}

export const catalogoDepartamento = [
  {
    codigo_departamento: EnumDepartamentos.AHUACHAPAN.toString(),
    nombre_departamento: 'Ahuachapán'
  },
  {
    codigo_departamento: EnumDepartamentos.USULUTAN.toString(),
    nombre_departamento: 'Usulután'
  },
  {
    codigo_departamento: EnumDepartamentos.SONSONATE.toString(),
    nombre_departamento: 'Sonsonate'
  },
  {
    codigo_departamento: EnumDepartamentos.CUSCATLAN.toString(),
    nombre_departamento: 'Cuscatlán'
  },
  {
    codigo_departamento: EnumDepartamentos.LA_PAZ.toString(),
    nombre_departamento: 'La Paz'
  },
  {
    codigo_departamento: EnumDepartamentos.LA_UNION.toString(),
    nombre_departamento: 'La Unión'
  },
  {
    codigo_departamento: EnumDepartamentos.LA_LIBERTAD.toString(),
    nombre_departamento: 'La Libertad'
  },
  {
    codigo_departamento: EnumDepartamentos.SAN_VICENTE.toString(),
    nombre_departamento: 'San Vicente'
  },
  {
    codigo_departamento: EnumDepartamentos.MORAZAN.toString(),
    nombre_departamento: 'Morazán'
  },
  {
    codigo_departamento: EnumDepartamentos.SAN_MIGUEL.toString(),
    nombre_departamento: 'San Miguel'
  },
  {
    codigo_departamento: EnumDepartamentos.SAN_SALVADOR.toString(),
    nombre_departamento: 'San Salvador'
  },
  {
    codigo_departamento: EnumDepartamentos.SANTA_ANA.toString(),
    nombre_departamento: 'Santa Ana'
  },
  {
    codigo_departamento: EnumDepartamentos.CHALATENANGO.toString(),
    nombre_departamento: 'Chalatenango'
  },
  {
    codigo_departamento: EnumDepartamentos.CABANAS.toString(),
    nombre_departamento: 'Cabañas'
  }
]

export const linearMockData = {
  [EnumDepartamentos.AHUACHAPAN]: [
    { name: 'ENE', value: 20 },
    { name: 'FEB', value: 30 },
    { name: 'MAR', value: 25 },
    { name: 'ABR', value: 40 },
    { name: 'MAY', value: 50 },
    { name: 'JUN', value: 70 },
    { name: 'JUL', value: 60 },
    { name: 'AGO', value: 65 },
    { name: 'SEP', value: 55 },
    { name: 'OCT', value: 70 },
    { name: 'NOV', value: 75 },
    { name: 'DIC', value: 80 }
  ],
  [EnumDepartamentos.USULUTAN]: generateRandomData(),
  [EnumDepartamentos.SONSONATE]: generateRandomData(),
  [EnumDepartamentos.CUSCATLAN]: generateRandomData(),
  [EnumDepartamentos.LA_PAZ]: generateRandomData(),
  [EnumDepartamentos.LA_UNION]: generateRandomData(),
  [EnumDepartamentos.LA_LIBERTAD]: generateRandomData(),
  [EnumDepartamentos.SAN_VICENTE]: generateRandomData(),
  [EnumDepartamentos.MORAZAN]: generateRandomData(),
  [EnumDepartamentos.SAN_MIGUEL]: generateRandomData(),
  [EnumDepartamentos.SAN_SALVADOR]: generateRandomData(),
  [EnumDepartamentos.SANTA_ANA]: generateRandomData(),
  [EnumDepartamentos.CHALATENANGO]: generateRandomData(),
  [EnumDepartamentos.CABANAS]: generateRandomData(),
}

function generateRandomData() {
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return months.map(month => ({
    name: month,
    value: Math.floor(Math.random() * 100) + 1
  }));
}
