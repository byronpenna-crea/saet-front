import {Injectable} from "@angular/core";
import {IconComponent} from "./shared/component.config";
import {ButtonStyle} from "./component/saet-button/saet-button.component";
import {StudentDetail, StudentInfoResponse} from "../../../services/catalogo/catalogo.service.cor";
import {informationTabBody} from "./CorBaseComponent";

@Injectable()
export class BaseComponent {

  nie = '';
  studentInfo?: StudentDetail;
  iconCompoment = IconComponent;
  btnStyle = ButtonStyle;
  pageLoading = false;

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
