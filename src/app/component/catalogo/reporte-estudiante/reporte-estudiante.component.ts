import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { Sgp_tempEstudiantes } from 'src/app/models/sgp_temp_estudiantes';
import { CatalogoServiceTempEstudiantesSigesV2 } from 'src/app/services/catalogo/catalogo.service.temp_estudiantes_sigesv2';
import { Sgp_bitacoraReportesAud } from 'src/app/models/sgp_bitacora_reportes_aud';
import { CatalogoServiceBitacoraReportesAud } from 'src/app/services/catalogo/catalogo.service.bitacora_reportes_aud';
import { Sgp_sedes } from 'src/app/models/sgp_sedes';
import { Sgp_tablero } from 'src/app/models/sgp_tablero';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';



@Component({
  selector: 'app-reporte-estudiante',
  templateUrl: './reporte-estudiante.component.html',
  styleUrls: ['./reporte-estudiante.component.css']
})
export class ReporteEstudianteComponent {
  @ViewChild('myTable') myTable!: ElementRef;
  lista_estudiantes: Sgp_tempEstudiantes[] = [];
  lista_bitacora: Sgp_bitacoraReportesAud[] = [];
  lista_tablero: Sgp_tablero[] = [];
  lista_sede: Sgp_sedes[] = [];
  lista_certificacion_titulos: any[] = [];
  lista_certificacion_parvularia: any[] = [];
  est!: Sgp_tempEstudiantes;
  dialog!: boolean;
  submitted!: boolean;
  showMessages = false;
  pdfMake = pdfFonts.pdfMake.vfs;
  estudiante_verificado!: Sgp_tempEstudiantes;
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
  fecha_sistema: string = '';

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
  dialogo_proceso_busqueda_titulos!: boolean;
  options: any;
  data: any;
  chartData: any;
  chartOptions: any;




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
    private catalogoServiceBitacoraReportesAud: CatalogoServiceBitacoraReportesAud) {

    this.est = new Sgp_tempEstudiantes();

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



  buscarEstudiantes() {
    //console.log("Estoy en 01");
    this.lista_estudiantes = [];

    if (this.estado_opcion_seleccionado === '1') {
      this.dialogo_proceso_busqueda = true;


      //console.log("Estoy en 02");
      this.catalogoServiceTempEstudiantesSigesV2.getAStudentByNiev1(this.valor01, this.selectedYear)
        .then(response => {

          setTimeout(() => {
            this.ocultarMensajes();
            this.showMessages = false;
            this.dialogo_proceso_busqueda = false;
          }, 7000);



          this.imprimirFicha(parseInt(this.valor01), parseInt(this.selectedYear));


          //console.log(response)
          this.lista_estudiantes.push(response);
        }).catch(error => {
          this.dialogo_proceso_busqueda = false;
          this.msgs.push(
            { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros.' });
          this.showMessages = true;

        });





    } else if (this.estado_opcion_seleccionado === '2') {


    } else if (this.estado_opcion_seleccionado === '3') {

      this.dialogo_proceso_busqueda = true;



      this.catalogoServiceTempEstudiantesSigesV2.getAStudentByCodv1(this.valor01, this.selectedYear)
        .then(response => {
          this.showMessages = false;
          this.dialogo_proceso_busqueda = false;
          setTimeout(() => {
            this.ocultarMensajes();
          }, 7000);



          //console.log(response)
          this.lista_estudiantes = response;
        }).catch(error => {
          this.dialogo_proceso_busqueda = false;
          this.msgs.push(
            { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros.' });
          this.showMessages = true;

        });


      /*
            this.catalogoServiceTempEstudiantesSigesV2.getAStudentByCodv1(this.valor01,this.selectedYear)
            .then(response => {
              console.log(response)
              this.lista_estudiantes=response;
            }).catch(error => {
              console.log("Error al obtener las empresas: " + error)
            });
      */


    }





  }


  buscarEstudiantesParvularia() {
    //console.log("Estoy en 01");
    this.lista_estudiantes = [];

    if (this.estado_opcion_seleccionado === '1') {
      this.dialogo_proceso_busqueda = true;


      //console.log("Estoy en 02");
      this.catalogoServiceTempEstudiantesSigesV2.getAStudentByNiev1(this.valor01, this.selectedYear)
        .then(response => {

          setTimeout(() => {
            this.ocultarMensajes();
            this.showMessages = false;
            this.dialogo_proceso_busqueda = false;
          }, 7000);



          this.imprimirFichaParvularia(parseInt(this.valor01), parseInt(this.selectedYear));


          //console.log(response)
          this.lista_estudiantes.push(response);
        }).catch(error => {
          this.dialogo_proceso_busqueda = false;
          this.msgs.push(
            { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros.' });
          this.showMessages = true;

        });





    } else if (this.estado_opcion_seleccionado === '2') {


    } else if (this.estado_opcion_seleccionado === '3') {

      this.dialogo_proceso_busqueda = true;



      this.catalogoServiceTempEstudiantesSigesV2.getAStudentByCodv1(this.valor01, this.selectedYear)
        .then(response => {
          this.showMessages = false;
          this.dialogo_proceso_busqueda = false;
          setTimeout(() => {
            this.ocultarMensajes();
          }, 7000);



          //console.log(response)
          this.lista_estudiantes = response;
        }).catch(error => {
          this.dialogo_proceso_busqueda = false;
          this.msgs.push(
            { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros.' });
          this.showMessages = true;

        });


      /*
            this.catalogoServiceTempEstudiantesSigesV2.getAStudentByCodv1(this.valor01,this.selectedYear)
            .then(response => {
              console.log(response)
              this.lista_estudiantes=response;
            }).catch(error => {
              console.log("Error al obtener las empresas: " + error)
            });
      */


    }





  }

/*v1 generando el pdf que em envia el backend
  buscarEstudiantesTitulos() {
    this.lista_estudiantes = [];
    //console.log("Estoy en 03");
    if (this.estado_opcion_seleccionado_titulos === '1') {
      //console.log("Estoy en 04");
      //this.dialogo_proceso_busqueda = true;



      this.catalogoServiceTempEstudiantesSigesV2.getAStudentByNievParaTitulos(this.valor01_titulos)
        .then(response => {
          this.showMessages = false;

          setTimeout(() => {
            this.ocultarMensajes();
            this.dialogo_proceso_busqueda = false;
          }, 7000);
          this.imprimirTitulo02(parseInt(this.valor01_titulos));


          //console.log(response)
          this.lista_estudiantes.push(response);
        }).catch(error => {
          //this.dialogo_proceso_busqueda = false;
          this.msgs.push(
            { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros.' });
          this.showMessages = true;

        });



    }

  }

  */

  buscarEstudiantesTitulosV2() {
    this.lista_estudiantes = [];
    //console.log("Estoy en 03");
    if (this.estado_opcion_seleccionado_titulos === '1') {
      //console.log("Estoy en 04");
      //this.dialogo_proceso_busqueda = true;
      this.catalogoServiceTempEstudiantesSigesV2.getAStudentByNievParaTitulos(this.valor01_titulos)
        .then(response => {
          this.showMessages = false;

          //////setTimeout(() => {
          //////  this.ocultarMensajes();
          //////  this.dialogo_proceso_busqueda = false;
          //////}, 7000);
          this.imprimirTituloV2(parseInt(this.valor01_titulos));
          //console.log(response)
          this.lista_estudiantes.push(response);
        }).catch(error => {
          //this.dialogo_proceso_busqueda = false;
          this.msgs.push(
            { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros.' });
          this.showMessages = true;

        });

    }

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

  /*v2 generando el pdf que em envia el backend
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
  //v3-- generando el pdf que em envia el backend
  imprimirFicha(per_nie: number, ale_anio: number): void {
    this.dialogo_proceso_busqueda = true;
    this.catalogoServiceTempEstudiantesSigesV2
      .imprimirFicha(per_nie, ale_anio, this.usuario, this.estado_firmante, this.dui_usuario)
      .then(blob => {
        if (blob.size === 911 || blob.size === 899) {
          this.msgs.push(
            //{ severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
            //{ severity: 'success', summary: 'Success Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
            { severity: 'warn', summary: 'Warning Message', detail: 'El PDF está en blanco. No se ha generado ningún registro, favor realizar el cálculo de promoción en el SIGES' });
          this.showMessages = true;
          this.dialogo_proceso_busqueda = false;
          return;

        } else {
          //console.log("El valor del pdf 02 es: "+blob.size);
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
        //console.log("Error al obtener el archivo PDF: " + error);
        this.dialogo_proceso_busqueda = false;
      });
  }
*/

imprimirFicha(per_nie: number, ale_anio: number): void {
  this.dialogo_proceso_busqueda = true;
  this.catalogoServiceTempEstudiantesSigesV2
    .imprimirFicha(per_nie, ale_anio, this.usuario, this.estado_firmante, this.dui_usuario)
    .then(blob => {
      if (blob.size === 911 || blob.size === 899) {
        this.msgs.push(
          //{ severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
          //{ severity: 'success', summary: 'Success Message', detail: 'No se encontraron registros, favor contacta a registro académico al teléfono: 2592-3108.' });
          { severity: 'warn', summary: 'Warning Message', detail: 'El PDF está en blanco. No se ha generado ningún registro, favor realizar el cálculo de promoción en el SIGES' });
        this.showMessages = true;
        this.dialogo_proceso_busqueda = false;
        return;

      } else {
        //console.log("El valor del pdf 02 es: "+blob.size);
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
      //console.log("Error al obtener el archivo PDF: " + error);
      this.dialogo_proceso_busqueda = false;
    });
}


imprimirFichaParvularia(per_nie: number, ale_anio: number): void {
  this.dialogo_proceso_busqueda = true;
  this.catalogoServiceTempEstudiantesSigesV2
    .imprimirFichaParvularia(per_nie, ale_anio, this.usuario, this.estado_firmante, this.dui_usuario)
    .then(resp => {
      // Crear una URL para el blob y generar un enlace de descarga

      this.lista_certificacion_parvularia = resp;
      console.log(this.lista_certificacion_parvularia);
      this.dialogo_proceso_busqueda = false;

      this.generarPdfCertificacionParvularia(this.lista_certificacion_parvularia);




    })
    .catch(error => {
      console.log("Error al obtener el archivo PDF: " + error);
      this.dialogo_proceso_busqueda = false;
    });
}




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

/*generando el pdf que em envia el backend
  imprimirTitulo02(per_nie: number): void {
    this.dialogo_proceso_busqueda = true;
    this.catalogoServiceTempEstudiantesSigesV2
      .imprimirTitulo(per_nie, this.usuario, this.estado_firmante, this.dui_usuario)
      .then(blob => {
        // Crear una URL para el blob y generar un enlace de descarga
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'certificacion_de_titulo' + per_nie + '.pdf'; // Nombre del archivo de descarga
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

  imprimirTituloV2(per_nie: number): void {
    this.dialogo_proceso_busqueda = true;
    this.catalogoServiceTempEstudiantesSigesV2
      .certificacionDeTitulo(per_nie, this.usuario, this.estado_firmante, this.dui_usuario)
      .then(resp => {
        // Crear una URL para el blob y generar un enlace de descarga

        this.lista_certificacion_titulos = resp;
        //console.log(this.lista_certificacion_titulos);
        this.dialogo_proceso_busqueda = false;

        this.generarPdfTitulos(this.lista_certificacion_titulos);




      })
      .catch(error => {
        console.log("Error al obtener el archivo PDF: " + error);
        this.dialogo_proceso_busqueda = false;
      });
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


  public imprimirFicha01(valor: Sgp_tempEstudiantes) {

    this.valor01 = valor.per_nie.toString();

    this.imprimirFicha(parseInt(this.valor01), parseInt(this.selectedYear));

  }

/*
//v1
  public imprimirTitulo01(valor: Sgp_tempEstudiantes) {

    this.valor01_titulos = valor.per_nie.toString();

    this.imprimirTitulo02(parseInt(this.valor01_titulos));

  }
  */

  public imprimirTitulo01(valor: Sgp_tempEstudiantes) {

    this.valor01_titulos = valor.per_nie.toString();

    this.imprimirTituloV2(parseInt(this.valor01_titulos));

  }


  public confirmarEliminacionEstudiante() {

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


  /*
  /////////////////////////////////////////////////////////////////
  //De ejemplo funcional
  /////////////////////////////////////////////////////////////////
    generarPdf(lista_certificacion_titulos: any[]) {
  
      pdfMake!.vfs = pdfFonts.pdfMake.vfs;
  
  
      const docDefinition = {
        content: [
          { text: 'Hello, World!', style: 'header' },
          'This is an example PDF document generated with pdfMake.',
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          },
        },
      };
  
      pdfMake.createPdf(docDefinition).open();
  
    }

    //V2

generarPdf(lista_certificacion_titulos: any[]) {

    pdfMake!.vfs = pdfFonts.pdfMake.vfs;


    const pdfDefinition: any = {
      content: [
        { text: 'DIRECCIÓN GENERAL DE NIVELES Y MODALIDADES EDUCATIVAS', style: 'header' },
        { text: 'GERENCIA DE ACREDITACIÓN INSTITUCIONAL', style: 'header' },
        { text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO', style: 'header' },
        {
          image: 'assets/logo_mined.png', // Ruta de la imagen
          width: 200, // Ancho de la imagen en puntos
        },
      ],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          alignment: 'right'
        }
      },
      



    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();//Para abrir en otra pestaña.
    //pdf.download();//Para descargar.


  }

  //Me genera la tabla con border

generarPdf(lista_certificacion_titulos: any[]) {
    pdfMake!.vfs = pdfFonts.pdfMake.vfs;

    // Obtén la ruta relativa a la imagen en la carpeta "assets"
    const imagePath = 'assets/logo_mined.png';

    // Convierte la imagen en base64
    const base64data = fetch(imagePath)
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
    base64data.then((base64) => {
      const pdfDefinition: any = {
        content: [
          { text: 'DIRECCIÓN GENERAL DE NIVELES Y MODALIDADES EDUCATIVAS', style: 'header' },
          { text: 'GERENCIA DE ACREDITACIÓN INSTITUCIONAL', style: 'header' },
          { text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO', style: 'header' },
          {
            image: base64, // Imagen en formato base64
            width: 100, // Ancho de la imagen en puntos
            alignment: 'left', // Alinea la imagen a la izquierda
            margin: [0, -50, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
          },
          {
            text: '\n\nLa Infrascrita Gerente de Acreditación Institucional de la Dirección General de Niveles y Modalidades Educativas del Ministerio de Educación, Ciencia y Tecnología, de la República de El Salvador, CERTIFICA:\n\n',
            style: 'subheader'
          },

          {
            table: {
              widths: ['50%', '50%'], // Ancho de las columnas al 50%
              headerRows: 1,
              body: [
               // /*
                // Fila de encabezado
               // [
                 /// { text: 'Columna 1', style: 'tableHeader' },
                ///  { text: 'Columna 2', style: 'tableHeader' },
               /// ],
                // Filas de datos
                ...lista_certificacion_titulos.map((certificacion) => [
                  certificacion[7], // Valor de la columna 1 desde tu lista
                  certificacion[1], // Valor de la columna 2 desde tu lista
                  // Continúa aquí con los valores de las demás columnas
                ]),
              ],
              layout: 'noBorders', // Quita los bordes
            },
           
          },

        ],
        styles: {
          header: {
            fontSize: 10,
            bold: true,
            alignment: 'right'
          },
          subheader: {
            fontSize: 10,
            bold: true,
            alignment: 'justify'
          },
        },

      };

      const pdf = pdfMake.createPdf(pdfDefinition);
      pdf.open(); // Para abrir en otra pestaña.
      // pdf.download(); // Para descargar.
    });
  }
  
//Estable

generarPdf(lista_certificacion_titulos: any[]) {
    pdfMake!.vfs = pdfFonts.pdfMake.vfs;
  
    // Obtén la ruta relativa a la imagen en la carpeta "assets"
    const imagePath = 'assets/logo_mined.png';
  
    // Convierte la imagen en base64
    const base64data = fetch(imagePath)
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
    base64data.then((base64) => {
      const pdfDefinition: any = {
        content: [
          { text: 'DIRECCIÓN GENERAL DE NIVELES Y MODALIDADES EDUCATIVAS', style: 'header' },
          { text: 'GERENCIA DE ACREDITACIÓN INSTITUCIONAL', style: 'header' },
          { text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO', style: 'header' },
          {
            image: base64, // Imagen en formato base64
            width: 100, // Ancho de la imagen en puntos
            alignment: 'left', // Alinea la imagen a la izquierda
            margin: [0, -50, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
          },
          {
            text: '\n\nLa Infrascrita Gerente de Acreditación Institucional de la Dirección General de Niveles y Modalidades Educativas del Ministerio de Educación, Ciencia y Tecnología, de la República de El Salvador, CERTIFICA:\n\n\n\n',
            style: 'subheader'
          },
  
          {
            table: {
              widths: ['50%', '50%'], // Ancho de las columnas al 50%
              headerRows: 1,
              body: [
                // fila 01
                [
                  { text: 'Que:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][1], border: [false, false, false, false] }, // Valor de la columna 2 desde tu lista, sin bordes
                ],
                // fila 02
                [
                  { text: 'Realizó estudios de:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][9], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                 //  fila 03
                 [
                  { text: 'En el año:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][2], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                 // fila 04
                 [
                  { text: 'En el Centro Educativo:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][4], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                 // fila 05
                 [
                  { text: 'Municipio de:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][6], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                 // fila 06
                 [
                  { text: 'Departamento:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][5], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                 // fila 07
                 [
                  { text: 'Número de Registro:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][7], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                 // fila 08
                 [
                  { text: 'Fecha de validez\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][8], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // Filas de datos restantes
                lista_certificacion_titulos.slice(1).map((certificacion) => [
                  { text: certificacion[1], border: [false, false, false, false] }, // Valor de la columna 2 desde tu lista, sin bordes
                  { text: certificacion[7], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                  // Continúa aquí con los valores de las demás columnas
                ]),
              ],
            },
          },
  
        ],
        styles: {
          header: {
            fontSize: 10,
            bold: true,
            alignment: 'right'
          },
          subheader: {
            fontSize: 10,
            bold: true,
            alignment: 'justify'
          },
        },
  
      };
  
      const pdf = pdfMake.createPdf(pdfDefinition);
      pdf.open(); // Para abrir en otra pestaña.
      // pdf.download(); // Para descargar.
    });
  }


  //Estable, continuacion del codigo anterior.
generarPdf(lista_certificacion_titulos: any[]) {
    pdfMake!.vfs = pdfFonts.pdfMake.vfs;

    // Obtén la ruta relativa a la imagen en la carpeta "assets"
    const imagePath = 'assets/logo_mined.png';

    // Convierte la imagen en base64
    const base64data = fetch(imagePath)
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
    base64data.then((base64) => {
      const pdfDefinition: any = {
        content: [
          { text: 'DIRECCIÓN GENERAL DE NIVELES Y MODALIDADES EDUCATIVAS', style: 'header' },
          { text: 'GERENCIA DE ACREDITACIÓN INSTITUCIONAL', style: 'header' },
          { text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO', style: 'header' },
          {
            image: base64, // Imagen en formato base64
            width: 100, // Ancho de la imagen en puntos
            alignment: 'left', // Alinea la imagen a la izquierda
            margin: [0, -50, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
          },
          {
            text: '\n\nLa Infrascrita Gerente de Acreditación Institucional de la Dirección General de Niveles y Modalidades Educativas del Ministerio de Educación, Ciencia y Tecnología, de la República de El Salvador, CERTIFICA:\n\n\n\n',
            style: 'subheader'
          },

          {
            table: {
              widths: ['50%', '50%'], // Ancho de las columnas al 50%
              headerRows: 1,
              body: [
                // fila 01
                [
                  { text: 'Que:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][1], border: [false, false, false, false] }, // Valor de la columna 2 desde tu lista, sin bordes
                ],
                // fila 02
                [
                  { text: 'Realizó estudios de:\n\n', border: [false, false, false, false] },
                  {
                    text: lista_certificacion_titulos[0][9].length > 46
                      ? lista_certificacion_titulos[0][9] + '\n\n'
                      : lista_certificacion_titulos[0][9],
                    border: [false, false, false, false],
                  },
                ],
                //  fila 03
                [
                  { text: 'En el año:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][2], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 04
                [
                  { text: 'En el Centro Educativo:\n\n', border: [false, false, false, false] },
                  {
                    text: lista_certificacion_titulos[0][4].length > 46
                      ? lista_certificacion_titulos[0][4] + '\n\n'
                      : lista_certificacion_titulos[0][4],
                    border: [false, false, false, false],
                  },
                ],
                // fila 05
                [
                  { text: 'Municipio de:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][6], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 06
                [
                  { text: 'Departamento:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][5], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 07
                [
                  { text: 'Número de Registro:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][7], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 08
                [
                  { text: 'Fecha de validez\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: this.formatearFecha(lista_certificacion_titulos[0][8]), border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, formateado y sin bordes
                ],

              ],
            },
          },

        ],
        styles: {
          header: {
            fontSize: 10,
            bold: true,
            alignment: 'right'
          },
          subheader: {
            fontSize: 10,
            bold: true,
            alignment: 'justify'
          },
          textWithBreak: {
            noWrap: false, // Evitar la división automática del texto
            pageBreak: 'auto' // Permitir salto de página automático
          }
        },

      };

      const pdf = pdfMake.createPdf(pdfDefinition);
      pdf.open(); // Para abrir en otra pestaña.
      // pdf.download(); // Para descargar.
    });
  }


  // Función de formateo de fecha personalizada
  formatearFecha(fecha: string): string {
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
  

  ////////////////////////////////////////////////////////////////v1  continuacion

  generarPdf(lista_certificacion_titulos: any[]) {
    pdfMake!.vfs = pdfFonts.pdfMake.vfs;

    const imagePath1 = 'assets/logo_mined.png';
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
      base64data2.then((base64_2) => {
      const pdfDefinition: any = {
        content: [
          { text: 'DIRECCIÓN GENERAL DE NIVELES Y MODALIDADES EDUCATIVAS', style: 'header' },
          { text: 'GERENCIA DE ACREDITACIÓN INSTITUCIONAL', style: 'header' },
          { text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO', style: 'header' },
          {
            image: base64_1, // Imagen en formato base64
            width: 100, // Ancho de la imagen en puntos
            alignment: 'left', // Alinea la imagen a la izquierda
            margin: [0, -50, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
          },
          {
            text: '\n\nLa Infrascrita Gerente de Acreditación Institucional de la Dirección General de Niveles y Modalidades Educativas del Ministerio de Educación, Ciencia y Tecnología, de la República de El Salvador, CERTIFICA:\n\n\n\n',
            style: 'subheader'
          },

          {
            table: {
              widths: ['50%', '50%'], // Ancho de las columnas al 50%
              headerRows: 1,
              body: [
                // fila 01
                [
                  { text: 'Que:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][1], border: [false, false, false, false] }, // Valor de la columna 2 desde tu lista, sin bordes
                ],
                // fila 02
                [
                  { text: 'Realizó estudios de:\n\n', border: [false, false, false, false] },
                  {
                    text: lista_certificacion_titulos[0][9].length > 46
                      ? lista_certificacion_titulos[0][9] + '\n\n'
                      : lista_certificacion_titulos[0][9],
                    border: [false, false, false, false],
                  },
                ],
                //  fila 03
                [
                  { text: 'En el año:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][2], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 04
                [
                  { text: 'En el Centro Educativo:\n\n', border: [false, false, false, false] },
                  {
                    text: lista_certificacion_titulos[0][4].length > 46
                      ? lista_certificacion_titulos[0][4] + '\n\n'
                      : lista_certificacion_titulos[0][4],
                    border: [false, false, false, false],
                  },
                ],
                // fila 05
                [
                  { text: 'Municipio de:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][6], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 06
                [
                  { text: 'Departamento:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][5], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 07
                [
                  { text: 'Número de Registro:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][7], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 08
                [
                  { text: 'Fecha de validez\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  {
                    text: this.formatearFecha(lista_certificacion_titulos[0][8]),
                    border: [false, false, false, false], // Valor de la columna 1 desde tu lista, formateado y sin bordes
                    margin: [0, 0, 0, 40], // Establecer un margen inferior de 40 puntos (equivalente a 4 saltos de línea)
                  },
                ],



              ],
            },

          },
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    image: base64_2, // Imagen en formato base64
                    width: 130, // Ancho de la imagen en puntos
                    alignment: 'center', // Alinea la imagen al centro
                    margin: [0, 0, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
                [
                  {
                    text: 'LIC. YASMIN ELIZABETH VIRGINIA BRAN BARAHONA',
                    style: 'subheaderFirma',
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
                [
                  {
                    text: 'GERENTE DE ACREDITACIÓN INSTITUCIONAL\n\n\n\n',
                    style: 'subheaderFirma',
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    table: {
                      widths: ['*'],
                      body: [
                        [
                          {
                            text: [
                              { text: 'DOY FE', bold: true },
                              ' que la firma digital que calza la presente certificación de registro de título es AUTÉNTICA por corresponder a la registrada en este Ministerio por la ',
                              { text: 'GERENTE DE ACREDITACIÓN INSTITUCIONAL', bold: true },
                              '.\n\n'
                            ],
                            style: 'cuadroTexto',
                            alignment: 'justify',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: 'San Salvador, '+this.formatearFecha(this.getCurrentDate())+'.\n\n\n\n',
                            style: 'cuadroTexto',
                            alignment: 'left',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: 'LIC. ANTONIO JULIO CÉSAR SALAMANCA RIVERA',
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO',
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: 'Acuerdo No. 15-0183 del uno de febrero de 2023',
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                      ],
                    }
                  },
                ],
              ],
              
                    border: [true, true, true, true], // Bordes en las cuatro direcciones
            },
          },
          {
            text: [
              'Verificó y elaboró: ',
              { text: this.usuario, bold: true },
            ],
            fontSize: 8,
          },
                    
          
        ],
        styles: {
          header: {
            fontSize: 10,
            bold: true,
            alignment: 'right'
          },
          subheader: {
            fontSize: 10,
            bold: true,
            alignment: 'justify'
          },
          textWithBreak: {
            noWrap: false, // Evitar la división automática del texto
            pageBreak: 'auto' // Permitir salto de página automático
          },
          subheaderFirma: {
            fontSize: 10,
            bold: true,
            alignment: 'center'
          }
        },

        

      };

      const pdf = pdfMake.createPdf(pdfDefinition);
      pdf.open(); // Para abrir en otra pestaña.
      // pdf.download(); // Para descargar.
    
    });
    });
  }


  // Función de formateo de fecha personalizada
  formatearFecha(fecha: string): string {
    console.log(fecha);
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
  
  */

 generarPdfTitulos(lista_certificacion_titulos: any[]) {
  pdfMake!.vfs = pdfFonts.pdfMake.vfs;

  const imagePath1 = 'assets/logo_mined.png';
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
    base64data2.then((base64_2) => {
      const pdfDefinition: any = {
        content: [
          { text: 'DIRECCIÓN GENERAL DE NIVELES Y MODALIDADES EDUCATIVAS', style: 'header' },
          { text: 'GERENCIA DE ACREDITACIÓN INSTITUCIONAL', style: 'header' },
          { text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO\n\n', style: 'header' },
          {
            image: base64_1, // Imagen en formato base64
            width: 100, // Ancho de la imagen en puntos
            alignment: 'left', // Alinea la imagen a la izquierda
            margin: [0, -50, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
          },
          {
            text: '\n\n\nLa Infrascrita Gerente de Acreditación Institucional de la Dirección General de Niveles y Modalidades Educativas del Ministerio de Educación, Ciencia y Tecnología, de la República de El Salvador, CERTIFICA:\n\n\n\n',
            style: 'subheader'
          },

          {
            table: {
              widths: ['50%', '50%'], // Ancho de las columnas al 50%
              headerRows: 1,
              body: [
                // fila 01
                [
                  { text: 'Que:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][1], border: [false, false, false, false],fontSize: 10, }, // Valor de la columna 2 desde tu lista, sin bordes
                ],
                // fila 02
                [
                  { text: 'Realizó estudios de:\n\n', border: [false, false, false, false] },
                  {
                    text: lista_certificacion_titulos[0][9].length > 46
                      ? lista_certificacion_titulos[0][9] + '\n\n'
                      : lista_certificacion_titulos[0][9],
                    border: [false, false, false, false],fontSize: 10
                  },
                ],
                //  fila 03
                [
                  { text: 'En el año:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][2], border: [false, false, false, false],fontSize: 10 }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 04
                [
                  { text: 'En el Centro Educativo:\n\n', border: [false, false, false, false] },
                  {
                    text: lista_certificacion_titulos[0][4].length > 46
                      ? lista_certificacion_titulos[0][4] + '\n\n'
                      : lista_certificacion_titulos[0][4],
                    border: [false, false, false, false],fontSize: 10
                  },
                ],
                // fila 05
                [
                  { text: 'Municipio de:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][6], border: [false, false, false, false],fontSize: 10 }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 06
                [
                  { text: 'Departamento:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][5], border: [false, false, false, false],fontSize: 10 }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 07
                [
                  { text: 'Número de Registro:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][7], border: [false, false, false, false],fontSize: 10 }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 08
                [
                  { text: 'Fecha de validez\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  {
                    text: this.formatearFecha(lista_certificacion_titulos[0][8]),
                    border: [false, false, false, false], // Valor de la columna 1 desde tu lista, formateado y sin bordes
                    margin: [0, 0, 0, 40],fontSize: 10 // Establecer un margen inferior de 40 puntos (equivalente a 4 saltos de línea)
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    image: base64_2, // Imagen en formato base64
                    width: 130, // Ancho de la imagen en puntos
                    alignment: 'center', // Alinea la imagen al centro
                    margin: [0, 0, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
                [
                  {
                    text: 'LIC. YASMIN ELIZABETH VIRGINIA BRAN BARAHONA',
                    style: 'subheaderFirma',
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
                [
                  {
                    text: 'GERENTE DE ACREDITACIÓN INSTITUCIONAL\n\n\n\n',
                    style: 'subheaderFirma',
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    table: {
                      widths: ['*'],
                      body: [
                        [
                          {
                            text: [
                              { text: 'DOY FE', bold: true },
                              ' que la firma digital que calza la presente certificación de registro de título es AUTÉNTICA por corresponder a la registrada en este Ministerio por la ',
                              { text: 'GERENTE DE ACREDITACIÓN INSTITUCIONAL', bold: true },
                              '.\n\n'
                            ],
                            style: 'cuadroTexto',
                            alignment: 'justify',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: 'San Salvador, ' + this.formatearFecha(this.getCurrentDate()) + '.\n\n\n\n',
                            style: 'cuadroTexto',
                            alignment: 'left',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: this.estado_firmante, bold: true ,
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                            margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
                          },
                        ],
                        [
                          {
                            text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO',
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                            margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
                          },
                        ],
                        [
                          {
                            text: 'Acuerdo No. 15-0183 del uno de febrero de 2023',
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                            margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
                          },
                        ],
                      ],
                    },
                  },
                ],
              ],
              border: [true, true, true, true], // Bordes en las cuatro direcciones
            },
          },
          {
            text: [
              'Verificó y elaboró: ',
              { text: this.usuario, bold: true },
            ],
            fontSize: 8,
          },
        ],
        styles: {
          header: {
            fontSize: 10,
            bold: true,
            alignment: 'right',
          },
          subheader: {
            fontSize: 10,
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
      // pdf.download(); // Para descargar.
    });
  });
}



generarPdfCertificacionNotas(lista_certificacion_titulos: any[]) {
  pdfMake!.vfs = pdfFonts.pdfMake.vfs;

  const imagePath1 = 'assets/logo_mined.png';
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
    base64data2.then((base64_2) => {
      const pdfDefinition: any = {
        content: [
          { text: 'MINISTERIO DE EDUCACIÓN, CIENCIA Y TECNOLOGÍA', style: 'header' },
          { text: 'DIRECCIÓN GENERAL DE NIVELES Y MODALIDADES EDUCATIVAS', style: 'header' },
          { text: 'GERENCIA DE ACREDITACIÓN INSTITUCIONAL', style: 'header' },
          { text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO', style: 'header' },
          {
            image: base64_1, // Imagen en formato base64
            width: 100, // Ancho de la imagen en puntos
            alignment: 'left', // Alinea la imagen a la izquierda
            margin: [0, -50, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
          },
          {
            text: '\n\nLa Infrascrita Gerente de Acreditación Institucional de la Dirección General de Niveles y Modalidades Educativas del Ministerio de Educación, Ciencia y Tecnología, de la República de El Salvador, CERTIFICA:\n\n\n\n',
            style: 'subheader'
          },

          {
            table: {
              widths: ['50%', '50%'], // Ancho de las columnas al 50%
              headerRows: 1,
              body: [
                // fila 01
                [
                  { text: 'Que:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][1], border: [false, false, false, false] }, // Valor de la columna 2 desde tu lista, sin bordes
                ],
                // fila 02
                [
                  { text: 'Realizó estudios de:\n\n', border: [false, false, false, false] },
                  {
                    text: lista_certificacion_titulos[0][9].length > 46
                      ? lista_certificacion_titulos[0][9] + '\n\n'
                      : lista_certificacion_titulos[0][9],
                    border: [false, false, false, false],
                  },
                ],
                //  fila 03
                [
                  { text: 'En el año:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][2], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 04
                [
                  { text: 'En el Centro Educativo:\n\n', border: [false, false, false, false] },
                  {
                    text: lista_certificacion_titulos[0][4].length > 46
                      ? lista_certificacion_titulos[0][4] + '\n\n'
                      : lista_certificacion_titulos[0][4],
                    border: [false, false, false, false],
                  },
                ],
                // fila 05
                [
                  { text: 'Municipio de:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][6], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 06
                [
                  { text: 'Departamento:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][5], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 07
                [
                  { text: 'Número de Registro:\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  { text: lista_certificacion_titulos[0][7], border: [false, false, false, false] }, // Valor de la columna 1 desde tu lista, sin bordes
                ],
                // fila 08
                [
                  { text: 'Fecha de validez\n\n', border: [false, false, false, false] }, // Texto personalizado sin bordes
                  {
                    text: this.formatearFecha(lista_certificacion_titulos[0][8]),
                    border: [false, false, false, false], // Valor de la columna 1 desde tu lista, formateado y sin bordes
                    margin: [0, 0, 0, 40], // Establecer un margen inferior de 40 puntos (equivalente a 4 saltos de línea)
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    image: base64_2, // Imagen en formato base64
                    width: 130, // Ancho de la imagen en puntos
                    alignment: 'center', // Alinea la imagen al centro
                    margin: [0, 0, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
                [
                  {
                    text: 'LIC. YASMIN ELIZABETH VIRGINIA BRAN BARAHONA',
                    style: 'subheaderFirma',
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
                [
                  {
                    text: 'GERENTE DE ACREDITACIÓN INSTITUCIONAL\n\n\n\n',
                    style: 'subheaderFirma',
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    table: {
                      widths: ['*'],
                      body: [
                        [
                          {
                            text: [
                              { text: 'DOY FE', bold: true },
                              ' que la firma digital que calza la presente certificación de registro de título es AUTÉNTICA por corresponder a la registrada en este Ministerio por la ',
                              { text: 'GERENTE DE ACREDITACIÓN INSTITUCIONAL', bold: true },
                              '.\n\n'
                            ],
                            style: 'cuadroTexto',
                            alignment: 'justify',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: 'San Salvador, ' + this.formatearFecha(this.getCurrentDate()) + '.\n\n\n\n',
                            style: 'cuadroTexto',
                            alignment: 'left',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: 'LIC. ANTONIO JULIO CÉSAR SALAMANCA RIVERA', bold: true ,
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                            margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
                          },
                        ],
                        [
                          {
                            text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO',
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                            margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
                          },
                        ],
                        [
                          {
                            text: 'Acuerdo No. 15-0183 del uno de febrero de 2023',
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                            margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
                          },
                        ],
                      ],
                    },
                  },
                ],
              ],
              border: [true, true, true, true], // Bordes en las cuatro direcciones
            },
          },
          {
            text: [
              'Verificó y elaboró: ',
              { text: this.usuario, bold: true },
            ],
            fontSize: 8,
          },
        ],
        styles: {
          header: {
            fontSize: 11,
            bold: true,
            alignment: 'right',
          },
          subheader: {
            fontSize: 10,
            bold: true,
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
      // pdf.download(); // Para descargar.
    });
  });
}




generarPdfCertificacionParvularia(lista_certificacion_parvularia: any[]) {
  pdfMake!.vfs = pdfFonts.pdfMake.vfs;

  const imagePath1 = 'assets/logo_mined.png';
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
    base64data2.then((base64_2) => {

      const tableData: { text: string; style: string; colSpan?: number }[][] = [
        // Encabezado de la tabla
        [
          { text: 'N°', style: 'tablaHeader' },
          { text: 'Componente plan estudio', style: 'tablaHeader' },
          { text: 'Concepto', style: 'tablaHeader' },
        ],
      ];
      
    // ...
// Inicializa una variable para realizar el seguimiento del valor de item[16]
let previousValue = '';
type GroupedItem = {
  header: string; // Tipo del encabezado (puede ajustarse según tus datos reales)
  items: any[];   // Tipo de la lista de elementos (ajústalo según tus datos reales)
};

// Inicializa la variable groupedItems con el tipo definido
let groupedItems: GroupedItem[] = [];

// Agrupar elementos con el mismo valor en item[16]
lista_certificacion_parvularia.forEach((item) => {
  if (item[16] !== previousValue) {
    // Crear un nuevo grupo
    const group = {
      header: item[17], // Valor del ítem 16 para el encabezado
      items: [item],   // Agregar el primer elemento al grupo
    };
    groupedItems.push(group);
    previousValue = item[16];
  } else {
    // Agregar elementos relacionados al grupo actual
    groupedItems[groupedItems.length - 1].items.push(item);
  }
});

// Ahora puedes usar groupedItems para crear la tabla
groupedItems.forEach((group) => {
  const rowData = [
    {
      text: group.header,
      style: 'tablaDeResultadoTexto',
      fillColor: '#000000',
      color: '#FFFFFF',
      bold: true,
      fontSize: 7,
      colSpan: 3,
    },
  ];
  tableData.push(rowData);

  // Agregar elementos relacionados debajo del encabezado
  group.items.forEach((item) => {
    const rowData = [
      { text: item[0], style: 'tablaDeResultadoTexto' }, // Columna 1
      { text: item[24]+'- '+item[18], style: 'tablaDeResultadoTexto' }, // Columna 2
      { text: item[22], style: 'tablaDeResultadoTexto',alignment: 'center' }, // Columna 3 
    ];
    tableData.push(rowData);
  });
});


      const pdfDefinition: any = {
        content: [
          { text: 'DIRECCIÓN GENERAL DE NIVELES Y MODALIDADES EDUCATIVAS', style: 'header' },
          { text: 'GERENCIA DE ACREDITACIÓN INSTITUCIONAL', style: 'header' },
          { text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO', style: 'header' },
          {
            image: base64_1, // Imagen en formato base64
            width: 100, // Ancho de la imagen en puntos
            alignment: 'left', // Alinea la imagen a la izquierda
            margin: [0, -50, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
          },
          {
            text: '\n\n\nLa Infrascrita Gerente de Acreditación Institucional de la Dirección General de Niveles y Modalidades Educativas del Ministerio de Educación, Ciencia y Tecnología, de la República de El Salvador, CERTIFICA:',
            style: 'subheader'
          },
          {
            text: [
              '\n\nQue ',
              { text: lista_certificacion_parvularia[0][14], bold: true },
              ' con número de NIE ',
              { text: lista_certificacion_parvularia[0][13], bold: true },
              ',  cursó durante el año ',
              { text: lista_certificacion_parvularia[0][1], bold: true },
              ', ',
              { text: lista_certificacion_parvularia[0][7], bold: true },
              ', en ',
              { text: lista_certificacion_parvularia[0][3], bold: true },
              ', con código de infraestructura ',
              { text: lista_certificacion_parvularia[0][2], bold: true },
              ',  del municipio de ',
              { text: lista_certificacion_parvularia[0][6], bold: true },
              ',  departamento de ',
              { text: lista_certificacion_parvularia[0][5], bold: true },
              ',  y obtuvo las calificaciones siguientes:\n\n\n',
              
            ],
            style: 'subheader'
          },
          {
            text: 'S = si lo hace, P = lo hace con ayuda o está en proceso, T = todavía no lo hace',
            style: 'subheader', alignment: 'center',
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '85%', '13%'], // Ancho de las columnas
              body: tableData,
            },
          },
          {
            text: '\n', // Agrega un salto de línea después de la tabla
          },
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    image: base64_2, // Imagen en formato base64
                    width: 130, // Ancho de la imagen en puntos
                    alignment: 'center', // Alinea la imagen al centro
                    margin: [0, 0, 0, 0], // Margen [arriba, derecha, abajo, izquierda]
                    border: [false, false, false, false], // Elimina los bordes de la celda
                    pageBreak: lista_certificacion_parvularia.length > 75 ? 'after' : (lista_certificacion_parvularia.length > 45 ? 'before' : undefined),style: 'subheaderParrafo'


                  },
                ],
                [
                  {
                    text: 'LIC. YASMIN ELIZABETH VIRGINIA BRAN BARAHONA',
                    style: 'subheaderFirma',
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
                [
                  {
                    text: 'GERENTE DE ACREDITACIÓN INSTITUCIONAL\n\n\n\n',
                    style: 'subheaderFirma',
                    border: [false, false, false, false], // Elimina los bordes de la celda
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    table: {
                      widths: ['*'],
                      body: [
                        [
                          {
                            text: [
                              { text: 'DOY FE', bold: true },
                              ' que la firma digital que calza la presente certificación de registro de notas es AUTÉNTICA por corresponder a la registrada en este Ministerio por la ',
                              { text: 'GERENTE DE ACREDITACIÓN INSTITUCIONAL', bold: true },
                              '.\n\n'
                            ],
                            style: 'cuadroTexto',
                            alignment: 'justify',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: 'San Salvador, ' + this.formatearFecha(this.getCurrentDate()) + '.\n\n\n\n',
                            style: 'cuadroTexto',
                            alignment: 'left',
                            border: [false, false, false, false],
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: this.estado_firmante, bold: true ,
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                            margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
                          },
                        ],
                        [
                          {
                            text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO',
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                            margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
                          },
                        ],
                        [
                          {
                            text: 'Acuerdo No. 15-0183 del uno de febrero de 2023',
                            style: 'cuadroTexto',
                            alignment: 'center',
                            border: [false, false, false, false],
                            fontSize: 10,
                            margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
                          },
                        ],
                      ],
                    },
                  },
                ],
              ],
              border: [true, true, true, true], // Bordes en las cuatro direcciones
            },
          },
          {
            text: [
              'Verificó y elaboró: ',
              { text: this.usuario, bold: true },
            ],
            fontSize: 8,
          },
        ],
        styles: {
          header: {
            fontSize: 11,
            bold: true,
            alignment: 'right',
          },
          subheader: {
            fontSize: 10,
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
          tablaHeader: {
            fontSize: 9,
            bold: true,
            fillColor: '#DDDDDD', // Gris suave elegante
            color: '#000000', // Color de texto negro (negrito)
            alignment: 'center', // Centro de texto en celdas
            valign: 'middle', // Centro de texto vertical
          },
          tablaDeResultadoTexto:{
            fontSize: 9,

          }
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
      // pdf.download(); // Para descargar.
    });
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


}
