import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {userMessageInit} from "../../shared/messages.model";

@Component({
  selector: 'app-estudiante-caracterizacion',
  templateUrl: './estudiante-caracterizacion.component.html',
  styleUrls: ['./estudiante-caracterizacion.component.css']
})
export class EstudianteCaracterizacionComponent implements IMessageComponent {
  userMessage: UserMessage = userMessageInit;
  nie:string = "";
  studentInfo?: StudentDetail;
  nombreUsuario:string = "";
  especialidad: string = "";
  readonlyInput:boolean = true;
  async goTo(link:string){
    if(link !== '' && link !== '#'){
      await this.router.navigate([link,  this.nie ]);
    }
  }
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceCOR: CatalogoServiceCor,
    private route: ActivatedRoute,
    private router: Router
  ){
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
    })

  }




}
