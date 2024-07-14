import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetGraficaPastelComponent } from './saet-grafica-pastel.component';

describe('SaetGraficaPastelComponent', () => {
  let component: SaetGraficaPastelComponent;
  let fixture: ComponentFixture<SaetGraficaPastelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetGraficaPastelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetGraficaPastelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
