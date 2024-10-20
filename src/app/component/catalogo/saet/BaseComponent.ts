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
    console.log('-----------------');
    console.log('keys', keys);
    console.log('data', data);
    console.log('-----------------');
    const groupedData = keys.reduce<
      Record<
        string,
        { radio?: string; input?: string; check?: string; richtext?: string }
      >
    >((acc, key) => {
      const [type, id] = key.split('_');
      console.log(acc);
      console.log(id);
      console.log(type);
      if (!acc[id]) {
        acc[id] = {};
      }
      if (type === 'radio' || type === 'input' || type === 'richtext') {
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
    console.log('',{
      values: [
        studentResponse.estudiante.nombreCompleto,
        studentResponse.estudiante.nie,
        studentResponse.estudiante.fechaNacimiento,
        studentResponse.estudiante.direccion,
        "studentResponse.estudiante.telefono[0]",
        "studentResponse.estudiante.correo",
      ],
    });
    const studentPhone = studentResponse.estudiante.telefono !== undefined &&
      studentResponse.estudiante.telefono.length > 0 ?  studentResponse.estudiante.telefono[0] : '';
    const teachePhone =  studentResponse.centroEducativo.telefonoOrientador !== undefined &&
                          studentResponse.centroEducativo.telefonoOrientador !== null &&
                          studentResponse.centroEducativo.telefonoOrientador.length > 0 ?
      studentResponse.centroEducativo.telefonoOrientador[0] : '';

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
