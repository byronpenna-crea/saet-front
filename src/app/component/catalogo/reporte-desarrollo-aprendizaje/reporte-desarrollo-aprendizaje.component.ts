import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { Sgp_sedes } from 'src/app/models/sgp_sedes';
import { CatalogoServiceTempEstudiantesSigesV2 } from 'src/app/services/catalogo/catalogo.service.temp_estudiantes_sigesv2';
import { Sgp_tempEstudiantes } from 'src/app/models/sgp_temp_estudiantes';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { Sgp_roles } from 'src/app/models/sgp_roles';



@Component({
  selector: 'app-reporte-desarrollo-aprendizaje',
  templateUrl: './reporte-desarrollo-aprendizaje.component.html',
  styleUrls: ['./reporte-desarrollo-aprendizaje.component.css']
})
export class ReporteDesarrolloAprendizajeComponent {

  lista_sede: Sgp_sedes[] = [];
  lista_sede_v2: Sgp_sedes[] = [];
  lista_roles: Sgp_roles[] = [];
  estado_opcion_seleccionado: string = '';
  estado_opcion_seleccionado_titulos: string = '';
  submitted!: boolean;
  lista_estudiantes: Sgp_tempEstudiantes[] = [];
  dui_usuario = '';
  id_persona = '';
  usuario: string = '';
  showMessages = false;
  msgs: Message[] = [];
  dialogo_proceso_busqueda!: boolean;
  valor01: string = '';
  valor02: string = '';
  valor03: string = '';


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceTempEstudiantesSigesV2: CatalogoServiceTempEstudiantesSigesV2,
    private menuService: SeguridadService) {


  }




  ngOnInit(): void {
    this.dialogo_proceso_busqueda = true;
    const primer_nombre = localStorage.getItem('primer_nombre') || '';
    //console.log("Primer nombre es: "+primer_nombre);
    const primer_apellido = localStorage.getItem('primer_apellido') || '';
    this.dui_usuario = localStorage.getItem('dui') || '';
    this.id_persona = localStorage.getItem('id_persona') || '';
    //console.log("Primer apellido es: "+primer_apellido);
    this.usuario = primer_nombre[0] + primer_apellido;
    //console.log("El usuario es: "+this.usuario);


    this.menuService.getAllRolesUsuarios()
      .then(response => {

        //console.log(response);
        this.lista_roles = response;

        this.lista_roles.forEach(m => {

          if (m.rol_pk == 56) {

            this.catalogoServiceTempEstudiantesSigesV2.getbuscarPorIdPersona(this.id_persona)
              .then(response => {

                //this.showMessages = false;
                this.dialogo_proceso_busqueda = false;

                //console.log(response)
                this.lista_sede_v2 = response;



                
              }).catch(error => {
                console.log("Error al obtener las sedes: " + error)
              });

          } else {
            //this.catalogoServiceTempEstudiantesSigesV2.getbuscarPorIdPersonaCodSed(parseInt('5789311'),'041030357')
            //this.catalogoServiceTempEstudiantesSigesV2.getbuscarPorIdPersonaCodSed(parseInt('4968818'),'000270697')//Del NIE NIE 10610686 ya tiene promoción de 2023 en SIGES
            //////////this.catalogoServiceTempEstudiantesSigesV2.getbuscarPorIdPersonaCodSed(parseInt('5371797'),'011111864')//NIE 10776699 CON PDF DE RESPALDO.
            this.catalogoServiceTempEstudiantesSigesV2.getbuscarPorIdPersonaCodSed(parseInt(this.id_persona), this.dui_usuario)
              .then(response => {

                //console.log("El valor 01 es:");
                //this.showMessages = false;
                this.dialogo_proceso_busqueda = false;
                //console.log(response)
                this.lista_sede_v2 = response;

                //console.log("El valor 02 es:" + this.lista_sede_v2.length);

                if (this.lista_sede_v2.length === 0) {
                  this.msgs = [];
                  // Tu lista está vacía (0 registros)
                  //console.log('La lista está vacía.');
                  this.msgs.push(
                    //{ severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
                    //{ severity: 'success', summary: 'Success Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
                    { severity: 'warn', summary: 'Warning Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
                  this.showMessages = true;
                } else {
                  // Tu lista tiene al menos un registro
                 // console.log('La lista contiene registros.');
                }



              }).catch(error => {
                console.log("Error al obtener las secciones por codigo: " + error)
              });

          }


        });

      }).catch(error => {
        console.log("Error al obtener los roles: " + error)
      });






    /*
       this.catalogoServiceTempEstudiantesSigesV2.getbuscarPorIdPersona(this.id_persona)
       .then(response => {

        
         
          this.showMessages = false;
          this.dialogo_proceso_busqueda = false;
   


         console.log(response)
         this.lista_sede = response;
       }).catch(error => {
         console.log("Error al obtener las sedes: " + error)
       });
 */


  }


  //Reporte de desarrollo de aprendizaje
  public imprimirFicha03(valor: Sgp_tempEstudiantes) {


    this.valor01 = valor.per_nie.toString();
    this.valor02 = valor.mat_estudiante_fk.toString();
    this.valor03 = valor.sed_codigo.toString();



    this.imprimirFicha(parseInt(this.valor01), parseInt(this.valor02), this.valor03);




  }


  //Reporte de culminacion
  public imprimirFicha04(valor: Sgp_tempEstudiantes) {


    this.valor01 = valor.per_nie.toString();
    this.valor02 = valor.mat_estudiante_fk.toString();
    this.valor03 = valor.sed_codigo.toString();




    this.imprimirFichaCulminacion(parseInt(this.valor01), parseInt(this.valor02), this.valor03);




  }






  public cargarAlumnosPorSeccionPorCodigo(estado_opcion_seleccionado: String) {

    this.lista_estudiantes = [];


    //this.catalogoServiceTempEstudiantesSigesV2.getAStudentBySeccion(parseInt('1242639'))
    this.catalogoServiceTempEstudiantesSigesV2.getAStudentBySeccion(parseInt(estado_opcion_seleccionado.toString()))
      .then(response => {



        //console.log(response)
        //this.lista_estudiantes.push(response);
        this.lista_estudiantes = response;
      }).catch(error => {
        this.dialogo_proceso_busqueda = false;
        this.msgs.push(
          { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros.' });
        //this.showMessages = true;

      });




  }


  //Reporte de desarrollo de aprendizaje
  imprimirFicha(per_nie: number, mat_estudiante_fk: number, sed_codigo: string): void {
    this.dialogo_proceso_busqueda = true;
    this.catalogoServiceTempEstudiantesSigesV2
      .imprimirReporteDesarrolloAprendisaje(per_nie, mat_estudiante_fk, sed_codigo, this.usuario, this.dui_usuario)
      .then(blob => {
        //console.log("El dato en 01 es:");
        //console.log("El dato en 02 es:" + blob.size);
        // Verificar si el blob contiene datos
        if (blob.size === 911 || blob.size === 899) {
          this.msgs.push(
            //{ severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
            //{ severity: 'success', summary: 'Success Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
            { severity: 'warn', summary: 'Warning Message', detail: 'El PDF está en blanco. No se ha generado ningún registro, favor realizar el cálculo de promoción en el SIGES' });
          this.showMessages = true;
          this.dialogo_proceso_busqueda = false;
          return;
        } else {

          // Crear una URL para el blob y generar un enlace de descarga
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'reporte_desarrollo_apredinzaje' + per_nie + '.pdf'; // Nombre del archivo de descarga
          link.click();
          window.URL.revokeObjectURL(blobUrl); // Liberar el recurso URL
          this.dialogo_proceso_busqueda = false;
          return;
        }

      })
      .catch(error => {
        console.log("Error al obtener el archivo PDF: " + error);
        this.dialogo_proceso_busqueda = false;
      });
  }




  /*
  //Reporte de desarrollo de aprendizaje
    imprimirFicha(per_nie: number, mat_estudiante_fk: number,sed_codigo: string): void {
      this.dialogo_proceso_busqueda = true;
      this.catalogoServiceTempEstudiantesSigesV2
        .imprimirReporteDesarrolloAprendisaje(per_nie, mat_estudiante_fk,sed_codigo,this.usuario, this.dui_usuario)
        .then(blob => {
  
          // Crear una URL para el blob y generar un enlace de descarga
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'reporte_desarrollo_apredinzaje' + per_nie + '.pdf'; // Nombre del archivo de descarga
          link.click();
          window.URL.revokeObjectURL(blobUrl); // Liberar el recurso URL
          this.dialogo_proceso_busqueda = false;
  
  
        })
        .catch(error => {
          console.log("Error al obtener el archivo PDF: " + error);
          this.dialogo_proceso_busqueda = false;
        });
    }
    */

  /*v1
  //Reporte de culminacion
  imprimirFichaCulminacion(per_nie: number, mat_estudiante_fk: number,sed_codigo: string): void {
    this.dialogo_proceso_busqueda = true;
    this.catalogoServiceTempEstudiantesSigesV2
      .imprimirReporteCulminacion(per_nie, mat_estudiante_fk,sed_codigo,this.usuario, this.dui_usuario)
      .then(blob => {
        // Crear una URL para el blob y generar un enlace de descarga
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'reporte_desarrollo_apredinzaje' + per_nie + '.pdf'; // Nombre del archivo de descarga
        link.click();
        window.URL.revokeObjectURL(blobUrl); // Liberar el recurso URL
        this.dialogo_proceso_busqueda = false;
      })
      .catch(error => {
        console.log("Error al obtener el archivo PDF: " + error);
        this.dialogo_proceso_busqueda = false;
      });
  }
  */





  //Reporte de culminacion
  imprimirFichaCulminacion(per_nie: number, mat_estudiante_fk: number, sed_codigo: string): void {
    this.dialogo_proceso_busqueda = true;
    this.catalogoServiceTempEstudiantesSigesV2
      .imprimirReporteCulminacion(per_nie, mat_estudiante_fk, sed_codigo, this.usuario, this.dui_usuario)
      .then(blob => {
        //console.log("El dato en 01 es:");
        //console.log("El dato en 02 es:" + blob.size);
        // Verificar si el blob contiene datos
        if (blob.size === 911 || blob.size === 899) {
          this.msgs.push(
            //{ severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
            //{ severity: 'success', summary: 'Success Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
            { severity: 'warn', summary: 'Warning Message', detail: 'El PDF está en blanco. No se ha generado ningún registro, favor realizar el cálculo de promoción en el SIGES' });
          this.showMessages = true;
          this.dialogo_proceso_busqueda = false;
          return;
        } else {
          // Crear una URL para el blob y generar un enlace de descarga
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'reporte_desarrollo_aprendizaje' + per_nie + '.pdf'; // Nombre del archivo de descarga
          link.click();
          window.URL.revokeObjectURL(blobUrl); // Liberar el recurso URL

          this.dialogo_proceso_busqueda = false;
        }
      })

      .catch(error => {
        console.log("Error al obtener el archivo PDF: " + error);
        this.dialogo_proceso_busqueda = false;
      });
  }




  /*
  //Reporte de culminacion
  imprimirFichaCulminacion(per_nie: number, mat_estudiante_fk: number, sed_codigo: string): void {
    this.dialogo_proceso_busqueda = true;
    this.catalogoServiceTempEstudiantesSigesV2
      .imprimirReporteCulminacion(per_nie, mat_estudiante_fk, sed_codigo, this.usuario, this.dui_usuario)
      .then(blob => {
     
          // Crear una URL para el blob y generar un enlace de descarga
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'reporte_desarrollo_aprendizaje' + per_nie + '.pdf'; // Nombre del archivo de descarga
          link.click();
          window.URL.revokeObjectURL(blobUrl); // Liberar el recurso URL
    
        this.dialogo_proceso_busqueda = false;
        
      })
    
      .catch(error => {
        console.log("Error al obtener el archivo PDF: " + error);
        this.dialogo_proceso_busqueda = false;
      });
  }
  */


  ocultarMensajes() {
    //this.showMessages = false;
    this.msgs = [];
  }




  public confirmarEliminacionEstudiante() {

  }



  get tableHeight() {
    const height = window.innerHeight;
    return `${height - 280}px`;
  }





}
