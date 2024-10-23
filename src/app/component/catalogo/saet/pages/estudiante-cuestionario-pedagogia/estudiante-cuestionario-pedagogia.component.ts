import { Component, Inject } from '@angular/core';
import { QuestionsComponent } from '../../QuestionsComponent';
import {
  IMessageComponent,
  MessageType,
  UserMessage,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveQuestionary,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {KeyValue} from "../../component/saet-input/saet-input.component";

@Component({
  selector: 'app-estudiante-cuestionario-pedagogia',
  templateUrl: './estudiante-cuestionario-pedagogia.component.html',
  styleUrls: ['./estudiante-cuestionario-pedagogia.component.css'],
})
export class EstudianteCuestionarioPedagogiaComponent
  extends QuestionsComponent
  implements IMessageComponent
{
  override ngOnInit = async () => {
    await super.ngOnInit();
  };
  idEvaluacion = 0;
  baseUrl = '/menu/saet-pedagogia';
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ) {
    const especialidadTarget = 'pedagogia';
    super(
      document,
      catalogoServiceCOR,
      route,
      router,
      confirmationService,
      especialidadTarget
    );
    this.pageLoading = true;
    const tipoEvaluacionPromise = this.catalogoServiceCOR.getTipoDeEvaluacion(
      this.nie,
      TIPO_EVALUACION.pedagogo_perfil
    );
    const questionPromise = catalogoServiceCOR.getPedagogiaQuestions();
    Promise.all([tipoEvaluacionPromise, questionPromise])
      .then(([tipoEvaluacionResponse, questionResponse]) => {
        this.idEvaluacion = tipoEvaluacionResponse.id_evaluacion;
        console.log('questionResponse', questionResponse);
        this.corSurveys.push(...questionResponse.cuestionarios);
        this.showActionButtons = true;
        this.handleMode(
          tipoEvaluacionResponse.id_evaluacion,
          'menu/saet-pedagogia',
          this.formMode
        );
      })
      .catch(e => {
        console.log('error in promise -----------zzzz ----- ', e);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }
  onCheckboxChange(keyValues: KeyValue[]) {
    const selectedValues = keyValues.map(e => e.value);
    this.values[keyValues[0].key] = selectedValues.toString();
    localStorage.setItem('values', JSON.stringify(this.values));
  }
  async generarPDF() {
    this.pageLoading = true;
    const doc = new jsPDF();
    let currentY = 30;

    const respuestasServer = await this.catalogoServiceCOR.getTipoDeEvaluacion(
      this.nie,
      TIPO_EVALUACION.pedagogo_perfil
    );
    console.log('respuestas guardadas --- > ', respuestasServer);

    const title = 'Perfil psicológico de estudiante';
    const studentName = `${this.studentInfo?.nombreCompleto} | ${this.studentInfo?.nie}` || 'Nombre del estudiante no disponible';

    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const titleX = (pageWidth - titleWidth) / 2;

    const logoPath = '/assets/logo.png';

    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = err => reject(err);
      });
    };
    const logo = await loadImage(logoPath);
    console.log('logo ', logo);

    doc.text(title, titleX, currentY);
    currentY += 10;

    doc.setFontSize(12);
    const studentNameWidth = doc.getTextWidth(studentName);
    const studentNameX = (pageWidth - studentNameWidth) / 2;
    doc.text(studentName, studentNameX, currentY);
    currentY += 10; // Espacio debajo del nombre del estudiante

    doc.setFontSize(15);
    let pageNumber = 0;

    const respuestas = respuestasServer.respuestas;

    const respuestasConOpciones = respuestas.filter(
      (respuesta: any) => respuesta.opcion.length > 0
    );

    const respuestasSinOpciones = respuestas.filter(
      (respuesta: any) => respuesta.opcion.length === 0
    );

    if (respuestasConOpciones.length > 0) {
      const respuestasTablaConOpciones = respuestasConOpciones.map((respuesta: any) => {
        const opcionesConcat = respuesta.opcion[0].opcion;
        const strResponse = respuesta.respuesta !== '' ? respuesta.respuesta : 'Ninguna';

        return [respuesta.pregunta, opcionesConcat, strResponse];
      });

      autoTable(doc, {
        head: [['Pregunta', 'Opción', 'Observaciones']],
        body: respuestasTablaConOpciones,
        startY: currentY,
        didDrawPage: data => {
          doc.setFontSize(10);
          if (data.pageNumber !== pageNumber) {
            doc.text(
              `Página ${data.pageNumber}`,
              pageWidth - 40,
              pageHeight - 10
            );
            pageNumber = data.pageNumber;
          }
          doc.addImage(logo, 'PNG', 10, pageHeight - 30, 50, 20);
          pageNumber++;
        },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    if (respuestasSinOpciones.length > 0) {
      const respuestasTablaSinOpciones = respuestasSinOpciones.map((respuesta) => {
        return [respuesta.pregunta, respuesta.respuesta] as any;
      });

      autoTable(doc, {
        head: [['Pregunta', 'Respuesta']],
        body: respuestasTablaSinOpciones,
        startY: currentY,
        didDrawPage: data => {
          doc.setFontSize(10);
          if (data.pageNumber !== pageNumber) {
            doc.text(
              `Página ${data.pageNumber}`,
              pageWidth - 40,
              pageHeight - 10
            );
            pageNumber = data.pageNumber;
          }
          doc.addImage(logo, 'PNG', 10, pageHeight - 30, 50, 20);
          pageNumber++;
        },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    doc.save(`perfil-pedagogia-estudiante-${this.nie}.pdf`);

    this.pageLoading = false;
  }
  async save() {
    this.pageLoading = true;
    const objToSave: ISaveQuestionary = this.getQuestionaryObject();
    console.log('obj to save', objToSave);
    objToSave.id_evaluacion = this.idEvaluacion;
    try {
      const resp = await this.catalogoServiceCOR.updatePedagogia(objToSave);
      if (resp.id_evaluacion === 0) {
        this.userMessage.showMessage = true;
        this.userMessage.type = MessageType.DANGER;
        this.userMessage.message = 'Ocurrio un error guardando el perfil pedagogico';
        this.userMessage.titleMessage = 'Error';
        return;
      }
      await this.router.navigate([this.baseUrl, this.nie, 'view']);
    } catch (e) {
      console.log('Error ---- ', e);
    } finally {
      this.pageLoading = false;
    }
  }
}
