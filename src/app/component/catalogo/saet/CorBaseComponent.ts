import { Inject, Injectable, OnInit } from '@angular/core';
import {
  CatalogoServiceCor,
  IGetCaracterizacion,
  ResponseError,
  StudentInfoResponse,
} from '../../../services/catalogo/catalogo.service.cor';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from './BaseComponent';
import { handleMode } from './shared/forms';
import { FormMode } from './QuestionsComponent';

export interface informationTabBody {
  values: string[];
}
@Injectable()
export class CorBaseComponent extends BaseComponent implements OnInit {
  caracterizacion: IGetCaracterizacion | undefined;
  readOnlyEvaluaciones = true;
  readOnlyPaei = true;
  async ngOnInit() {
    const dui = localStorage.getItem('dui') ?? '';
    console.log('dui en constructor es ', dui);
    if (dui !== '') {
      this.catalogoServiceCOR.getPersonaApoyoByDui(dui).then(persona => {

        console.log('persona logueada ', persona);
        localStorage.setItem('id_persona', persona.per_fk.per_pk.toString());

        if(persona.sub_rol_fk !== null){
          localStorage.setItem('id_especialidad', persona.sub_rol_fk.sub_rol_pk.toString());
          localStorage.setItem('especialidad', persona.sub_rol_fk.subcategoria);
        }else{
          localStorage.setItem('id_especialidad', '');
          localStorage.setItem('especialidad', '');
        }
        if(persona.rol_pk !== null){
          localStorage.setItem('idRolApoyo', persona.rol_pk.rol_pk.toString());
          localStorage.setItem('rolApoyo', persona.rol_pk.rol);
        }else{
          this.router.navigate(['/inicio'])
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  public async initCaracterizacion() {
    try {
      if (this.nie === '') {
        return;
      }
      const response = await this.catalogoServiceCOR.getCaracterizacionPorNIE(
        this.nie
      );

      this.caracterizacion = response;
      if (response.id_caracterizacion !== 0) {
        this.readOnlyPaei = false;
        this.readOnlyEvaluaciones = false;
      }
    } catch (ex) {
      const error = ex as ResponseError;
      if (
        error.status === 404 &&
        (this.router.url.includes('/menu/saet-evaluaciones/') ||
          this.router.url.includes('/menu/saet-paei-detalle/') ||
          this.router.url.includes('/menu/saet-paei/'))
      ) {
        await this.router.navigate([
          '/menu/saet-caracterizacion-estudiante',
          this.nie,
        ]);
      }
      console.log('error ex base ', error.status);
    }
  }
  caracterizacionLoaded;
  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected catalogoServiceCOR: CatalogoServiceCor,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super();
    this.caracterizacionLoaded = new Promise<void>((resolve) => {
      this.route.paramMap.subscribe(params => {
        const nie = params.get('nie');
        if (nie) {
          this.nie = nie;
          console.log('la url es ', this.router.url);
          this.loadStudentInfo();
          this.initCaracterizacion().then(() => {
            console.log('id caracterizacion on base --- ', this.caracterizacion?.id_caracterizacion);
            resolve(); // Resolvemos la promesa cuando 'id_caracterizacion' está disponible
          });
        }
      });
    });

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
