import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteCuestionarioPsicologiaComponent } from './estudiante-cuestionario-psicologia.component';

describe('EstudianteCuestionarioPsicologiaComponent', () => {
  let component: EstudianteCuestionarioPsicologiaComponent;
  let fixture: ComponentFixture<EstudianteCuestionarioPsicologiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteCuestionarioPsicologiaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      EstudianteCuestionarioPsicologiaComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
