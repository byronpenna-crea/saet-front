import { Component, Inject } from '@angular/core';
import { QuestionsComponent } from '../../QuestionsComponent';
import {
  IMessageComponent,
  MessageType,
} from '../../interfaces/message-component.interface';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  ISaveQuestionary,
} from '../../../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { TIPO_EVALUACION } from '../../shared/evaluaciones';
import { ConfirmationService } from 'primeng/api';
import { KeyValue } from '../../component/saet-input/saet-input.component';
import { IconComponent } from '../../shared/component.config';
import jsPDF from 'jspdf';
import { iQuestion } from '../../shared/survey';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-estudiante-cuestionario-psicologia',
  templateUrl: './estudiante-cuestionario-psicologia.component.html',
  styleUrls: ['./estudiante-cuestionario-psicologia.component.css'],
})
export class EstudianteCuestionarioPsicologiaComponent
  extends QuestionsComponent
  implements IMessageComponent
{
  btnIcon = IconComponent;
  cuestionariosTableMode: number[] = [7, 10, 11, 12, 13];
  override ngOnInit = async () => {
    await super.ngOnInit();
  };
  idEvaluacion = 0;
  baseUrl = '/menu/saet-psicologia';
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router,
    confirmationService: ConfirmationService
  ) {
    const especialidadTarget = 'psicologia';

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
      TIPO_EVALUACION.psicologo_perfil
    );
    const psicologiaQuestionsPromise =
      this.catalogoServiceCOR.getPsicologiaQuestions();

    Promise.all([tipoEvaluacionPromise, psicologiaQuestionsPromise])
      .then(([responseEvaluacion, resultQuestions]) => {
        this.idEvaluacion = responseEvaluacion.id_evaluacion;
        console.log('original response ', responseEvaluacion);
        this.handleMode(
          responseEvaluacion.id_evaluacion,
          'menu/saet-psicologia',
          this.formMode
        );
        console.log('depurados ', this.responseToValues(responseEvaluacion));
        this.values = {
          ...this.responseToValues(responseEvaluacion),
          ...this.values,
        };
        console.log('this values ... ', this.values);

        this.showActionButtons = true;
        this.corSurveys.push(...resultQuestions.cuestionarios);
      })
      .catch(ex => {
        console.log('ex here', ex);
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

    // Obtener las respuestas del servidor
    const respuestasServer = await this.catalogoServiceCOR.getTipoDeEvaluacion(
      this.nie,
      TIPO_EVALUACION.psicologo_perfil
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

    // Título del documento
    doc.text(title, titleX, currentY);
    currentY += 10;

    // Nombre del estudiante
    doc.setFontSize(12);
    const studentNameWidth = doc.getTextWidth(studentName);
    const studentNameX = (pageWidth - studentNameWidth) / 2;
    doc.text(studentName, studentNameX, currentY);
    currentY += 10; // Espacio debajo del nombre del estudiante

    doc.setFontSize(15);
    let pageNumber = 0;

    // Obtener las respuestas del servidor
    const respuestas = respuestasServer.respuestas;

    // Dividir respuestas en dos grupos: con opciones y sin opciones
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

    // Guardar el PDF
    doc.save(`perfil-psicologo-estudiante-${this.nie}.pdf`);

    this.pageLoading = false;
  }
  async save() {
    this.pageLoading = true;
    const objToSave: ISaveQuestionary = this.getQuestionaryObject();
    console.log('obj to save', objToSave);
    objToSave.id_evaluacion = this.idEvaluacion;
    try {
      const resp = await this.catalogoServiceCOR.updatePsicologia(objToSave);
      if (resp.id_evaluacion === 0) {
        this.userMessage.showMessage = true;
        this.userMessage.type = MessageType.DANGER;
        this.userMessage.message = 'Ocurrio un error guardando el perfil psicologico';
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

  override salirEditMode(): string {
    const url = super.salirEditMode();
    this.catalogoServiceCOR
      .getTipoDeEvaluacion(this.nie, TIPO_EVALUACION.psicologo_perfil)
      .then(response => {
        this.values = {
          ...this.responseToValues(response),
        };
      });
    this.router.navigateByUrl(url);
    return '';
  }
}
