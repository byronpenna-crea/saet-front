import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteEvaluacionesComponent } from './estudiante-evaluaciones.component';

describe('EstudianteEvaluacionesComponent', () => {
  let component: EstudianteEvaluacionesComponent;
  let fixture: ComponentFixture<EstudianteEvaluacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudianteEvaluacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
