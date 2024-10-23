import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaiPlanDeAccionComponent } from './dai-plan-de-accion.component';

describe('DaiPlanDeAccionComponent', () => {
  let component: DaiPlanDeAccionComponent;
  let fixture: ComponentFixture<DaiPlanDeAccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaiPlanDeAccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaiPlanDeAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
