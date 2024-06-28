import {Inject, Injectable, OnInit} from "@angular/core";
import {
  CatalogoServiceCor,
  IGetCaracterizacion,
  StudentDetail,
  StudentInfoResponse
} from "../../../services/catalogo/catalogo.service.cor";
import {DOCUMENT} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {FormMode, IQuestionaryAnswer, IValuesForm} from "./QuestionsComponent";

interface informationTabBody {
 values: string[]
}
@Injectable()
export class BaseComponent implements OnInit{
  nie: string = '';
  studentInfo?: StudentDetail;

  caracterizacion: IGetCaracterizacion | undefined;
  readOnlyEvaluaciones:boolean = true;
  readOnlyPaei:boolean = true;
  async ngOnInit() {
    const response = await this.catalogoServiceCOR.getCaracterizacionPorNIE(this.nie);
    this.caracterizacion = response;
    if(response.id_caracterizacion !== 0){
      this.readOnlyPaei = false;
      this.readOnlyEvaluaciones = false;
    }
  }
  getAnswerObject(data: IValuesForm): IQuestionaryAnswer[] {
    const result: IQuestionaryAnswer[] = [];

    const keys = Object.keys(data);
    console.log('keys', keys);
    const groupedData = keys.reduce<Record<string, { radio?: string; input?: string }>>((acc, key) => {
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
        !isNaN(idPregunta) && result.push(
          {
            id_pregunta: idPregunta,
            opcion: [
              {
                id_opcion: parseInt(id, 10),
                opcion: groupedData[id].radio || ""
              }
            ],
            respuesta: groupedData[id].input || ""
          }
        );
        console.log('grouped data here', groupedData[id]);
        if (groupedData[id].input) {
          result[result.length - 1].opcion = [];
        }
      }
    }

    return result;
  }
  /*getFormModeFromString(formModeString:string | null) {
    switch (formModeString){
      case null:
        return FormMode.CREATE;
        break;
      case 'view':
        return FormMode.VIEW;
        break;
      case 'edit':
        return FormMode.EDIT;
        break;
      default:
        return undefined;
        break;
    }
  }*/
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
