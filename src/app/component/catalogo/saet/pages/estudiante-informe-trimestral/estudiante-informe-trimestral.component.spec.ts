import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteInformeTrimestralComponent } from './estudiante-informe-trimestral.component';

describe('EstudianteInformeTrimestralComponent', () => {
  let component: EstudianteInformeTrimestralComponent;
  let fixture: ComponentFixture<EstudianteInformeTrimestralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteInformeTrimestralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteInformeTrimestralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
