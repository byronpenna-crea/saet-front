import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetQuestionComponent } from './saet-question.component';

describe('SaetQuestionComponent', () => {
  let component: SaetQuestionComponent;
  let fixture: ComponentFixture<SaetQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaetQuestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaetQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
