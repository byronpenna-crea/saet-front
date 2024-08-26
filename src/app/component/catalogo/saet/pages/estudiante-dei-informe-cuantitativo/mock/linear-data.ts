import {EnumDepartamentos} from "../../../shared/dei";

export type DataPoint = {
  name: string;
  value: number;
};

export type LinearMockDataType = {
  [key in EnumDepartamentos]: DataPoint[];
};
export const linearMockData:LinearMockDataType = {
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
