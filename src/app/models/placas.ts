import { Personas } from "./personas";

export class Placas {
  id_placa!: number;
  numero_placa!: string;
  dui_persona_responsable!: Personas;
  dui_usuario_registra_placa!: Personas;
  fecha_registro_placa!: Date;
}
