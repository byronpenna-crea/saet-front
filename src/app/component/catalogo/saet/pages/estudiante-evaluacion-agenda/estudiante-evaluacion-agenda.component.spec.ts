import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteEvaluacionAgendaComponent } from './estudiante-evaluacion-agenda.component';

describe('EstudianteEvaluacionAgendaComponent', () => {
  let component: EstudianteEvaluacionAgendaComponent;
  let fixture: ComponentFixture<EstudianteEvaluacionAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteEvaluacionAgendaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteEvaluacionAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
