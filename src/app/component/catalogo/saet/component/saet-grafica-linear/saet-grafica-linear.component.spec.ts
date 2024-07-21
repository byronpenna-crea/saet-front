import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetGraficaLinearComponent } from './saet-grafica-linear.component';

describe('SaetGraficaLinearComponent', () => {
  let component: SaetGraficaLinearComponent;
  let fixture: ComponentFixture<SaetGraficaLinearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetGraficaLinearComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetGraficaLinearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
