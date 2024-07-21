import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetTableComponent } from './saet-table.component';

describe('SaetTableComponent', () => {
  let component: SaetTableComponent;
  let fixture: ComponentFixture<SaetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
