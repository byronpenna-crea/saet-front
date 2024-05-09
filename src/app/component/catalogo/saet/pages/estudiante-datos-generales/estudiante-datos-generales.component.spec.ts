import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteDatosGeneralesComponent } from './estudiante-datos-generales.component';

describe('EstudianteDatosGeneralesComponent', () => {
  let component: EstudianteDatosGeneralesComponent;
  let fixture: ComponentFixture<EstudianteDatosGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudianteDatosGeneralesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
