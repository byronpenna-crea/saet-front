import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetUnderlinedTitleComponent } from './saet-underlined-title.component';

describe('SaetUnderlinedTitleComponent', () => {
  let component: SaetUnderlinedTitleComponent;
  let fixture: ComponentFixture<SaetUnderlinedTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetUnderlinedTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetUnderlinedTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
