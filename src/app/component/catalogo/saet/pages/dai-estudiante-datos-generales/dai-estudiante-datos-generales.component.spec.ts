import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaiEstudianteDatosGeneralesComponent } from './dai-estudiante-datos-generales.component';

describe('DaiEstudianteDatosGeneralesComponent', () => {
  let component: DaiEstudianteDatosGeneralesComponent;
  let fixture: ComponentFixture<DaiEstudianteDatosGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DaiEstudianteDatosGeneralesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DaiEstudianteDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
