import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetButtonComponent } from './saet-button.component';

describe('SaetButtonComponent', () => {
  let component: SaetButtonComponent;
  let fixture: ComponentFixture<SaetButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
