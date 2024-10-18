import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetTarjetaInformeComponent } from './saet-tarjeta-informe.component';

describe('SaetTarjetaInformeComponent', () => {
  let component: SaetTarjetaInformeComponent;
  let fixture: ComponentFixture<SaetTarjetaInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetTarjetaInformeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetTarjetaInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
