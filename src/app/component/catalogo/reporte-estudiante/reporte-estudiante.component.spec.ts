import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEstudianteComponent } from './reporte-estudiante.component';

describe('ReporteEstudianteComponent', () => {
  let component: ReporteEstudianteComponent;
  let fixture: ComponentFixture<ReporteEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
