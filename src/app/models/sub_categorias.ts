import { Categorias } from "./categorias";
import { Personas } from "./personas";

export class Sub_categorias {
  id_sub_categoria!: number;
  nombre_sub_categoria!: string;
  descripcion_sub_categoria!: string;
  id_categoria!: Categorias;
  fecha_registro_sub_categoria!: Date;
  dui_usuario_registra_sub_categoria!: Personas;
  dui_usuario_baja_sub_categoria!: Personas;
  fecha_baja_sub_categoria!: Date;
  estado_sub_categoria!: number;
}
