import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {
  ButtonStyle,
  SaetButtonArgs,
} from '../../component/saet-button/saet-button.component';
import { TableColumn } from '../../component/saet-table/saet-table.component';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CatalogoServiceCor, IReferencaResponse,
  ResponseError,
  StudentDetail,
  StudentInfoResponse,
} from '../../../../../services/catalogo/catalogo.service.cor';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { userMessageInit } from '../../shared/messages.model';
import { CorBaseComponent } from '../../CorBaseComponent';
import { DOCUMENT } from '@angular/common';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { SAET_MODULE } from '../../shared/evaluaciones';
import {Promise} from "cypress/types/cy-bluebird";
import { CatalogoServiceDai } from '../../../../../services/catalogo/catalogo.service.dai';
interface IFlow {
  col1: string;
  col2: string;
  col3: string;
  href: string;
  disabledRow: boolean;
  enabled: boolean;
}
interface Estudiante {
  nie: string;
  primerNombre: string;
  primerApellido: string;
  fechaNacimiento: string;
  EstadoApoyo: string;
  verDetalle: string;
  Acciones: null;
}
interface flowTableInterface {
  responsable: string;
  estadoApoyo: string;
  verDetalle: string;
  referidoPor: string;
}

@Component({
  selector: 'app-buscar-estudiante',
  templateUrl: './buscar-estudiante.component.html',
  styleUrls: ['./buscar-estudiante.component.css'],
})
export class BuscarEstudianteComponent
  extends CorBaseComponent
  implements IMessageComponent, OnInit
{
  inputNIE = '';
  cnResult = 0;
  centroEducativo = '';
  atendidoCOR = false;
  atendidoDAI = false;
  breadcrumb = [{ href: '#/menu/saet-inicio', text: 'Inicio' }];
  onInputChange(keyValue: KeyValue) {
    this.inputNIE = keyValue.value;
  }

  override async ngOnInit() {
    super.ngOnInit();
  }

  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    protected catalogoServiceDai: CatalogoServiceDai,
    private cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    router: Router
  ) {
    super(document, catalogoServiceCOR, route, router);
    try {
      this.pageLoading = true;

      if (this.nie === '') {
        this.pageLoading = false;
        return;
      }
      this.catalogoServiceCOR
        .getStudentInfo(this.nie)
        .then(result => {
          this.cnResult = 1;
          this.studentData = this.populateStudent(result);
          this.centroEducativo = result.centroEducativo.nombre;
          this.showTable = true;
          this.inputNIE = result.estudiante.nie;
          console.log('rol apoyo ', localStorage.getItem('idRolApoyo'));
          this.toggleTable().then(() => {});
        })
        .catch(e => {
          const error = e as ResponseError;
          console.log('catch getStudentInfo', error.message);
          if (error.status === 401) {
            // redirect
          }
          this.userMessage = {
            showMessage: true,
            message:
              error.message !== ''
                ? error.message
                : 'No se pudo obtener el estudiante',
            type: MessageType.DANGER,
          };
        })
        .finally(() => {
          this.pageLoading = false;
        });
    } catch (e) {
      console.log('error en constructor', e);
    }
  }

  showTable = false;
  flowColumns: TableColumn<flowTableInterface>[] = [
    { key: 'responsable', header: 'Responsables' },
    { key: 'estadoApoyo', header: 'Estado de apoyo' },
    { key: 'referidoPor', header: 'Referido por' },
    { key: 'verDetalle', header: 'Ver detalle' },
  ];
  referenciaDai:IReferencaResponse | null = null;
  // @ts-ignore
  async buildFlowData(): Promise<IFlow[]> {
    try{
      const referencia = await this.catalogoServiceDai.getReferencia(this.nie);
      this.referenciaDai = referencia;
      console.log('Referencia para almuno -->', referencia);
    }catch (e){
      this.referenciaDai = null;
      console.log('Referencia no encontrada');
    }

    const enabledCor = localStorage.getItem('idRolApoyo') !== undefined &&
      (localStorage.getItem('idRolApoyo') as unknown as SAET_MODULE) ==
      SAET_MODULE.COR;
    const enabledDai =
      localStorage.getItem('idRolApoyo') !== undefined &&
      (localStorage.getItem('idRolApoyo') as unknown as SAET_MODULE) ==
      SAET_MODULE.DAI;
    const toReturn:IFlow[]  = [
      {
        col1: 'Centro de Orientación y Recursos (COR)',
        col2: this.atendidoCOR ? `Atendido` : 'Sin atención',
        col3: '',
        href: '/menu/saet-datos-estudiante',
        enabled: enabledCor,
        disabledRow: false
      },
      {
        col1: 'Docente de Apoyo a la Inclusión (DAI)',
        col2: this.atendidoDAI ? `Atendido` : 'Sin atención',
        col3: this.referenciaDai === null ? '': this.referenciaDai.referencia_pk.toString(),
        href: '/menu/dai/saet-datos-estudiante',
        enabled: enabledDai,
        disabledRow: false
      },
      {
        col1: 'Docente de Apoyo a la Inclusión Educativa',
        col2: 'Sin atención',
        col3: '',
        href: '/menu/dei/informe-cualitativo',
        disabledRow: true,
        enabled: false
      },
      {
        col1: 'Escuela de Educación Especial (EEE)',
        col2: 'Sin atención',
        col3: '',
        href: '',
        disabledRow: true,
        enabled: false
      },
      {
        col1: 'Comité Departamental de Apoyo a la Inclusión (CODAI)',
        col2: 'Sin atención',
        col3: '',
        href: '',
        disabledRow: true,
        enabled: false
      },
      {
        col1: 'Centro de Recursos de Inclusión Educativa (CRIEDV)',
        col2: 'Sin atención',
        col3: '',
        href: '',
        disabledRow: true,
        enabled: false
      },
    ];
    console.log('to return ', toReturn);
    return toReturn;
  }

  flowData: any[] = [];
  studentData: Estudiante[] = [
    {
      nie: '1234',
      EstadoApoyo: 'Indefinido',
      fechaNacimiento: '23/12/2010',
      primerNombre: 'Carlos',
      primerApellido: 'Mejia',
      verDetalle: 'Ver',
      Acciones: null,
    },
  ];
  getBase64Image(url: string): Promise<string> {
    // @ts-ignore
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(
            canvas
              .toDataURL('image/png')
              .replace(/^data:image\/(png|jpg);base64,/, '')
          );
        } else {
          reject('No se pudo obtener el contexto del canvas');
        }
      };
      img.onerror = err => reject(err);
    });
  }

  async goToReferencia(link: string) {
    if (!this.referenciaDai) return;

    this.pageLoading = true;

    let logoBase64 = '';
    try {
      logoBase64 = await this.getBase64Image('/assets/logo.png');
    } catch (err) {
      console.error('Error al cargar el logo:', err);
    }

    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

    const docDefinition: TDocumentDefinitions = {
      pageOrientation: 'landscape',
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 40],
      content: [] as Content[],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          fillColor: '#eeeeee',
        },
        cell: {
          margin: [0, 5, 0, 5],
        },
      },
    };

    if (logoBase64) {
      (docDefinition.content as Content[]).push({
        image: `data:image/png;base64,${logoBase64}`,
        width: 100,
        alignment: 'left',
        margin: [0, 0, 0, 10],
      });
    }

    (docDefinition.content as Content[]).push({
      text: 'REFERENCIA DEL DOCENTE DE APOYO A LA INCLUSIÓN',
      style: 'header',
    });

    (docDefinition.content as Content[]).push({
      table: {
        widths: ['30%', '70%'],
        body: [
          [{ text: 'Campo', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
          ['NIE', this.referenciaDai.nie.toString()],
          ['Docente de Apoyo', this.referenciaDai.id_docente_apoyo.toString()],
          ['Departamento', this.referenciaDai.departamento],
          ['Servicio de Apoyo', this.referenciaDai.servicio_apoyo],
          ['Personal de Ejecución', this.referenciaDai.personal_ejecucion],
          ['Referencia Externa', this.referenciaDai.referencia_externa || 'N/A'],
          ['Motivo de la Referencia', this.referenciaDai.motivo],
        ]
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex % 2 === 0 ? null : '#f5f5f5'),
        hLineColor: () => '#cccccc',
        vLineColor: () => '#cccccc',
      },
      margin: [0, 10, 0, 20],
    });

    (docDefinition.content as Content[]).push({
      text: 'Este documento contiene la información básica de la referencia emitida por el Docente de Apoyo a la Inclusión, con fines educativos y de seguimiento.',
      style: 'normal',
      alignment: 'justify',
      fontSize: 12,
    });

    //pdfMake.createPdf(docDefinition).download(`referencia-${this.referenciaDai.nie}.pdf`);
    pdfMake.createPdf(docDefinition).open();
    this.pageLoading = false;
  }
  async goTo(link: string) {
    if (link !== '' && link !== '#') {
      await this.router.navigate([link, this.inputNIE]);
    }
  }
  private populateStudent(result: StudentInfoResponse) {
    return [
      {
        nie: result.estudiante.nie,
        EstadoApoyo: 'Indefinido',
        fechaNacimiento: result.estudiante.fechaNacimiento,
        primerNombre: result.estudiante.nombreCompleto.split(' ')[0],
        primerApellido: result.estudiante.nombreCompleto.split(' ')[2],
        verDetalle: 'Ver',
        Acciones: null,
      },
    ];
  }
  async toggleTable() {
    await this.router.navigate([`/menu/saet-buscar`, this.inputNIE]);
    this.userMessage.showMessage = false;

    this.pageLoading = true;
    console.log('atendido cor begining');
    try {
      const resp = await this.catalogoServiceCOR.getPAEIPerNIE(this.nie);
      if (resp.id_paei !== 0) {
        this.atendidoCOR = true;
      }
    } catch (e) {
      this.atendidoCOR = false;
    }

    try {
      const resp = await this.catalogoServiceDai.getPlanAccionPerNIE(this.nie);
      console.log('here --> ', resp);
      if (resp.plan_accion_pk !== 0) {
        this.atendidoDAI = true;
      }
    } catch (e) {
      this.atendidoDAI = false;
    }

    this.flowData = await this.buildFlowData();
    console.log('atendido cor finished');
    if (this.inputNIE) {
      try {
        const result = await this.catalogoServiceCOR.getStudentInfo(
          this.inputNIE
        );
        this.cnResult = 1;
        this.studentData = this.populateStudent(result);
        this.studentInfo = result.estudiante;
        this.centroEducativo = result.centroEducativo.nombre;
        this.userMessage = {
          showMessage: false,
          message: '',
          titleMessage: '',
          type: MessageType.SUCCESS,
        };
        /*this.showError = false;
        this.errorMessage = "";*/
        this.showTable = true;
      } catch (e: unknown) {
        const error = e as ResponseError;
        if (error.status === 401) {
          console.log('back to login', error.message);
        }
        this.userMessage = {
          showMessage: true,
          message: error.message,
          type: MessageType.DANGER,
        };

        this.showTable = false;
      }
    } else {
      this.userMessage = {
        showMessage: true,
        message: 'Escribe el NIE para realizar busqueda',
        titleMessage: '',
        type: MessageType.WARNING,
      };

      this.showTable = false;
    }
    this.pageLoading = false;
  }

  searchButton: SaetButtonArgs = {
    buttonStyle: ButtonStyle.BLUE,
    text: 'Buscar',
  };

  cleanInput() {
    this.inputNIE = '';
    this.userMessage.showMessage = false;
    this.showTable = false;
  }

  protected readonly ButtonStyle = ButtonStyle;
}
