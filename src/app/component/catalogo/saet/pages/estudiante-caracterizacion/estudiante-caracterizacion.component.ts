import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {
  CatalogoServiceCor,
  ISaveCaracterizacion,
  StudentDetail
} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {userMessageInit} from "../../shared/messages.model";
import {BaseComponent} from "../../BaseComponent";
import {SAET_MODULE} from "../../shared/evaluaciones";
import {IconComponent} from "../../shared/component.config";

@Component({
  selector: 'app-estudiante-caracterizacion',
  templateUrl: './estudiante-caracterizacion.component.html',
  styleUrls: ['./estudiante-caracterizacion.component.css']
})
export class EstudianteCaracterizacionComponent extends BaseComponent implements IMessageComponent {
  userMessage: UserMessage = userMessageInit;
  //nie:string = "";
  //studentInfo?: StudentDetail;
  nombreUsuario:string = "";
  especialidad: string = "";
  readonlyInput:boolean = true;
  buttonIcon = IconComponent;
  async iniciarCaracterizacion(){
    const objSaveCaracterizacion:ISaveCaracterizacion = {
      id_caracterizacion: null,
      id_estudiante_fk: this.studentInfo?.id_est_pk ?? 0,
      id_especialista: 3,
      id_docente_apoyo: 0,
      id_modulo: SAET_MODULE.COR,
      grupoFamiliar: [
        {
          grupo_familiar_pk: null,
          primer_nombre: "Maria",
          segundo_nombre: "Imelda",
          tercer_nombre: "",
          primer_apellido: "Ruiz",
          segundo_apellido: "Huezo",
          tercer_apellido: "String",
          edad: 60,
          parentesco: "Abuela",
          nivel_educativo: "Basica",
          ocupacion: "Vendedora informal"
        }
      ],
      respuestas: [
      {
        id_pregunta: 2,
        opcion: [],
        respuesta: "Esta es una prueba para crear una caracterizacion"
      }
    ]
    }
    console.log('object to save ', objSaveCaracterizacion);
    try {
      const resp = await this.catalogoServiceCOR.saveCaracterizacion(objSaveCaracterizacion);
      console.log('resp', resp);
    }catch (e:unknown){
      const error = e as Error;
      console.log(error);
      const errorDetails = JSON.parse(error.message);
      console.log('error caracterizacion ', errorDetails.message);
    }


    //await this.goTo('/menu/saet-caracterizacion-iniciar')
  }
  async goTo(link:string){
    if(link !== '' && link !== '#'){
      await this.router.navigate([link,  this.nie ]);
    }
  }
  override async ngOnInit() {
    await super.ngOnInit();
    console.log('caracterizacion load ', this.caracterizacion);
  }

  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router
  ){
    super(document, catalogoServiceCOR, route, router);
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
      }
    });

    this.nombreUsuario = localStorage.getItem('nombre') ?? "";
    this.especialidad = localStorage.getItem('especialidad') ? `Especialista en ${localStorage.getItem('especialidad')} - COR` : "";

    catalogoServiceCOR.getStudentInfo(this.nie).then((result) => {
      this.studentInfo = result.estudiante;
    });

  }




}
