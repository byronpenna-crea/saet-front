import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { Sgp_tempEstudiantes } from 'src/app/models/sgp_temp_estudiantes';
import { CatalogoServiceTempEstudiantesSigesV2 } from 'src/app/services/catalogo/catalogo.service.temp_estudiantes_sigesv2';
import { Sgp_bitacoraReportesAud } from 'src/app/models/sgp_bitacora_reportes_aud';
import { CatalogoServiceBitacoraReportesAud } from 'src/app/services/catalogo/catalogo.service.bitacora_reportes_aud';
import { Sgp_sedes } from 'src/app/models/sgp_sedes';
import { Sgp_tablero } from 'src/app/models/sgp_tablero';
import { CatalogoServiceReporteActaResponsabilidad } from 'src/app/services/catalogo/catalogo.service.reporte_acta_responsabilidad';
import { Sg_af_unidades_activo_fijo } from 'src/app/models/sg_af_unidades_activo_fijo';
import { SgAfUnidadesAdministrativas } from 'src/app/models/sg_af_unidades_administrativas';
import { SgAfEmpleados } from 'src/app/models/sg_af_empleados';
import { CatalogoServiceSgAfEmpleados } from 'src/app/services/catalogo/catalogo.service.sg_af_empleados';
import { BienesDepreciables } from 'src/app/models/sg_af_bienes_depreciables';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SgRoles } from 'src/app/models/sg_roles';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { CatalogoServiceDocumentoEmpleado } from 'src/app/services/catalogo/catalogo.service.documento_empleado';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-reporte-acta-responsabilidad',
  templateUrl: './reporte-acta-responsabilidad.component.html',
  styleUrls: ['./reporte-acta-responsabilidad.component.css']
})
export class ReporteActaResponsabilidadComponent {

  @ViewChild('myTable') myTable!: ElementRef;
  lista_estudiantes: Sgp_tempEstudiantes[] = [];
  lista_bitacora: Sgp_bitacoraReportesAud[] = [];
  lista_tablero: Sgp_tablero[] = [];
  lista_sede: Sgp_sedes[] = [];
  lista_unidades_activo_fijo: Sg_af_unidades_activo_fijo[] = [];
  lista_unidades_administrativas: SgAfUnidadesAdministrativas[] = [];
  lista_sg_af_empleados: SgAfEmpleados[] = [];
  lista_sg_af_bienes_depreciables: BienesDepreciables[] = [];
  lista_sg_roles: SgRoles[] = [];
  est!: Sgp_tempEstudiantes;
  dialog!: boolean;
  submitted!: boolean;
  showMessages = false;
  estudiante_verificado!: Sgp_tempEstudiantes;
  unidades_activo_fijo_per_pk!: Sg_af_unidades_activo_fijo;
  msgs: Message[] = [];
  msgs_dialog: Message[] = [];
  //persona!: Personas;
  ////persona_registro_para_enviar!:Personas;
  displayConfirmation = false;
  tipo_transaccion: string = '';
  usuario: string = '';
  estado_opcion_seleccionado: string = '';
  estado_opcion_seleccionado_titulos: string = '';
  estado_firmante: string = 'LIC. ANTONIO JULIO CÉSAR SALAMANCA RIVERA';
  valor01: string = '';
  valor02: string = '';
  valor01_titulos: string = '';
  valor02_titulos: string = '';
  dui_usuario = '';
  reporte: number = 1;
  unidad_activo_fijo: number = 0;
  unidad_administrativa: number = 0;
  emp_pk: number = 0;
  total_valor_existente_number: number = 0;
  total_valor_existente_string = '0';
  total_valor_existente_string_dos = '0';
  per_pk = '';
  lista_opciones: any[] = [
    { label: 'Seleccione una opcion', value: '0' },
    { label: 'NIE', value: '1' },
    { label: 'NOMBRE DEL ESTUDIANTE', value: '2' },
    { label: 'CODIGO DEL C.E', value: '3' },

  ];

  lista_opciones_titulos: any[] = [
    { label: 'Seleccione una opcion', value: '0' },
    { label: 'NIE', value: '1' },
    { label: 'NOMBRE DEL ESTUDIANTE', value: '2' },
    { label: 'CODIGO DEL C.E', value: '3' },

  ];

