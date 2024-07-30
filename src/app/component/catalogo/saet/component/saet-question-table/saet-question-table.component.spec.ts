import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetQuestionTableComponent } from './saet-question-table.component';

describe('SaetQuestionTableComponent', () => {
  let component: SaetQuestionTableComponent;
  let fixture: ComponentFixture<SaetQuestionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetQuestionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetQuestionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
