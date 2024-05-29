import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetTabButtonsComponent } from './saet-tab-buttons.component';

describe('SaetTabButtonsComponent', () => {
  let component: SaetTabButtonsComponent;
  let fixture: ComponentFixture<SaetTabButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetTabButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetTabButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
