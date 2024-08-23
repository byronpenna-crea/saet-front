import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteDaiCaracterizacionComponent } from './estudiante-dai-caracterizacion.component';

describe('EstudianteDaiCaracterizacionComponent', () => {
  let component: EstudianteDaiCaracterizacionComponent;
  let fixture: ComponentFixture<EstudianteDaiCaracterizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteDaiCaracterizacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteDaiCaracterizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
