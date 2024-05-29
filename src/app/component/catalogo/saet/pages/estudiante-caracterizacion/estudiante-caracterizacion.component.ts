import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor, StudentDetail} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {IMessageComponent} from "../../interfaces/message-component.interface";

@Component({
  selector: 'app-estudiante-caracterizacion',
  templateUrl: './estudiante-caracterizacion.component.html',
  styleUrls: ['./estudiante-caracterizacion.component.css']
})
export class EstudianteCaracterizacionComponent implements IMessageComponent {
  nie:string = "";
  studentInfo?: StudentDetail;
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
    catalogoServiceCOR.getStudentInfo(this.nie).then((result) => {
      this.studentInfo = result.estudiante;
    })

  }

  showMessage: boolean = false;
  message: string = "";
  titleMessage: string = "";


}
