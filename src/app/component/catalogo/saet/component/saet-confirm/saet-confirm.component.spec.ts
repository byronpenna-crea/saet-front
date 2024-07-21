import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetConfirmComponent } from './saet-confirm.component';

describe('SaetConfirmComponent', () => {
  let component: SaetConfirmComponent;
  let fixture: ComponentFixture<SaetConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetConfirmComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
