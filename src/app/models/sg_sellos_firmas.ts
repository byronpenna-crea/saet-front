import { SgPersonas } from "./sg_personas";

export class SgSellosFirmas {
    sfi_pk!: number;
    sfi_persona_fk!: SgPersonas;
    sfi_tipo_representante_fk!: number;
    sfi_sede_fk!: number;
    sfi_firma_sello_archivo_fk!: number;
    sfi_habilitado!: boolean;
    sfi_comentario!: string;
    sfi_fecha_desde!: Date;
    sfi_fecha_hasta!: Date;
    sfi_aclaracion_firma!: string;
    sfi_numero_documento!: string;
    sfi_fecha_documento!: Date;
    sfi_institucion!: string;
    sfi_ult_mod_fecha!: Date;
    sfi_ult_mod_usuario!: string;
    sfi_version!: number;
    sede_estado_nombre!: string;
  }
  