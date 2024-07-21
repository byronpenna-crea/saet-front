import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteCuestionarioLenguajeComponent } from './estudiante-cuestionario-lenguaje.component';

describe('EstudianteCuestionarioLenguajeComponent', () => {
  let component: EstudianteCuestionarioLenguajeComponent;
  let fixture: ComponentFixture<EstudianteCuestionarioLenguajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteCuestionarioLenguajeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteCuestionarioLenguajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