  lista_anios: any[] = [
    { label: 'Seleccione un año', value: '0' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
    { label: '2020', value: '2020' },
    { label: '2019', value: '2019' },
    { label: '2018', value: '2018' },
    { label: '2017', value: '2017' },
    { label: '2016', value: '2016' },
    { label: '2015', value: '2015' },
    { label: '2014', value: '2014' },
  ];

  lista_firmantes: any[] = [
    { label: 'Seleccione un firmante', value: '0' },
    { label: 'LIC. ANTONIO JULIO CÉSAR SALAMANCA RIVERA', value: 'LIC. ANTONIO JULIO CÉSAR SALAMANCA RIVERA' },
    { label: 'LIC. ANA MIRIAM RAMÍREZ VALDEZ', value: 'LIC. ANA MIRIAM RAMÍREZ VALDEZ' },
    { label: 'ING. JOSÉ RODRIGO CRUZ HERNÁNDEZ', value: 'ING. JOSÉ RODRIGO CRUZ HERNÁNDEZ' },
    { label: 'ING. WILLIAM ALEXANDER COREAS RODRÍGUEZ', value: 'ING. WILLIAM ALEXANDER COREAS RODRÍGUEZ' },

  ];


  selectedYear: string = ''; // Año seleccionado
  dialogo_proceso_busqueda!: boolean;
  dialogo_carga_acta!: boolean;
  dialogo_proceso_busqueda_titulos!: boolean;
  options: any;
  data: any;
  chartData: any;
  chartOptions: any;
  contadorFilas: number = 1;
  sumaCorrelativos: number = 0;
  lista_acta_responsabilidad: any[] = [];
  selectedFile: File | null = null;
  uploadedFiles: any[] = [];
  /*
    constructor(private catalogoServiceBancos:CatalogoServiceBancos,
    @Inject(DOCUMENT) private document: Document){
    this.ban = new Bancos();
    this.persona_registro_para_enviar = new Personas();
  
    }
    */

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceTempEstudiantesSigesV2: CatalogoServiceTempEstudiantesSigesV2,
    private catalogoServiceBitacoraReportesAud: CatalogoServiceBitacoraReportesAud,
    private catalogoServiceReporteActaResponsabilidad: CatalogoServiceReporteActaResponsabilidad,
    private catalogoServiceDocumentoEmpleado: CatalogoServiceDocumentoEmpleado,
    private catalogoServiceSgAfEmpleados: CatalogoServiceSgAfEmpleados,
    private seguridadService: SeguridadService,private http: HttpClient,) {

    this.est = new Sgp_tempEstudiantes();
    this.unidades_activo_fijo_per_pk = new Sg_af_unidades_activo_fijo();

  }



