import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetGlobalHeaderComponent } from './saet-global-header.component';

describe('SaetGlobalHeaderComponent', () => {
  let component: SaetGlobalHeaderComponent;
  let fixture: ComponentFixture<SaetGlobalHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetGlobalHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetGlobalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
