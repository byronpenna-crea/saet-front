import { Inject, Injectable, OnInit } from '@angular/core';
import {
  CatalogoServiceCor,
  IGetCaracterizacion,
  ResponseError,
  StudentDetail,
  StudentInfoResponse,
} from '../../../services/catalogo/catalogo.service.cor';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormMode,
  IQuestionaryAnswer,
  IValuesForm,
} from './QuestionsComponent';
import { IconComponent } from './shared/component.config';
import { ButtonStyle } from './component/saet-button/saet-button.component';
import { BaseComponent } from './BaseComponent';
import { CatalogoServiceDei } from '../../../services/catalogo/catalogo.service.dei';

export interface informationTabBody {
  values: string[];
}
@Injectable()
export class CorBaseComponent extends BaseComponent implements OnInit {
  caracterizacion: IGetCaracterizacion | undefined;
  readOnlyEvaluaciones = true;
  readOnlyPaei = true;
  async ngOnInit() {
    console.log('init');
  }
  public async initCaracterizacion(){
    try {
      if (this.nie === '') {
        console.log('here xxy');
        return;
      }
      const response = await this.catalogoServiceCOR.getCaracterizacionPorNIE(
        this.nie
      )

      this.caracterizacion = response;
      if (response.id_caracterizacion !== 0) {
        this.readOnlyPaei = false;
        this.readOnlyEvaluaciones = false;
      }
    } catch (ex) {
      console.log('caracterizacion por nie error');
      const error = ex as ResponseError;
      if (
        error.status === 404 &&
        (this.router.url.includes('/menu/saet-evaluaciones/') ||
          this.router.url.includes('/menu/saet-paei-detalle/') ||
          this.router.url.includes('/menu/saet-paei/'))
      ) {
        // await this.router.navigate([
        //   '/menu/saet-caracterizacion-estudiante',
        //   this.nie,
        // ]);
      }
      console.log('error ex base ', error.status);
    }
  }
  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected catalogoServiceCOR: CatalogoServiceCor,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super();
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
        console.log('la url es ', this.router.url);
        this.loadStudentInfo();
        this.initCaracterizacion();
      }
    });
    const dui = localStorage.getItem('dui') ?? '';
    if (dui !== '') {
      this.catalogoServiceCOR.getPersonaApoyoByDui(dui).then(persona => {
        console.log('--------- persona apoyo cor base ------------')
        console.log(persona);
        console.log(persona.rol_pk.rol);
        console.log(persona.sub_rol_fk.subcategoria);
        console.log('--------- persona apoyo cor base ------------')
        localStorage.setItem('id_persona', persona.per_fk.per_pk.toString());
        localStorage.setItem('especialidad', persona.sub_rol_fk.subcategoria);
        localStorage.setItem('rolApoyo', persona.rol_pk.rol);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  protected loadStudentInfo(): Promise<StudentInfoResponse> {
    return this.catalogoServiceCOR
      .getStudentInfo(this.nie)
      .then(result => {
        this.studentInfo = result.estudiante;
        return result;
      })
      .catch(e => {
        if (!this.router.url.includes('/menu/saet-buscar')) {
          this.router.navigate(['menu/saet-buscar']);
        }
        throw e;
      });
  }
}
