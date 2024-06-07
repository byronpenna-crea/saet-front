import {Inject, Injectable} from "@angular/core";
import {CatalogoServiceCor, StudentDetail, StudentInfoResponse} from "../../../services/catalogo/catalogo.service.cor";
import {DOCUMENT} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

interface informationTabBody {
 values: string[]
}
@Injectable()
export class BaseComponent {
  nie: string = '';
  studentInfo?: StudentDetail;
  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected catalogoServiceCOR: CatalogoServiceCor,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
        this.loadStudentInfo();
      }
    });
  }
  protected loadStudentInfo(): Promise<StudentInfoResponse> {
    return this.catalogoServiceCOR.getStudentInfo(this.nie).then((result) => {
      this.studentInfo = result.estudiante;
      return result;
    }).catch((e) => {
      this.router.navigate(['menu/saet-buscar']);
      throw e;
    });
  }

  protected populateStudentInformation(studentResponse: StudentInfoResponse) {
    const generalInformation:informationTabBody = {
      values: [
        studentResponse.estudiante.nombreCompleto,
        studentResponse.estudiante.nie,
        studentResponse.estudiante.fechaNacimiento,
        studentResponse.estudiante.direccion,
        studentResponse.estudiante.telefono[0],
        studentResponse.estudiante.correo
      ]
    };
    const institutionalInfo:informationTabBody = {
      values: [
        studentResponse.centroEducativo.nombre,
        studentResponse.centroEducativo.codigo,
        studentResponse.centroEducativo.direccion,
        studentResponse.centroEducativo.ultimoGradoCursado,
        studentResponse.centroEducativo.gradoActual,
        studentResponse.centroEducativo.seccion,
        studentResponse.centroEducativo.docenteOrientador,
        studentResponse.centroEducativo.correoOrientador,
        studentResponse.centroEducativo.telefonoOrientador[0]
      ]
    };
    const trustedAdultInfo:informationTabBody =
      studentResponse.responsables !== undefined && studentResponse.responsables.nombre !== undefined && studentResponse.responsables.nombre !== "" ? {
      values: [
        studentResponse.responsables.nombre,
        studentResponse.responsables.dui,
        studentResponse.responsables.nit,
        studentResponse.responsables.direccion,
        studentResponse.responsables.telefono,
      ]
    } : {
        values: [
          "No disponible",
          "No disponible",
          "No disponible",
          "No disponible",
          "No disponible",
        ]
      };


    return {
      generalInformation,
      institutionalInfo,
      trustedAdultInfo
    }
  }

}
