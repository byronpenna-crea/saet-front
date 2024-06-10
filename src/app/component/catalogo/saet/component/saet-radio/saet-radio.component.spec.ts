import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetRadioComponent } from './saet-radio.component';

describe('SaetRadioComponent', () => {
  let component: SaetRadioComponent;
  let fixture: ComponentFixture<SaetRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetRadioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
