import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetInputComponent } from './saet-input.component';

describe('SaetInputComponent', () => {
  let component: SaetInputComponent;
  let fixture: ComponentFixture<SaetInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
