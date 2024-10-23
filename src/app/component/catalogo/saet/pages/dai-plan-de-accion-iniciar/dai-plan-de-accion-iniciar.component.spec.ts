import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaiPlanDeAccionIniciarComponent } from './dai-plan-de-accion-iniciar.component';

describe('DaiPlanDeAccionIniciarComponent', () => {
  let component: DaiPlanDeAccionIniciarComponent;
  let fixture: ComponentFixture<DaiPlanDeAccionIniciarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaiPlanDeAccionIniciarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaiPlanDeAccionIniciarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
