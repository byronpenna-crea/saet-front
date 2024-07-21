import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetTabAgendaComponent } from './saet-tab-agenda.component';

describe('SaetTabAgendaComponent', () => {
  let component: SaetTabAgendaComponent;
  let fixture: ComponentFixture<SaetTabAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetTabAgendaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetTabAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
