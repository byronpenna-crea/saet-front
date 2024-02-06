import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Sgp_tempEstudiantes } from 'src/app/models/sgp_temp_estudiantes';
import { CatalogoServiceTempEstudiantesSigesV2 } from 'src/app/services/catalogo/catalogo.service.temp_estudiantes_sigesv2';
import { SgSellosFirmas } from 'src/app/models/sg_sellos_firmas';
import { CatalogoServiceAutenticas } from 'src/app/services/catalogo/catalogo.service.autenticas';
import { style } from '@angular/animations';


@Component({
  selector: 'app-autentica',
  templateUrl: './autentica.component.html',
  styleUrls: ['./autentica.component.css']
})
export class AutenticaComponent {
  @ViewChild('myTable') myTable!: ElementRef;
  msgs: Message[] = [];
  showMessages = false;
  lista_opciones: any[] = [
    { label: 'Seleccione una opcion', value: '0' },
    { label: 'NIE', value: '1' },
    { label: 'NOMBRE DEL ESTUDIANTE', value: '2' },
    { label: 'CODIGO DEL C.E', value: '3' },

  ];
  lista_estudiantes: Sgp_tempEstudiantes[] = [];
  lista_autentica: any[] = [];
  estado_opcion_seleccionado: string = '';
  submitted!: boolean;
  valor01: string = '';
  selectedYear: string = ''; // Año seleccionado
  est!: Sgp_tempEstudiantes;
  sel_fir!: SgSellosFirmas;
  lista_sellos_firmas: SgSellosFirmas[] = [];
  usuario: string = '';
  dui_usuario = '';
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
  estado_firmante: string = 'LIC. ANTONIO JULIO CÉSAR SALAMANCA RIVERA';
  estado_tipo_documento: string = 'EL CERTIFICADO DE NOTAS';
  lista_firmantes: any[] = [
    { label: 'Seleccione un firmante', value: '0' },
    { label: 'LIC. ANTONIO JULIO CÉSAR SALAMANCA RIVERA', value: 'LIC. ANTONIO JULIO CÉSAR SALAMANCA RIVERA' },
    { label: 'ING. JOSÉ RODRIGO CRUZ HERNÁNDEZ', value: 'ING. JOSÉ RODRIGO CRUZ HERNÁNDEZ' },
    { label: 'ING. WILLIAM ALEXANDER COREAS RODRÍGUEZ', value: 'ING. WILLIAM ALEXANDER COREAS RODRÍGUEZ' },

  ];

