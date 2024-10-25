import { Injectable } from '@angular/core';
import { IconComponent } from './shared/component.config';
import { ButtonStyle } from './component/saet-button/saet-button.component';
import {
  StudentDetail,
  StudentInfoResponse,
} from '../../../services/catalogo/catalogo.service.cor';
import { informationTabBody } from './CorBaseComponent';
import { UserMessage } from './interfaces/message-component.interface';
import { userMessageInit } from './shared/messages.model';
import { IQuestionaryAnswer, IValuesForm } from './QuestionsComponent';
import jsPDF from "jspdf";
import {iQuestion, iSurvey} from "./shared/survey";
import autoTable from "jspdf-autotable";
interface IGenerateTextPdf {
  title: string;
  studentNie: string;
  studentFullName: string;
  survey:iSurvey[];
  answers: iQuestion[];
}
@Injectable()

export class BaseComponent {
  nie = '';
  studentInfo?: StudentDetail;
  iconCompoment = IconComponent;
  userMessage: UserMessage = userMessageInit;
  btnStyle = ButtonStyle;
  pageLoading = false;

  async generateTextPdf({title, studentNie,
                          studentFullName,
    survey, answers
    }:IGenerateTextPdf){
    const doc = new jsPDF();
    let currentY = 30;
    const studentName =
      `${studentFullName} | ${studentNie}` ||
      'Nombre del estudiante no disponible';

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

    try {
      const logo = await loadImage(logoPath);

      // Agregar el título centrado
      doc.setFontSize(16);
      doc.text(title, titleX, currentY);
      currentY += 10;

      // Agregar el nombre del estudiante centrado
      doc.setFontSize(12);
      const studentNameWidth = doc.getTextWidth(studentName);
      const studentNameX = (pageWidth - studentNameWidth) / 2;
      doc.text(studentName, studentNameX, currentY);
      currentY += 20; // Espacio debajo del nombre del estudiante

      survey.forEach(cuestionario => {
        const respuestas =
          answers
            .filter((respuesta) =>
              cuestionario.preguntas.some(
                p => p.id_pregunta === respuesta.id_pregunta
              )
            )
            .map((respuesta) => {
              const concatOptions = respuesta.opcion.reduce((acc, current) => {
                return acc ? `${acc}, ${current.opcion}` : current.opcion;
              }, '');

              const strResponse =
                respuesta?.respuesta !== undefined && respuesta?.respuesta !== ''
                  ? respuesta?.respuesta
                  : concatOptions;
              return [
                respuesta.pregunta || '',
                strResponse || ''
              ] as [string, string];
            }) ?? [];

        if (respuestas !== undefined &&  respuestas.length > 0) {
          // Título del cuestionario
          doc.setFontSize(14);
          doc.text(cuestionario.titulo, 8, currentY);
          currentY += 10;

          // Añadir tabla
          autoTable(doc, {
            head: [['Pregunta', 'Respuesta']],
            body: respuestas,
            startY: currentY,
            margin: { bottom: 30 }, // Espacio inferior para el logo y número de página
            didDrawPage: data => {
              // Añadir el logo en la esquina inferior izquierda
              doc.addImage(logo, 'PNG', 10, pageHeight - 30, 50, 20);

              // Añadir el número de página en la esquina inferior derecha
              doc.setFontSize(10);
              doc.text(
                `Página ${data.pageNumber}`,
                pageWidth - 40,
                pageHeight - 10
              );

              // Restablecer la posición de Y para la nueva página
              currentY = 30;
            },
          });

          // Actualizar la posición Y después de la tabla
          currentY = (doc as any).lastAutoTable.finalY + 10;

          // Verificar si el contenido se aproxima al margen inferior
          if (currentY > pageHeight - 40) {
            doc.addPage();
            currentY = 30;
          }
        }
      });
      doc.save(`Caracterizacion-dai-estudiante-${this.nie}.pdf`);
    } catch (err) {
      console.error('Error al cargar el logo:', err);
    } finally {
      this.pageLoading = false;
    }
  }

