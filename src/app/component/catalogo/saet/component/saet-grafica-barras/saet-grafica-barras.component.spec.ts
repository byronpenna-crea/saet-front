import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetGraficaBarrasComponent } from './saet-grafica-barras.component';

describe('SaetGraficaBarrasComponent', () => {
  let component: SaetGraficaBarrasComponent;
  let fixture: ComponentFixture<SaetGraficaBarrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetGraficaBarrasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetGraficaBarrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
