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
import {SAET_MODULE} from "./shared/evaluaciones";
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
  getRolApoyo(): SAET_MODULE | undefined {
    const rolApoyo =
      localStorage.getItem('idRolApoyo') !== undefined ?
      (localStorage.getItem('idRolApoyo') as unknown as SAET_MODULE) : undefined;


    return rolApoyo;
  }
  async generateTextPdf({
                          title,
                          studentNie,
                          studentFullName,
                          survey,
                          answers,
                        }: IGenerateTextPdf) {
    const doc = new jsPDF();
    let currentY = 30; // Posición Y actual en la página
    const footerMargin = 30; // Margen para evitar la superposición con el pie de página
    let pageNumber = 1; // Inicia en la primera página

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

      // Iterar por cada cuestionario
      survey.forEach(cuestionario => {
        const respuestas = answers
          .filter(respuesta =>
            cuestionario.preguntas.some(
              p => p.id_pregunta === respuesta.id_pregunta
            )
          )
          .map(respuesta => {
            const concatOptions = respuesta.opcion.reduce((acc, current) => {
              return acc ? `${acc}, ${current.opcion}` : current.opcion;
            }, '');

            return [
              respuesta.pregunta || '',
              respuesta.respuesta || '',
              concatOptions || '',
            ] as [string, string, string];
          });

        if (respuestas.length > 0) {
          // Verificar si el contenido se aproxima al margen inferior
          if (currentY > pageHeight - footerMargin) {
            doc.addPage();
            pageNumber++;
            currentY = 30; // Restablecer Y en la nueva página
          }

          // Agregar el título del cuestionario
          doc.setFontSize(14);
          doc.text(cuestionario.titulo, 8, currentY);
          currentY += 10;

          // Tabla con opciones
          const respuestasConOpciones = respuestas.filter(
            respuesta => respuesta[2] !== ''
          );

          if (respuestasConOpciones.length > 0) {
            const respuestasTablaConOpciones = respuestasConOpciones.map(
              respuesta => [respuesta[0], respuesta[2], respuesta[1]]
            );

            autoTable(doc, {
              head: [['Pregunta', 'Opción', 'Observaciones']],
              body: respuestasTablaConOpciones,
              startY: currentY,
              margin: { bottom: footerMargin },
              didDrawPage: data => {
                // Ajustar la numeración de página y agregar el pie de página
                if (data.pageNumber > pageNumber) {
                  pageNumber = data.pageNumber;
                }
                addFooter(doc, logo, pageWidth, pageHeight, pageNumber);
                currentY = 30; // Restablecer Y en la nueva página
              },
            });
            currentY = (doc as any).lastAutoTable.finalY + 10;
          }

          // Tabla sin opciones
          const respuestasSinOpciones = respuestas.filter(
            respuesta => respuesta[2] === ''
          );

          if (respuestasSinOpciones.length > 0) {
            const respuestasTablaSinOpciones = respuestasSinOpciones.map(
              respuesta => [respuesta[0], respuesta[1]]
            );

            autoTable(doc, {
              head: [['Pregunta', 'Respuesta']],
              body: respuestasTablaSinOpciones,
              startY: currentY,
              margin: { bottom: footerMargin },
              didDrawPage: data => {
                // Ajustar la numeración de página y agregar el pie de página
                if (data.pageNumber > pageNumber) {
                  pageNumber = data.pageNumber;
                }
                addFooter(doc, logo, pageWidth, pageHeight, pageNumber);
                currentY = 30; // Restablecer Y en la nueva página
              },
            });
            currentY = (doc as any).lastAutoTable.finalY + 10;
          }

          // Verificar si el contenido se aproxima al margen inferior
          if (currentY > pageHeight - footerMargin) {
            doc.addPage();
            pageNumber++;
            currentY = 30; // Restablecer Y en la nueva página
          }
        }
      });

      doc.save(`Caracterizacion-dai-estudiante-${studentNie}.pdf`);
    } catch (err) {
      console.error('Error al generar pdf:', err);
      throw err;
    } finally {
      this.pageLoading = false;
    }

    // Función para agregar el pie de página y el logo
    function addFooter(doc: any, logo: any, pageWidth: any, pageHeight: any, pageNumber: any) {
      doc.addImage(logo, 'PNG', 10, pageHeight - footerMargin, 50, 20);
      doc.setFontSize(10);
      doc.text(`Página ${pageNumber}`, pageWidth - 40, pageHeight - 10);
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
      if (Object.prototype.hasOwnProperty.call(groupedData, id)) {
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
