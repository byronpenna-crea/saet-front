import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteDeiInformeCualitativoComponent } from './estudiante-dei-informe-cualitativo.component';

describe('EstudianteDeiInformeCualitativoComponent', () => {
  let component: EstudianteDeiInformeCualitativoComponent;
  let fixture: ComponentFixture<EstudianteDeiInformeCualitativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteDeiInformeCualitativoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteDeiInformeCualitativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