  getAnswerObject(data: IValuesForm): IQuestionaryAnswer[] {
    const result: IQuestionaryAnswer[] = [];
    const keys = Object.keys(data);
    console.log('-----------------');
    console.log('keys', keys);
    console.log('data', data);
    console.log('-----------------');
    const groupedData = keys.reduce<
      Record<
        string,
        {
          radio?: string;
          input?: string;
          check?: string;
          richtext?: string;
          textarea?: string;
        }
      >
    >((acc, key) => {
      const [type, id] = key.split('_');
      console.log(acc);
      console.log(id);
      console.log(type);
      if (!acc[id]) {
        acc[id] = {};
      }
      if (
        type === 'radio' ||
        type === 'input' ||
        type === 'richtext' ||
        type === 'textarea'
      ) {
        acc[id][type] = data[key];
      }
      return acc;
    }, {});
    console.log('grouped data ', groupedData);

    for (const id in groupedData) {
      if (groupedData.hasOwnProperty(id)) {
        const idPregunta = parseInt(id, 10);

        !isNaN(idPregunta) &&
          result.push({
            id_pregunta: idPregunta,
            opcion:
              !!groupedData[id].radio || !!groupedData[id].check
                ? [
                    {
                      id_opcion: parseInt(groupedData[id].radio ?? '0', 10),
                      opcion: groupedData[id].radio || '',
                    },
                  ]
                : [],
            respuesta:
              (groupedData[id].input ?? '') !== ''
                ? groupedData[id].input ?? ''
                : (groupedData[id].richtext ?? '') !== ''
                  ? groupedData[id].richtext ?? ''
                  : (groupedData[id].textarea ?? '') !== ''
                    ? groupedData[id].textarea ?? ''
                  : '',
          });
        console.log(
          'grouped data here',
          !!groupedData[id].radio || !!groupedData[id].check
        );
      }
    }

    return result;
  }
  protected populateStudentInformation(studentResponse: StudentInfoResponse) {
    const studentPhone =
      studentResponse.estudiante.telefono !== undefined &&
      studentResponse.estudiante.telefono.length > 0
        ? studentResponse.estudiante.telefono[0]
        : '';
    const teachePhone =
      studentResponse.centroEducativo.telefonoOrientador !== undefined &&
      studentResponse.centroEducativo.telefonoOrientador !== null &&
      studentResponse.centroEducativo.telefonoOrientador.length > 0
        ? studentResponse.centroEducativo.telefonoOrientador[0]
        : '';

    const generalInformation: informationTabBody = {
      values: [
        studentResponse.estudiante.nombreCompleto,
        studentResponse.estudiante.nie,
        studentResponse.estudiante.fechaNacimiento,
        studentResponse.estudiante.direccion,
        studentPhone,
        studentResponse.estudiante.correo,
      ],
    };
    const institutionalInfo: informationTabBody = {
      values: [
        studentResponse.centroEducativo.nombre,
        studentResponse.centroEducativo.codigo,
        studentResponse.centroEducativo.direccion,
        studentResponse.centroEducativo.ultimoGradoCursado,
        studentResponse.centroEducativo.gradoActual,
        studentResponse.centroEducativo.seccion,
        studentResponse.centroEducativo.docenteOrientador,
        studentResponse.centroEducativo.correoOrientador,
        teachePhone,
      ],
    };
    const trustedAdultInfo: informationTabBody =
      studentResponse.responsables !== undefined &&
      studentResponse.responsables.nombre !== undefined &&
      studentResponse.responsables.nombre !== ''
        ? {
            values: [
              studentResponse.responsables.nombre,
              studentResponse.responsables.dui,
              studentResponse.responsables.nit,
              studentResponse.responsables.direccion,
              studentResponse.responsables.telefono,
            ],
          }
        : {
            values: [
              'No disponible',
              'No disponible',
              'No disponible',
              'No disponible',
              'No disponible',
            ],
          };

    return {
      generalInformation,
      institutionalInfo,
      trustedAdultInfo,
    };
  }
  convertString(input: string): string {
    let result = input.toLowerCase();

    const accentsMap: { [key: string]: string } = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      ü: 'u',
      ñ: 'n',
    };

    result = result.replace(/[áéíóúüñ]/g, match => accentsMap[match]);

    result = result.replace(/\s+/g, '_');

    return result;
  }
}
