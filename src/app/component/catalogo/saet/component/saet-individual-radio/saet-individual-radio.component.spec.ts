import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetIndividualRadioComponent } from './saet-individual-radio.component';

describe('SaetIndividualRadioComponent', () => {
  let component: SaetIndividualRadioComponent;
  let fixture: ComponentFixture<SaetIndividualRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetIndividualRadioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetIndividualRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
