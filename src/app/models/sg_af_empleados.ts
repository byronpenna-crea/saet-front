import { SgPersonas } from "./sg_personas";

export class SgAfEmpleados {
    emp_pk!: number;
    emp_nombres!: string;
    emp_apellidos!: string;
    emp_cargo!: string;
    emp_unidad_administrativa_fk!: number;
    emp_habilitado!: boolean;
    emp_ult_mod_fecha!: Date;
    emp_ult_mod_usuario!: string;
    emp_version!: number;
    emp_persona_fk!: SgPersonas;
}