  ngOnInit(): void {
    ///////////////////////////////////////////////////
    //Para las graficas
    ///////////////////////////////////////////////////
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    // Procesa los datos para agregar las cantidades por fecha y usuario
    const dataMap = new Map<string, Map<string, number>>();
    this.per_pk = localStorage.getItem('id_persona') || '';
    this.dui_usuario = localStorage.getItem('dui') || '';
    /*
    this.data = {
     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
     datasets: [
         {
             type: 'bar',
             label: 'Dataset 1',
             backgroundColor: documentStyle.getPropertyValue('--blue-500'),
             data: [50, 25, 12, 48, 90, 76, 42]
         },
         {
             type: 'bar',
             label: 'Dataset 2',
             backgroundColor: documentStyle.getPropertyValue('--green-500'),
             data: [21, 84, 24, 75, 37, 65, 34]
         },
         {
             type: 'bar',
             label: 'Dataset 3',
             backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
             data: [41, 52, 24, 74, 23, 21, 32]
         }
     ]
 };
 */
    /*
    this.data = {
      labels: [
          '01/11/2023', '02/11/2023', '03/11/2023', '04/11/2023', '05/11/2023',
          '06/11/2023', '07/11/2023', '08/11/2023', '09/11/2023', '10/11/2023',
          '11/11/2023', '12/11/2023', '13/11/2023', '14/11/2023', '15/11/2023'
      ],
      datasets: [
          {
              type: 'bar',
              label: 'Rmendez01',
              backgroundColor: documentStyle.getPropertyValue('--blue-500'),
              data: [11, 165, 23, 45, 10, 80, 100, 75, 32, 0, 45, 30, 65, 40, 85] // Cantidades para Rmendez01
          },
          {
              type: 'bar',
              label: 'Rmendez02',
              backgroundColor: documentStyle.getPropertyValue('--green-500'),
              data: [15, 25, 60, 0, 30, 40, 0, 85, 70, 20, 35, 50, 0, 45, 60] // Cantidades para Rmendez02
          },
          {
              type: 'bar',
              label: 'Rmendez03',
              backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
              data: [65, 0, 15, 75, 50, 20, 40, 10, 0, 55, 0, 25, 30, 0, 20] // Cantidades para Rmendez03
          },
          {
              type: 'bar',
              label: 'Usuario04',
              backgroundColor: documentStyle.getPropertyValue('--red-500'),
              data: [0, 16, 0, 10, 0, 20, 30, 0, 15, 40, 50, 5, 70, 25, 0] // Cantidades para Usuario04
          },
          {
              type: 'bar',
              label: 'Usuario05',
              backgroundColor: documentStyle.getPropertyValue('--purple-500'),
              data: [0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 10, 0] // Cantidades para Usuario05
          },
          {
              type: 'bar',
              label: 'Usuario06',
              backgroundColor: documentStyle.getPropertyValue('--orange-500'),
              data: [0, 350, 0, 0, 45, 0, 0, 0, 70, 0, 0, 120, 0, 0, 90] // Cantidades para Usuario06
          },
          // Puedes agregar más conjuntos de datos para otros usuarios
      ]
    };
    
    */

    /*
    this.data = {
      labels: ['01/11/2023', '02/11/2023', '03/11/2023',],
      datasets: [
          {
              type: 'bar',
              label: 'Rmendez01',
              backgroundColor: documentStyle.getPropertyValue('--blue-500'),
              data: [11, 165,] // Cantidades para Rmendez01 en diferentes días
          },
          {
              type: 'bar',
              label: 'Rmendez02',
              backgroundColor: documentStyle.getPropertyValue('--green-500'),
              data: [15, 25,] // Cantidades para Rmendez02 en diferentes días
          },
          {
              type: 'bar',
              label: 'Rmendez03',
              backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
              data: [65, 0,] // Cantidades para Rmendez03 en diferentes días
          },
          {
              type: 'bar',
              label: 'Rmendez04',
              backgroundColor: documentStyle.getPropertyValue('--red-500'),
              data: [0, 16,] // Cantidades para Rmendez04 en diferentes días
          },
          {
              type: 'bar',
              label: 'Rmendez05',
              backgroundColor: documentStyle.getPropertyValue('--purple-500'),
              data: [0, 0,] // Cantidades para Rmendez05 en diferentes días
          },
          {
              type: 'bar',
              label: 'Rmendez06',
              backgroundColor: documentStyle.getPropertyValue('--orange-500'),
              data: [0, 350,] // Cantidades para Rmendez06 en diferentes días
          },
          // Puedes agregar más conjuntos de datos para otros usuarios
      ]
    };
    */




    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false
        },
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };



    ///////////////////////////////////////////////////



    this.estado_opcion_seleccionado = '1';
    this.estado_opcion_seleccionado_titulos = '1';
    /*
    this.catalogoServiceTempEstudiantesSigesV2.getAllTempEstudiantes()
      .then(response => {
        console.log(response)
        this.lista_estudiantes = response;
      }).catch(error => {
        console.log("Error al obtener las empresas: " + error)
      });

      */
    const primer_nombre = localStorage.getItem('primer_nombre') || '';
    //console.log("Primer nombre es: "+primer_nombre);
    const primer_apellido = localStorage.getItem('primer_apellido') || '';
    this.dui_usuario = localStorage.getItem('dui') || '';
    //console.log("Primer apellido es: "+primer_apellido);
    this.usuario = primer_nombre[0] + primer_apellido;
    //console.log("El usuario es: "+this.usuario);


    this.seguridadService.obtenerRolesPorUsuario(this.dui_usuario)
      .then(response => {
        //console.log(response)
        this.lista_sg_roles = response;
        this.lista_sg_roles.forEach(m => {
          //Administrador de Activo Fijo 
          ///console.log("El rol es: "+m.rol_pk);
          if (m.rol_pk === 85) {


            this.catalogoServiceReporteActaResponsabilidad.getAllUnidadesActivoFijo()
              .then(response => {
                //console.log(response)
                this.lista_unidades_activo_fijo = response;

                /*
                this.lista_unidades_activo_fijo.forEach(acta => {
                  console.log(acta); // Accede a cada elemento de la lista acta aquí
                });
                */



              }).catch(error => {
                console.log("Error al obtener las unidades de activo fijo: " + error);
              });

            //Activo Fijo Departamental  
          } else if (m.rol_pk === 86) {

            this.catalogoServiceReporteActaResponsabilidad.getAllUnidadesActivoFijoPorIdPersona(parseInt(this.per_pk))
              .then(response => {
                //console.log(response)
                this.unidades_activo_fijo_per_pk = response;
                this.lista_unidades_activo_fijo.push(response);

                this.catalogoServiceReporteActaResponsabilidad.getAllUnidadesAdministrativasPorIdPersona(parseInt(this.per_pk))
                  .then(response => {
                    //console.log(response)

                    this.lista_unidades_administrativas = response;



                  }).catch(error => {
                    console.log("Error al obtener la unidad de activo por id persona: " + error);
                  });
                //console.log("La unidad de activo fijo es: "+this.unidades_activo_fijo_per_pk); // Accede a cada elemento de la lista acta aquí



              }).catch(error => {
                console.log("Error al obtener la unidad de activo por id persona: " + error);
              });

            //Rol Activo Fijo Unidad Administrativa
          } else if (m.rol_pk === 129) {

            this.catalogoServiceReporteActaResponsabilidad.getAllUnidadesActivoFijoPorIdPersona(parseInt(this.per_pk))
              .then(response => {
                //console.log(response)
                this.unidades_activo_fijo_per_pk = response;
                this.lista_unidades_activo_fijo.push(response);


                //console.log("La unidad de activo fijo es: "+this.unidades_activo_fijo_per_pk); // Accede a cada elemento de la lista acta aquí

                this.catalogoServiceReporteActaResponsabilidad.getAllUnidadesAdministrativasPorIdPersona(parseInt(this.per_pk))
                  .then(response => {
                    //console.log(response)

                    this.lista_unidades_administrativas = response;



                  }).catch(error => {
                    console.log("Error al obtener la unidad de activo por id persona: " + error);
                  });



              }).catch(error => {
                console.log("Error al obtener la unidad de activo por id persona: " + error);
              });


          } else if (m.rol_pk === 160) {


            this.catalogoServiceReporteActaResponsabilidad.getAllUnidadesActivoFijo()
              .then(response => {
                //console.log(response)
                this.lista_unidades_activo_fijo = response;

                /*
                this.lista_unidades_activo_fijo.forEach(acta => {
                  console.log(acta); // Accede a cada elemento de la lista acta aquí
                });
                */



              }).catch(error => {
                console.log("Error al obtener las unidades de activo fijo: " + error);
              });

            //Activo Fijo Departamental  
          }





        });




      }).catch(error => {
        console.log("Error al obtener los roles: " + error)
      });




    this.catalogoServiceBitacoraReportesAud.getAllBitacoras()
      .then(response => {
        //console.log(response)
        this.lista_bitacora = response;
      }).catch(error => {
        console.log("Error al obtener las bitacoras: " + error);
      });








    this.catalogoServiceBitacoraReportesAud.obtenerDatosTableroPorReporte(1)
      .then(response => {
        //console.log(response)
        this.lista_tablero = response;
        /*
        this.lista_tablero.forEach(item => {
          // Aquí puedes acceder a cada elemento de la lista a través de la variable 'item'
          console.log(item.usuario);
          console.log(item.mes_fecha);
          console.log(item.total_registro);
        
          // Puedes realizar cualquier operación que desees con los elementos de la lista aquí.
        });
        */

        /*
        // Configura tus datos para el gráfico
          this.chartData = {
          labels: this.lista_tablero.map(item => item.mes_fecha), // Etiquetas de fecha
          datasets: this.lista_tablero.map(item => ({
          label: item.usuario,
          //backgroundColor: this.getRandomColor(), // Genera un color aleatorio para cada usuario
          data: [item.total_registro] // Aquí asumimos que total_registro es el valor de cantidad
          }))
          };
          */

        // Obtener la lista de usuarios únicos
        const usuariosUnicos = [...new Set(this.lista_tablero.map(item => item.usuario))];

        // Obtener la lista de todas las fechas únicas en tus datos
        const fechasUnicas = [...new Set(this.lista_tablero.map(item => item.mes_fecha))];

        // Crear un conjunto completo de datos para cada usuario en cada fecha
        const datasets = usuariosUnicos.map(usuario => {
          return {
            label: usuario,
            data: fechasUnicas.map(fecha => {
              const item = this.lista_tablero.find(
                data => data.mes_fecha === fecha && data.usuario === usuario
              );
              return item ? item.total_registro : 0;
            }),
          };
        });

        // Configurar tus datos para el gráfico
        this.chartData = {
          labels: fechasUnicas,
          datasets: datasets,
        };




      }).catch(error => {
        console.log("Error al obtener los tableros: " + error);
      });









  }









  /*v1
    imprimirFicha(per_nie: number, ale_anio: number): void {
  
      this.catalogoServiceTempEstudiantesSigesV2.imprimirFicha(parseInt(this.valor01),parseInt(this.selectedYear))
      .then(response => {
        console.log(response)
        this.lista_estudiantes=response;
      }).catch(error => {
        console.log("Error al obtener las empresas: " + error)
      });
  
  
  
      }
  */

  /*v2
  imprimirFicha(per_nie: number, ale_anio: number): void {
      this.dialogo_proceso_busqueda = true;
      this.catalogoServiceTempEstudiantesSigesV2
        .imprimirFicha(per_nie, ale_anio, this.usuario, this.estado_firmante, this.dui_usuario)
        .then(blob => {
          console.log("El valor del pdf es****: "+blob.size);
  
          if (blob === '[object Blob]') {
            console.log("El valor del pdf es++++: "+blob.size);
            this.msgs.push(
              //{ severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
              //{ severity: 'success', summary: 'Success Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
              { severity: 'warn', summary: 'Warning Message', detail: 'El PDF está en blanco. No se ha generado ningún archivo.' });
            this.showMessages = true;
            this.dialogo_proceso_busqueda = false;
            return;
           
          }else{
            console.log("El valor del pdf 02 es: "+blob.size);
            // Crear una URL para el blob y generar un enlace de descarga
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'certificacion_de_notas' + per_nie + '.pdf'; // Nombre del archivo de descarga
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
  
  */






  /*
    imprimirFicha(per_nie: number, ale_anio: number): void {
      this.dialogo_proceso_busqueda = true;
      this.catalogoServiceTempEstudiantesSigesV2
        .imprimirFicha(per_nie, ale_anio, this.usuario, this.estado_firmante, this.dui_usuario)
        .then(blob => {
            console.log("El valor del pdf 02 es: "+blob.size);
            // Crear una URL para el blob y generar un enlace de descarga
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'certificacion_de_notas' + per_nie + '.pdf'; // Nombre del archivo de descarga
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





  cargarUnidadesAdministrativas() {
    this.lista_sg_roles.forEach(m => {
      if (m.rol_pk === 85) {
        //console.log("Estoy dentro del if 01");
        this.catalogoServiceReporteActaResponsabilidad.getAllUnidadesAdministrativas(this.unidad_activo_fijo)
          .then(response => {
            //console.log(response)
            this.lista_unidades_administrativas = response;

            this.lista_unidades_administrativas.forEach(acta => {
              //console.log(acta); // Accede a cada elemento de la lista acta aquí
            });


          }).catch(error => {
            console.log("Error al obtener las unidades administrativas: " + error);
          });
      } else if (m.rol_pk === 86) {
        //console.log("Estoy dentro del if 01");
        this.catalogoServiceReporteActaResponsabilidad.getAllUnidadesAdministrativas(this.unidad_activo_fijo)
          .then(response => {
            //console.log(response)
            this.lista_unidades_administrativas = response;

            this.lista_unidades_administrativas.forEach(acta => {
              // console.log(acta); // Accede a cada elemento de la lista acta aquí
            });


          }).catch(error => {
            console.log("Error al obtener las unidades administrativas: " + error);
          });
      } else if (m.rol_pk === 160) {
        //console.log("Estoy dentro del if 01");
        this.catalogoServiceReporteActaResponsabilidad.getAllUnidadesAdministrativas(this.unidad_activo_fijo)
          .then(response => {
            //console.log(response)
            this.lista_unidades_administrativas = response;

            this.lista_unidades_administrativas.forEach(acta => {
              //console.log(acta); // Accede a cada elemento de la lista acta aquí
            });


          }).catch(error => {
            console.log("Error al obtener las unidades administrativas: " + error);
          });
      }
      //console.log("Estoy dentro del if 02");
    })

  }


  cargarEmpleadosPorUnidadAdministrativa() {

    this.catalogoServiceSgAfEmpleados.getEmpleadosPorUnidadesAdministrativas(this.unidad_administrativa)
      .then(response => {
        //console.log(response)
        this.lista_sg_af_empleados = response;






      }).catch(error => {
        console.log("Error al obtener los empleados por las unidades administrativas: " + error);
      });



  }

  cargarBienesPorEmpleadosPorUnidadAdministrativa() {

    this.contadorFilas = 1;
    this.sumaCorrelativos = 0;
    this.catalogoServiceReporteActaResponsabilidad.getAllBienesPorEmpleado(this.emp_pk)
      .then(response => {
        console.log(response)
        this.lista_sg_af_bienes_depreciables = response;

        this.lista_sg_af_bienes_depreciables.forEach(acta => {
          //console.log(acta); // Accede a cada elemento de la lista acta aquí
        });


        this.lista_sg_af_bienes_depreciables.forEach(item => {
          item['bde_pk'] = this.contadorFilas++;
          // Calcula la suma de correlativos
          this.sumaCorrelativos = this.lista_sg_af_bienes_depreciables.length;;
        });




      }).catch(error => {
        console.log("Error al obtener los bienes por empleado: " + error);
      });


  }


  /*
    imprimirActaResponsabilidad(): void {
      this.dialogo_proceso_busqueda = true;
     // console.log("El id de la persona es: " + this.emp_pk)
      this.catalogoServiceReporteActaResponsabilidad.imprimirActaResponsabilidad(this.emp_pk, this.dui_usuario)
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
            link.download = 'acta_de_responsabilidad' + this.dui_usuario + '.pdf'; // Nombre del archivo de descarga
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
  */

  buscarActaResponsabilidad(): void {
    this.dialogo_proceso_busqueda = true;
    // console.log("El id de la persona es: " + this.emp_pk)
    this.catalogoServiceReporteActaResponsabilidad.buscarActaResponsabilidad(this.emp_pk, this.usuario, this.dui_usuario)
      .then(resp => {
        // Crear una URL para el blob y generar un enlace de descarga

        this.lista_acta_responsabilidad = resp;
        console.log(this.lista_acta_responsabilidad);
        this.dialogo_proceso_busqueda = false;

        this.generarPdfActaResponsabilidad(this.lista_acta_responsabilidad);

      })
      .catch(error => {
        console.log("Error al obtener el archivo PDF v2: " + error);
        this.dialogo_proceso_busqueda = false;
      });
  }

