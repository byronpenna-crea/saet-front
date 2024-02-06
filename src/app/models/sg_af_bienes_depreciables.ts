import { SgAfEstadosBienes } from "./sg_af_estados_bienes";
import { SgAfEstadosCalidad } from "./sg_af_estados_calidad";

export class BienesDepreciables {
    bde_pk!: number;
    bde_codigo_correlativo!: string;
    bde_codigo_inventario!: string;
    bde_asignado_a!: string;
    bde_descripcion!: string;
    bde_observacion!: string;
    bde_marca!: string;
    bde_modelo!: string;
    bde_no_serie!: string;
    bde_no_placa!: string;
    bde_no_motor!: string;
    bde_anio!: number;
    bde_no_chasis!: string;
    bde_no_vin!: string;
    bde_color_carroceria!: string;
    bde_documento_adquisicion!: string;
    bde_fecha_adquisicion!: Date;
    bde_fecha_creacion!: Date;
    bde_valor_adquisicion!: number;
    bde_proveedor!: string;
    bde_cantidad_lote!: number;
    bde_unidad_administrativa_fk!: number;
    bde_calidad_fk!:SgAfEstadosCalidad;
    bde_tipo_bien_fk!: number;
    bde_forma_adquisicion_fk!: number;
    bde_fuente_financiamiento_fk!: number;
    bde_proyecto_fk!: number;
    bde_estado_fk!: SgAfEstadosBienes;
    bde_ult_mod_fecha!: Date;
    bde_ult_mod_usuario!: string;
    bde_version!: number;
    bde_es_lote!: boolean;
    bde_es_valor_estimado!: boolean;
    bde_numero_partida!: string;
    bde_estado_proceso_lote!: number;
    bde_sede_fk!: number;
    bde_num_correlativo!: number;
    bde_codigo_unidad!: string;
    bde_fecha_descargo!: Date;
    bde_valor_residual!: number;
    bde_vida_util!: number;
    bde_fecha_reg_contable!: Date;
    bde_fecha_recepcion!: Date;
    bde_observacion_dde!: string;
    bde_empleado_fk!: number;
    bde_estado_solicitud_fk!: number;
    bde_depreciado!: boolean;
    bde_tipo_bien_categoria_vinculada!: boolean;
    bde_categoria_fk!: number;
    bde_inmueble_id!: number;
    bde_completado!: boolean;
    bde_depreciado_completo!: boolean;
    bde_lote_id!: number;
    bde_es_lote_siap!: boolean;
    bde_numero_correlativo_siap!: number;
    bde_bien_es_fuente_siap!: boolean;
    bde_depreciacion_acumulada!: number;
    bde_usuario_creacion!: string;
  }
  