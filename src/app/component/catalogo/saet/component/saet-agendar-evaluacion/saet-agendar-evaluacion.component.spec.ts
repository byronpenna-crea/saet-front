import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetAgendarEvaluacionComponent } from './saet-agendar-evaluacion.component';

describe('SaetAgendarEvaluacionComponent', () => {
  let component: SaetAgendarEvaluacionComponent;
  let fixture: ComponentFixture<SaetAgendarEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetAgendarEvaluacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetAgendarEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