cargarActa(): void {

  this.dialogo_carga_acta=true;

}




  NewBancoDialog() {
    this.limpiar();
    this.tipo_transaccion = "c";
    this.dialog = true;
    //this.mar = new Marcas();
    /*
    this.catalogoServiceMarcas.getAllMarcas().then(response=>{
      console.log(response);
      this.lista_marcas = response;
    }).catch(error => {
      console.log("Error al obtener las marcas: " + error)
    });
  */
    /*
    this.seguridadService.getAllUsuarios().then(res=>{
      this.listaUsuarios = res;
    }).catch(error => {
      console.log("Error al obtener el menú de usuarios: " + error)
    });

*/



  }












  get tableHeight() {
    const height = window.innerHeight;
    return `${height - 280}px`;
  }

  ocultarMensajes() {
    this.showMessages = false;
    this.msgs = [];
  }

  cancelarDialogo() {
    this.dialog = false;

    this.limpiar();
  }

  limpiar() {

    //this.ban = new Bancos();
    this.tipo_transaccion = '';
    this.estado_opcion_seleccionado = "";
  }


  getRandomColor() {
    // Genera un color hexadecimal aleatorio
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  actualizarTablero(reporte: number) {
    this.reporte = reporte;
    //console.log("El reporte es: " + this.reporte);
    this.catalogoServiceBitacoraReportesAud.obtenerDatosTableroPorReporte(this.reporte)
      .then(response => {
        //console.log(response)
        this.lista_tablero = response;

        /*
        // Configura tus datos para el gráfico
    this.chartData = {
      labels: this.lista_tablero.map(item => item.mes_fecha), // Etiquetas de fecha
      datasets: this.lista_tablero.map(item => ({
        label: item.usuario,
        //backgroundColor: this.getRandomColor(), // Genera un color aleatorio para cada usuario
        data: [item.total_registro] // Aquí asumimos que total_registro es el valor de cantidad
      }))
    };
    */

        // Crear un conjunto de usuarios únicos
        const usuariosUnicos = [...new Set(this.lista_tablero.map(item => item.usuario))];

        // Configurar etiquetas de fecha únicas
        const fechasUnicas = [...new Set(this.lista_tablero.map(item => item.mes_fecha))];

        // Crear un conjunto de objetos para almacenar los datos del gráfico
        const datasets = usuariosUnicos.map(usuario => {
          return {
            label: usuario,
            data: fechasUnicas.map(fecha => {
              const item = this.lista_tablero.find(
                data => data.mes_fecha === fecha && data.usuario === usuario
              );
              return item ? item.total_registro : 0;
            }),
          };
        });

        // Configurar tus datos para el gráfico
        this.chartData = {
          labels: fechasUnicas,
          datasets: datasets,
        };



      }).catch(error => {
        console.log("Error al obtener los tableros: " + error);
      });

  }



  calcularTotalAdquisicion(): number {
    if (this.lista_sg_af_bienes_depreciables) {
      return this.lista_sg_af_bienes_depreciables.reduce((total, item) => total + item.bde_valor_adquisicion, 0);
    }
    return 0;
  }




/*
  calcularTotalAdquisicionBueno(): number {
    if (this.lista_sg_af_bienes_depreciables) {
      // Filtra los elementos que cumplan las condiciones
      const elementosFiltrados = this.lista_sg_af_bienes_depreciables.filter(item => 
        item.bde_anio === null &&
        item.bde_asignado_a === null &&
        item.bde_bien_es_fuente_siap === false &&
        item.bde_estado_fk.ebi_pk && item.bde_estado_fk.ebi_pk ===1
      );
  
      // Calcula el total solo para los elementos filtrados
      const totalCalculado = elementosFiltrados.reduce((total, item) => total + item.bde_valor_adquisicion, 0);
  
      // Asigna el total a la variable
      this.total_valor_existente = totalCalculado;
  
      // Devuelve el total calculado
      return totalCalculado;
    } else {
      // Si no se cumple la condición inicializa la variable en 0 y devuelve 0
      this.total_valor_existente = 0;
      return 0;
    }
  }
*/

/*
calcularTotalAdquisicionBueno(): number {
  if (this.lista_sg_af_bienes_depreciables) {
    const elementosFiltrados = this.lista_sg_af_bienes_depreciables.filter(item => 
      item.bde_anio === null &&
      item.bde_asignado_a === null &&
      item.bde_bien_es_fuente_siap === false &&
      item.bde_estado_fk.ebi_pk && item.bde_estado_fk.ebi_pk === 1
    );

    const totalCalculado = elementosFiltrados.reduce((total, item) => total + item.bde_valor_adquisicion, 0);

    // Asigna el total calculado como una cadena formateada
    this.total_valor_existente = '$ ' + totalCalculado.toFixed(2).replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Devuelve el total calculado como número
    return totalCalculado;
  } else {
    // Si no se cumple la condición, inicializa la variable en '0' como cadena y devuelve 0 como número
    this.total_valor_existente = '0';
    return 0;
  }
}
*/
  

calcularTotalAdquisicionBueno(): number {

  if (this.lista_sg_af_bienes_depreciables) {
    this.total_valor_existente_number = 0; // Inicializa el total en 0
    this.lista_sg_af_bienes_depreciables.forEach(m => {

      if(m.bde_estado_fk.ebi_pk===1){

        this.total_valor_existente_number += m.bde_valor_adquisicion; // Acumula el valor en cada iteración
        this.total_valor_existente_string=this.total_valor_existente_number.toString();
        this.total_valor_existente_string_dos='$ ' + this.total_valor_existente_number.toFixed(2).replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      }

    });


     return this.total_valor_existente_number;
    }else {
    // Si no se cumple la condición, inicializa la variable en '0' como cadena y devuelve 0 como número
    this.total_valor_existente_number = 0;
    return 0;
  }
}
  



  actualizarCantidadResultados(event: any) {
    // Obtén la cantidad de resultados después de aplicar el filtro
    this.sumaCorrelativos = event.filteredValue.length;
  }






  generarPdfActaResponsabilidad(lista_acta_responsabilidad: any[]) {
    pdfMake!.vfs = pdfFonts.pdfMake.vfs;

    const imagePath1 = 'assets/elSalvador.png';
    const imagePath2 = 'assets/image002.png';

    // Convierte la primera imagen en base64
    const base64data1 = fetch(imagePath1)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
        });
      });

    // Convierte la segunda imagen en base64
    const base64data2 = fetch(imagePath2)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
        });
      });

    // Utiliza la imagen en formato base64 en la definición del PDF
    base64data1.then((base64_1) => {


         // Crear un array para los encabezados de la tabla (opcional)
      const tableHeaders = ['N°', 'Número Inventario', 'Descripcion Bien', 'Marca', 'Serie', 'Calidad', 'Fecha Adquisición', 'Valor Adquisición'];

      // Crear un array para los datos de la tabla
      /*//v1
      const tableData = lista_acta_responsabilidad.map(item => [
        item[0], // Columna 1
        item[4], // Columna 2
        item[5], // Columna 3
        item[6], // Columna 4
        item[7], // Columna 5
        item[8], // Columna 6
        item[9], // Columna 7
        item[10], // Columna 8
      ]);
*/
/* //v2
const tableData = lista_acta_responsabilidad.map(item => [
  { text: item[0], style: 'tablaDeResultadoTexto' }, // Columna 1
  { text: item[4], style: 'tablaDeResultadoTexto' }, // Columna 2
  { text: item[5], style: 'tablaDeResultadoTexto' }, // Columna 3
  { text: item[6], style: 'tablaDeResultadoTexto' }, // Columna 4
  { text: item[7], style: 'tablaDeResultadoTexto' }, // Columna 5
  { text: item[8], style: 'tablaDeResultadoTexto' }, // Columna 6
  { text: item[9], style: 'tablaDeResultadoTexto' }, // Columna 7
  { text: item[10], style: 'tablaDeResultadoTexto' }, // Columna 8
]);
*/

const tableData = lista_acta_responsabilidad.map(item => [
  { text: item[0], style: 'tablaDeResultadoTexto' }, // Columna 1
  { text: item[4], style: 'tablaDeResultadoTexto' }, // Columna 2
  { text: item[5], style: 'tablaDeResultadoTexto' }, // Columna 3
  { text: item[6], style: 'tablaDeResultadoTexto' }, // Columna 4
  { text: item[7], style: 'tablaDeResultadoTexto' }, // Columna 5
  { text: item[8], style: 'tablaDeResultadoTexto' }, // Columna 6
  { text: item[9], style: 'tablaDeResultadoTexto' }, // Columna 7
  {
    text: `$ ${item[10]}`, // Concatena el signo de dólar al texto de item[10]
    style: 'tablaDeResultadoTexto',
  }, // Columna 8
 
]);


        const pdfDefinition: any = {
          content: [
            {
              image: base64_1, // Imagen en formato base64
              width: 60, // Ancho de la imagen en puntos
              alignment: 'center', // Alinea la imagen a la izquierda
              margin: [0, -25, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
            },
            { text: 'MINISTERIO DE EDUCACIÓN, CIENCIA Y TECNOLOGÍA', style: 'header' },
            { text: 'DEPARTAMENTO DE ACTIVO FIJO', style: 'header' },
            { text: 'ACTA DE RESPONSABILIDAD', style: 'header' },
            ,
            {
              text: [
                '\n\nEn la ',
                { text: lista_acta_responsabilidad[0][1], bold: true },
                ' del Ministerio de Educación, a las ',
                { text: this.obtenerHoraActual(), bold: true },
                ' del día ',
                { text: this.formatearFecha(this.getCurrentDate()), bold: true },
                ', presentes ',
                { text: lista_acta_responsabilidad[0][2], bold: true },
                ', DELEGADO DE ACTIVO FIJO Y ',
                { text: lista_acta_responsabilidad[0][3], bold: true },
                ', ambos empleados de esta unidad, la primera con el objetivo de actualizar y constatar la asignación del equipo y mobiliario asignado al segundo, detallado a continuación:\n\n'
              ],
              style: 'subheaderParrafo'
            },
            {
              table: {
                headerRows: 1,
                widths: ['auto', '14%', '25%', '12%', '13%', 'auto', '12%', '12%'],
                body: [
                  tableHeaders.map(header => ({ text: header, style: 'tablaHeader'})), // Aplicar estilo a los encabezados
                  ...tableData,
                ],
              },
            },
            { text: this.total_valor_existente_string_dos,style: 'totalTabla' },
            /*
            {
              text: 'Los Bienes y Mobiliario descritos anteriormente, quedan bajo su custodia y responsabilidad, cualquier pérdida, extravío o deterioro culposo de los bienes que se reciba, se tendrá que aplicar lo que establece el Art. 57 de la Ley de la Corte de Cuentas de la República.',
              pageBreak: 'before', // Salto de página antes de este texto
            }
            */
            {
              text: '\n\nLos Bienes y Mobiliario descritos anteriormente, quedan bajo su custodia y responsabilidad, cualquier pérdida, extravío o deterioro culposo de los bienes que se reciba, se tendrá que aplicar lo que establece el Art. 57 de la Ley de la Corte de Cuentas de la República.',
              pageBreak: lista_acta_responsabilidad.length > 9 && (lista_acta_responsabilidad.length < 20 ? 'after' : (lista_acta_responsabilidad.length > 25 ? 'before' : undefined)),style: 'subheaderParrafo'

            }
            ,
            { text: '\n\nY no habiendo más que constar, ratificamos su contenido y firmamos de conformidad.\n\n\n\n\n\n\n',style: 'subheaderParrafo'},
            /*
            -Si lista_acta_responsabilidad.length < 20 es verdadero (es decir, si la lista tiene menos de 14 elementos), entonces pageBreak se establece en 'after', lo que significa que habrá un salto de página después de este bloque de texto.
            -Si esa condición es falsa pero lista_acta_responsabilidad.length > 9 es verdadera (la lista tiene entre 10 y 14 elementos), entonces pageBreak se establece en 'before', indicando que el salto de página debe ocurrir antes de este bloque de texto.
            -Si ninguna de estas condiciones es verdadera (la lista tiene 9 elementos o menos), pageBreak se establece en undefined, lo que significa que no se aplicará ningún salto de página específico en este punto.
            */
            {
              columns: [
                {
                  width: '50%', // El 50% del ancho de la página
                  stack: [
                    { text: 'Entrega:\n\nFirma:', margin: [0, 5, 0, 0], fontSize: 9 }, // Salto de línea después de "Entrega:" y tamaño de fuente 9
                    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0 }] }, // Raya para la firma
                    { text: '\n' + lista_acta_responsabilidad[0][2], fontSize: 9, margin: [0, -8, 0, 0],}, // Agrega el contenido deseado y tamaño de fuente 9
                    { text: '\nDELEGADO DE ACTIVO FIJO.\n',fontSize: 9, margin: [0, -8, 0, 0],},
                    { text: '\n' + lista_acta_responsabilidad[0][1], fontSize: 9,margin: [0, -12, 0, 0] }, // Agrega el contenido deseado y tamaño de fuente 9
                  ],
                },
                {
                  width: '50%', // El 50% del ancho de la página
                  stack: [
                    { text: 'Recibe:\n\nFirma:', margin: [0, 5, 0, 0], fontSize: 9 }, // Salto de línea después de "Entrega:" y tamaño de fuente 9
                    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0 }] }, // Raya para la firma
                    { text: '\n' + lista_acta_responsabilidad[0][3], fontSize: 9, margin: [0, -8, 0, 0], }, // Agrega el contenido deseado y tamaño de fuente 9
                    { text: '\n' + lista_acta_responsabilidad[0][1], fontSize: 9,margin: [0, -12, 0, 0] }, // Agrega el contenido deseado y tamaño de fuente 9
                  ],
                },
              ],
            }
            /*
            ,{
              text: [
                '\n\nVerificó y elaboró:\n ',
                { text: this.usuario, bold: true },
              ],
              fontSize: 8,
            }
            */,
            {
              text: [
                'Obtenido del sistema SIGES: ',
              ],
              fontSize: 8,
            }
          ],
          styles: {
            header: {
              fontSize: 11,
              bold: true,
              alignment: 'center',
            },
            subheader: {
              fontSize: 10,
              bold: true,
              alignment: 'justify',
            },
            subheaderParrafo: {
              fontSize: 9,
              alignment: 'justify',
            },
            textWithBreak: {
              noWrap: false, // Evitar la división automática del texto
              pageBreak: 'auto', // Permitir salto de página automático
            },
            subheaderFirma: {
              fontSize: 10,
              bold: true,
              alignment: 'center',
            },
            tablaDeResultadoTexto: {
              fontSize: 9,
              
            },
            totalTabla: {
              fontSize: 12,
              bold: true,
              margin: [440, 0, 0,0 ]
     
            },
            tablaHeader: {
              fontSize: 9,
              bold: true,
              fillColor: '#DDDDDD', // Gris suave elegante
              color: '#000000', // Color de texto negro (negrito)
              alignment: 'center', // Centro de texto en celdas
              valign: 'middle', // Centro de texto vertical
            },
          },
          footer: function (pageNumber: number, pageCount: number) { // Agregamos tipos explícitos
            return {
              text: `Página ${pageNumber.toString()} de ${pageCount}`, // Cambiado de Page a Página
              alignment: 'center',
              fontSize: 10,
            };
          },
        };

        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open(); // Para abrir en otra pestaña.
        pdf.download(); // Para descargar.

    });
  }



  // Función de formateo de fecha personalizada
  formatearFecha(fecha: string): string {
    //console.log(fecha);
    const partesFecha = fecha.split('-'); // Suponiendo que la fecha está en formato "YYYY-MM-DD"
    const dia = partesFecha[2];
    const mes = partesFecha[1];
    const anio = partesFecha[0];

    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    return `${dia} DE ${meses[parseInt(mes) - 1].toUpperCase()} DE ${anio}`;
  }


  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses comienzan desde 0
    const day = today.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  obtenerHoraActual() {
    const fechaActual = new Date();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    //const horaFormateada = `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos}`; //v1 con minutos
    const horaFormateada = `${horas < 10 ? '0' : ''}${horas}`;
    return `a las ${horaFormateada} horas`;
  }
  

  onFileSelected(event: any) {
    console.log("Entrando en carga de documento");
     this.selectedFile = event.files && event.files[0] ? event.files[0] : null;
  }


  /*
  uploadFile() {
    console.log("Entrando en guardar documento");
    if (this.selectedFile) {
      console.error('No se ha seleccionado ningún archivo.');
     

      this.catalogoServiceDocumentoEmpleado.cargarActaResponsabilidad(this.selectedFile!,this.emp_pk)
      //this.catalogoServiceDocumentoEmpleado.cargarActaResponsabilidad(this.emp_pk)
      .then(response => {
        //console.log(response)
        this.lista_sg_af_bienes_depreciables = response;


      }).catch(error => {
        console.log("Error al cargar documento: " + error);
      });


    }else{
      console.log("No tiene datos");
    }


  }
*/


onUpload(event:any) {

  for(let file of event.files) {
      this.uploadedFiles.push(file);
  }


}




uploadFile() {
  console.log("Entrando en guardar documento");
  if (this.selectedFile) {
    console.error('No se ha seleccionado ningún archivo.');
   

    this.catalogoServiceDocumentoEmpleado.cargarActaResponsabilidad(this.selectedFile!,this.emp_pk)
    //this.catalogoServiceDocumentoEmpleado.cargarActaResponsabilidad(this.emp_pk)
    .then(response => {
      //console.log(response)
      this.lista_sg_af_bienes_depreciables = response;


    }).catch(error => {
      console.log("Error al cargar documento: " + error);
    });


  }else{
    console.log("No tiene datos");
  }


}



}








