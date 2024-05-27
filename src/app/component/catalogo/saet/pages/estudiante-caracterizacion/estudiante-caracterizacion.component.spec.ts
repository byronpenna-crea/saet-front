import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteCaracterizacionComponent } from './estudiante-caracterizacion.component';

describe('EstudianteCaracterizacionComponent', () => {
  let component: EstudianteCaracterizacionComponent;
  let fixture: ComponentFixture<EstudianteCaracterizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudianteCaracterizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteCaracterizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
