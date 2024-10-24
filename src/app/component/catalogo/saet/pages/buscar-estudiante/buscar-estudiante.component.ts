import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  ButtonStyle,
  SaetButtonArgs,
} from '../../component/saet-button/saet-button.component';
import { TableColumn } from '../../component/saet-table/saet-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CatalogoServiceCor,
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
import {SAET_MODULE} from "../../shared/evaluaciones";

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
/*interface tableInterface {
  cor: string;
  dai: string;
  ce: string;
  eee: string;
  codai: string;
  criedv: string
}*/

@Component({
  selector: 'app-buscar-estudiante',
  templateUrl: './buscar-estudiante.component.html',
  styleUrls: ['./buscar-estudiante.component.css'],
})
export class BuscarEstudianteComponent
  extends CorBaseComponent
  implements IMessageComponent
{
  inputNIE = '';
  cnResult = 0;
  centroEducativo = '';
  onInputChange(keyValue: KeyValue) {
    this.inputNIE = keyValue.value;
  }

  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    private cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    router: Router
  ) {
    super(document, catalogoServiceCOR, route, router);
    try {

      console.log('-----------------');
      console.log('rol apoyo ',localStorage.getItem('rolApoyo') ?? '') ;
      console.log('especialidad ', localStorage.getItem('especialidad') ?? undefined);
      console.log(localStorage.getItem('idRolApoyo') !== undefined && (localStorage.getItem('idRolApoyo') as unknown as SAET_MODULE) == SAET_MODULE.COR);
      console.log('------------------');
      this.pageLoading = true;
      if (this.nie === '') {
        this.pageLoading = false;
        return;
      }
      console.log('id rol apoyo ---> ', localStorage.getItem('idRolApoyo'));
      console.log((localStorage.getItem('idRolApoyo') as unknown as SAET_MODULE));
      console.log(SAET_MODULE.COR);
      console.log((localStorage.getItem('idRolApoyo') as unknown as SAET_MODULE) === SAET_MODULE.COR);
      this.catalogoServiceCOR
        .getStudentInfo(this.nie)
        .then(result => {
          this.cnResult = 1;
          this.studentData = this.populateStudent(result);
          this.centroEducativo = result.centroEducativo.nombre;
          this.showTable = true;
          this.inputNIE = result.estudiante.nie;
        })
        .catch(e => {
          const error = e as ResponseError;
          console.log('catch getStudentInfo', error.message);
          if (error.status === 401) {
            // redirect
          }
          this.userMessage = {
            showMessage: true,
            message: error.message,
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
  flowData = [
    {
      col1: 'Centro de Orientación y Recursos (COR)',
      col2: 'Sin atención',
      col3: '',
      href: '/menu/saet-datos-estudiante',
      enabled: localStorage.getItem('idRolApoyo') !== undefined && (localStorage.getItem('idRolApoyo') as unknown as SAET_MODULE) == SAET_MODULE.COR
    },
    {
      col1: 'Docente de Apoyo a la Inclusión (DAI)',
      col2: 'Sin atención',
      col3: '',
      href: '/menu/dai/saet-datos-estudiante',
      enabled: localStorage.getItem('idRolApoyo') && (localStorage.getItem('idRolApoyo') as unknown as SAET_MODULE) == SAET_MODULE.DAI
    },
    {
      col1: 'DEI',
      col2: 'Sin atención',
      col3: '',
      href: '/menu/dei/informe-cualitativo',
    },
    {
      col1: 'Escuela de Educación Especial (EEE)',
      col2: 'Sin atención',
      col3: '',
      href: '',
    },
    {
      col1: 'Comité Departamental de Apoyo a la Inclusión (CODAI)',
      col2: 'Sin atención',
      col3: '',
      href: '',
    },
    {
      col1: 'Centro de Recursos de Inclusión Educativa (CRIE-DV)',
      col2: 'Sin atención',
      col3: '',
      href: '',
    },
  ];

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
  async goToReferencia(link: string) {
    if (link !== '' && link !== '#') {
      await this.router.navigate([link]);
    }
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
