import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteCaracterizacionIniciarComponent } from './estudiante-caracterizacion-iniciar.component';

describe('EstudianteCaracterizacionIniciarComponent', () => {
  let component: EstudianteCaracterizacionIniciarComponent;
  let fixture: ComponentFixture<EstudianteCaracterizacionIniciarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudianteCaracterizacionIniciarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteCaracterizacionIniciarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
