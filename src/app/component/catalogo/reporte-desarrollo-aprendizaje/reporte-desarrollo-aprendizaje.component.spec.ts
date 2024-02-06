import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDesarrolloAprendizajeComponent } from './reporte-desarrollo-aprendizaje.component';

describe('ReporteDesarrolloAprendizajeComponent', () => {
  let component: ReporteDesarrolloAprendizajeComponent;
  let fixture: ComponentFixture<ReporteDesarrolloAprendizajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteDesarrolloAprendizajeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDesarrolloAprendizajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
