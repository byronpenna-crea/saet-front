import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetTabComponent } from './saet-tab.component';

describe('SaetTabComponent', () => {
  let component: SaetTabComponent;
  let fixture: ComponentFixture<SaetTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
