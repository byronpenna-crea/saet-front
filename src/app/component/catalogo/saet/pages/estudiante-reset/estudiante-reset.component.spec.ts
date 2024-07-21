import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteResetComponent } from './estudiante-reset.component';

describe('EstudianteResetComponent', () => {
  let component: EstudianteResetComponent;
  let fixture: ComponentFixture<EstudianteResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteResetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
