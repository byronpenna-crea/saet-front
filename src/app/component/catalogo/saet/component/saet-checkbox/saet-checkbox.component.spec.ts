import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetCheckboxComponent } from './saet-checkbox.component';

describe('SaetCheckboxComponent', () => {
  let component: SaetCheckboxComponent;
  let fixture: ComponentFixture<SaetCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
