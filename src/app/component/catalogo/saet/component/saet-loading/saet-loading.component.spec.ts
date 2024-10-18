import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetLoadingComponent } from './saet-loading.component';

describe('SaetLoadingComponent', () => {
  let component: SaetLoadingComponent;
  let fixture: ComponentFixture<SaetLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
