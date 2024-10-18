import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetFormTableComponent } from './saet-form-table.component';

describe('SaetFormTableComponent', () => {
  let component: SaetFormTableComponent;
  let fixture: ComponentFixture<SaetFormTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetFormTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetFormTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
