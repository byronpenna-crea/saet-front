import { Personas } from "./personas";

export class Categorias {
  id_categoria!: number;
  nombre_categoria!: string;
  descripcion_categoria!: string;
  fecha_registro_categoria!: Date;
  dui_usuario_registra_categoria!: Personas;
  dui_usuario_baja_categoria!: Personas;
  fecha_baja_categoria!: Date;
  estado_categoria!: number;
}
