import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteDeiInformeTrimestralComponent } from './estudiante-dei-informe-trimestral.component';

describe('EstudianteDeiInformeTrimestralComponent', () => {
  let component: EstudianteDeiInformeTrimestralComponent;
  let fixture: ComponentFixture<EstudianteDeiInformeTrimestralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteDeiInformeTrimestralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteDeiInformeTrimestralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
