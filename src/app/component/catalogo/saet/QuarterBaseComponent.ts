import { Inject, Injectable, OnInit } from '@angular/core';
import { BaseComponent } from './BaseComponent';
import { DOCUMENT } from '@angular/common';
import {
  CatalogoServiceCor,
  StudentInfoResponse,
} from '../../../services/catalogo/catalogo.service.cor';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogoServiceQuarterReport } from '../../../services/catalogo/catalogo.service.quater_report';

@Injectable()
export class QuarterBaseComponent extends BaseComponent implements OnInit {
  ngOnInit(): void {}
  protected loadStudentInfo(): Promise<StudentInfoResponse> {
    return this.catalogoServiceQuarterReport
      .getStudentInfo(this.nie)
      .then(result => {
        this.studentInfo = result.estudiante;
        return result;
      })
      .catch(e => {
        this.router.navigate(['menu/saet-buscar']);
        throw e;
      });
  }

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected catalogoServiceQuarterReport: CatalogoServiceQuarterReport,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super();
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
        this.loadStudentInfo();
      }
    });
  }
}
