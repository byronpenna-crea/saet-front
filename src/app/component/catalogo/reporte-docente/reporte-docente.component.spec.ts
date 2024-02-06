import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDocenteComponent } from './reporte-docente.component';

describe('ReporteDocenteComponent', () => {
  let component: ReporteDocenteComponent;
  let fixture: ComponentFixture<ReporteDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteDocenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
