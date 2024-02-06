import { Personas } from "./personas";
import { Sgp_roles } from "./sgp_roles";

export class Usuarios {
  dui_usuario!: string;
  dui_persona!: Personas;
  usuario!: string;
  contrasena!:string;
  tipo!:string;
  estado!:number;
  estado_contrasena!: number;
  dui_usuario_que_crea!: Personas;
  fecha_ingreso!:string;
  id_rol!: Sgp_roles;


}
