import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetTextAreaComponent } from './saet-text-area.component';

describe('SaetTextAreaComponent', () => {
  let component: SaetTextAreaComponent;
  let fixture: ComponentFixture<SaetTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetTextAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
