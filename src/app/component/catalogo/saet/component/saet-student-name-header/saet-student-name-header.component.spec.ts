import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetStudentNameHeaderComponent } from './saet-student-name-header.component';

describe('SaetStudentNameHeaderComponent', () => {
  let component: SaetStudentNameHeaderComponent;
  let fixture: ComponentFixture<SaetStudentNameHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetStudentNameHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetStudentNameHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
