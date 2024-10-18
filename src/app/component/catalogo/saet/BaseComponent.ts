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

@Injectable()
export class BaseComponent {
  nie = '';
  studentInfo?: StudentDetail;
  iconCompoment = IconComponent;
  userMessage: UserMessage = userMessageInit;
  btnStyle = ButtonStyle;
  pageLoading = false;

  getAnswerObject(data: IValuesForm): IQuestionaryAnswer[] {
    const result: IQuestionaryAnswer[] = [];

    const keys = Object.keys(data);
    console.log('keys', keys);
    const groupedData = keys.reduce<
      Record<string, { radio?: string; input?: string; check?: string }>
    >((acc, key) => {
      const [type, id] = key.split('_');
      if (!acc[id]) {
        acc[id] = {};
      }
      if (type === 'radio' || type === 'input') {
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
            respuesta: groupedData[id].input || '',
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
    const generalInformation: informationTabBody = {
      values: [
        studentResponse.estudiante.nombreCompleto,
        studentResponse.estudiante.nie,
        studentResponse.estudiante.fechaNacimiento,
        studentResponse.estudiante.direccion,
        studentResponse.estudiante.telefono[0],
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
        studentResponse.centroEducativo.telefonoOrientador[0],
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
