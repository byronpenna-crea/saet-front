import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteNoValidoComponent } from './estudiante-no-valido.component';

describe('EstudianteNoValidoComponent', () => {
  let component: EstudianteNoValidoComponent;
  let fixture: ComponentFixture<EstudianteNoValidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteNoValidoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteNoValidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