  lista_tipo_documentos: any[] = [
    { label: 'Seleccione un tipo de documento', value: '0' },
    { label: 'EL CERTIFICADO DE NOTAS', value: 'EL CERTIFICADO DE NOTAS' },
    { label: 'EL INFORME DE RESULTADO PAES', value: 'EL INFORME DE RESULTADO PAES' },
    { label: 'EL INFORME DE RESULTADO AVANZO', value: 'EL INFORME DE RESULTADO AVANZO' },

  ];
  dialogo_proceso_busqueda!: boolean;
  //sfi_pk: number =0;
  selectedFirma: any; // Aquí almacenarás el objeto completo seleccionado
  sfi_pk?: number | null; // Aquí almacenarás el sfi_pk
  nombreCompleto?: string | null; // Aquí almacenarás el nombre completo
  estado!: boolean;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceTempEstudiantesSigesV2: CatalogoServiceTempEstudiantesSigesV2,
    private catalogoServiceAutenticas: CatalogoServiceAutenticas,
  ) {

    this.est = new Sgp_tempEstudiantes();
    this.sel_fir = new SgSellosFirmas();

  }

  ngOnInit(): void {
    const primer_nombre = localStorage.getItem('primer_nombre') || '';
    //console.log("Primer nombre es: "+primer_nombre);
    const primer_apellido = localStorage.getItem('primer_apellido') || '';
    this.dui_usuario = localStorage.getItem('dui') || '';
    //console.log("Primer apellido es: "+primer_apellido);
    this.usuario = primer_nombre[0] + primer_apellido;
  }



  buscarEstudiantesAutentica() {

    this.dialogo_proceso_busqueda = true;
    //console.log("Estoy en 02");
    this.catalogoServiceTempEstudiantesSigesV2.getMatriculaPorAnio(parseInt(this.valor01), this.usuario, this.estado_firmante, this.dui_usuario, parseInt(this.selectedYear))
      .then(response => {

        /////setTimeout(() => {
        /////this.ocultarMensajes();
        this.showMessages = false;
        this.dialogo_proceso_busqueda = false;
        /////}, 7000);
        console.log(response)
        this.lista_autentica = response;
      }).catch(error => {
        this.dialogo_proceso_busqueda = false;
        this.msgs.push(
          { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros.' });
        this.showMessages = true;

      });






  }


  public imprimirFicha01(valor: Sgp_tempEstudiantes) {


  }

  buscarEstudiantes() {
    //console.log("Estoy en 01");
    this.lista_estudiantes = [];

    if (this.estado_opcion_seleccionado === '1') {
      this.dialogo_proceso_busqueda = true;


      console.log("Estoy en 02", this.valor01, this.selectedYear);
      this.catalogoServiceTempEstudiantesSigesV2.getAStudentByNiev1(this.valor01, this.selectedYear)
        .then(response => {
          this.ocultarMensajes();
          this.showMessages = false;
          this.dialogo_proceso_busqueda = false;


          console.log(response)
          this.lista_estudiantes.push(response);
          this.sel_fir.sfi_sede_fk = response.sed_pk;
          console.log("El sed_pk es: " + this.sel_fir.sfi_sede_fk);



          this.catalogoServiceAutenticas.dirSubSelFir(this.sel_fir.sfi_sede_fk)
            .then(response => {
              this.ocultarMensajes();
              this.showMessages = false;
              this.dialogo_proceso_busqueda = false;
              console.log(response);
              this.lista_sellos_firmas = response;



              this.buscarEstudiantesAutentica();



            }).catch(error => {
              this.dialogo_proceso_busqueda = false;
              this.msgs.push(
                { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros.' });
              this.showMessages = true;

            });


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
          ////setTimeout(() => {
          this.ocultarMensajes();
          ////}, 7000);



          //console.log(response)
          this.lista_estudiantes = response;
        }).catch(error => {
          this.dialogo_proceso_busqueda = false;
          this.msgs.push(
            { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros.' });
          this.showMessages = true;

        });

    }


  }

  imprimirFicha(per_nie: number, ale_anio: number): void {

  }

  get tableHeight() {
    const height = window.innerHeight;
    return `${height - 280}px`;
  }

  ocultarMensajes() {
    this.showMessages = false;
    this.msgs = [];
  }





  generarPdfAutenticas() {
    console.log("Valor de la cadena:", this.lista_autentica[0][8]);
    console.log("El valor limpio es:"+(this.limpiarCadena(this.lista_autentica[0][8]).toUpperCase()));
    if (this.lista_autentica && this.lista_autentica.length > 0) {
    pdfMake!.vfs = pdfFonts.pdfMake.vfs;
    const imagePath1 = 'assets/logo_mined.png';
    const imagePath2 = 'assets/autenticas.png';

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
            // Marca de agua
          {
            image: base64_2,
            width: 300, // Ajusta el tamaño según sea necesario
            absolutePosition: { x: 150, y: 200 }, // Ajusta la posición para centrar la marca de agua
            opacity: 0.3, // Ajusta la transparencia
          },
            {
              text: '\n\n\n\n\n\nAUTÉNTICA',
              alignment: 'center',
              fontSize: 15,
              bold: true,
            },
            {
              text: '\n\n\n\n\nEL DEPARTAMENTO DE REGISTRO ACADÉMICO, DE LA GERENCIA DE ACREDITACIÓN INSTITUCIONAL, DE LA DIRECCIÓN GENERAL DE NIVELES Y MODALIDADES EDUCATIVAS, DEL MINISTERIO DE EDUCACIÓN, CIENCIA Y TECNOLOGÍA, CERTIFICA:\n\n\n\n\n\n',
              style: 'subheader'
            },
            {
              // text: 'QUE ' + this.estado_tipo_documento + ' DE ' + this.lista_autentica[0][6].toUpperCase()+(this.lista_autentica[0][8].toUpperCase() === "DE" ? "" : ", " + this.lista_autentica[0][8].toUpperCase()) + ", OBTENIDO EN EL AÑO " + this.lista_autentica[0][0] + ", POR " + this.lista_autentica[0][13] + ", EN " + this.lista_autentica[0][2] + ", "+"CONTIENE FIRMA AUTÉNTICA DE "+this.nombreCompleto+", SIENDO LA MISMA QUE SE ENCUENTRA DEBIDAMENTE REGISTRADA EN ESTE MINISTERIO, EN SU CALIDAD DE "+ (this.estado ? "DIRECTOR/A" : "EX DIRECTOR/A") + ".\n\n\n\n\n\n",
              //text: 'QUE ' + this.estado_tipo_documento +" "+ (this.limpiarCadena(this.lista_autentica[0][8]).toUpperCase() !== 'DE' ? 'DE' + this.lista_autentica[0][6].toUpperCase() + ', ' + this.lista_autentica[0][8].replace(/[\x00-\x1F\x7F-\x9F\u3164]/g, '').toUpperCase().trim() : '') + ', OBTENIDO EN EL AÑO ' + this.lista_autentica[0][0] + ', POR ' + this.lista_autentica[0][13] + ', EN ' + this.lista_autentica[0][2] + ', CONTIENE FIRMA AUTÉNTICA DE ' + this.nombreCompleto + ', SIENDO LA MISMA QUE SE ENCUENTRA DEBIDAMENTE REGISTRADA EN ESTE MINISTERIO, EN SU CALIDAD DE ' + (this.estado ? 'DIRECTOR/A' : 'EX DIRECTOR/A') + '.\n\n\n\n\n\n',
              text: this.formatText()+ '.\n\n\n\n\n\n',
              style: 'subheader'
            },
            {
              text: 'SAN SALVADOR, ' + this.formatearFecha(this.getCurrentDate()) + '.\n\n\n\n\n\n\n\n\n\n\n',
              style: 'cuadroTexto',
              alignment: 'left',
              border: [false, false, false, false],
              fontSize: 10,
            },
            {
              table: {
                widths: ['*'],
                body: [
                  [
                    {
                      text: this.estado_firmante,
                      style: 'subheaderFirma',
                      border: [false, false, false, false], // Elimina los bordes de la celda
                    },
                  ],
                  [
                    {
                      text: 'DEPARTAMENTO DE REGISTRO ACADÉMICO\n\n',
                      style: 'subheaderFirma',
                      border: [false, false, false, false], // Elimina los bordes de la celda
                    },
                  ],
                ],
              },
            },
            {
              text: '\nEL FUNCIONARIO DEL MINISTERIO DE EDUCACIÓN, CIENCIA Y TECNOLOGÍA',
              alignment: 'center',
              fontSize: 5,
              bold: true,
            },
            {
              text: '\nNO SE RESPONSABILIZA DEL CONTENIDO DEL',
              alignment: 'center',
              fontSize: 5,
              bold: true,
              margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
            },
            {
              text: '\nDOCUMENTO CUYA FIRMA SE AUTENTICA',
              alignment: 'center',
              fontSize: 5,
              bold: true,
              margin: [0, -5, 0, 0], // Establece un margen superior de -5 puntos para que suba
            },
            {
              text: [
                '\n\n\n\n\n\n\n\n\n\n\n\n\nVerificó y elaboró: ',
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


  } else {
    // Si 'this.lista_autentica' está vacío o no tiene registros
    this.msgs.push({ severity: 'warn', summary: 'Warning Message', detail: 'Estudiante no tiene proceso de promoción para el año seleccionado.' });
    
    this.showMessages = true;
  }



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

  onFirmaChange(firma: any) {
    if (firma) {
      this.sfi_pk = firma.sfi_pk;
      this.nombreCompleto = firma.sfi_persona_fk.nombre_completo;
      this.estado=firma.sfi_habilitado;
    } else {
      // Si se selecciona la opción de "clear", entonces limpiar las variables
      this.sfi_pk = null;
      this.nombreCompleto = null;
      this.estado;
    }

  }

  limpiarCadena(cadena:string) {
    // Usa una expresión regular para eliminar caracteres no imprimibles, incluyendo el espacio especial U+3164
    return cadena.replace(/[\x00-\x1F\x7F-\x9F\u3164]/g, '');
  }


    formatText() {
      const valor = this.limpiarCadena(this.lista_autentica[0][8]).toUpperCase();
      
      if (valor !== 'DE') {
        return 'QUE ' + this.estado_tipo_documento + ' DE ' + this.lista_autentica[0][6].toUpperCase() + ' DE ' + valor + ', OBTENIDO EN EL AÑO ' + this.lista_autentica[0][0] + ', POR ' + this.lista_autentica[0][13] + ', EN ' + this.lista_autentica[0][2] + ', CONTIENE FIRMA AUTÉNTICA DE ' + this.nombreCompleto + ', SIENDO LA MISMA QUE SE ENCUENTRA DEBIDAMENTE REGISTRADA EN ESTE MINISTERIO, EN SU CALIDAD DE ' + (this.estado ? 'DIRECTOR/A' : 'EX DIRECTOR/A');
      } else {
        return 'QUE ' + this.estado_tipo_documento + ' DE ' + this.lista_autentica[0][6].toUpperCase() + ', OBTENIDO EN EL AÑO ' + this.lista_autentica[0][0] + ', POR ' + this.lista_autentica[0][13] + ', EN ' + this.lista_autentica[0][2] + ', CONTIENE FIRMA AUTÉNTICA DE ' + this.nombreCompleto + ', SIENDO LA MISMA QUE SE ENCUENTRA DEBIDAMENTE REGISTRADA EN ESTE MINISTERIO, EN SU CALIDAD DE ' + (this.estado ? 'DIRECTOR/A' : 'EX DIRECTOR/A');
      }
    }
  
  

}
