import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteGraficasComponent } from './estudiante-graficas.component';

describe('EstudianteGraficasComponent', () => {
  let component: EstudianteGraficasComponent;
  let fixture: ComponentFixture<EstudianteGraficasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteGraficasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteGraficasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
