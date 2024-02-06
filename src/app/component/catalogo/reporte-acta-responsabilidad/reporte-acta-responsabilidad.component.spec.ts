import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteActaResponsabilidadComponent } from './reporte-acta-responsabilidad.component';

describe('ReporteActaResponsabilidadComponent', () => {
  let component: ReporteActaResponsabilidadComponent;
  let fixture: ComponentFixture<ReporteActaResponsabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteActaResponsabilidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteActaResponsabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
