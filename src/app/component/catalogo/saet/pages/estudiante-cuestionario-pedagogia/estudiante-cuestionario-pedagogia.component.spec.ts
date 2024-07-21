import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteCuestionarioPedagogiaComponent } from './estudiante-cuestionario-pedagogia.component';

describe('EstudianteCuestionarioPedagogiaComponent', () => {
  let component: EstudianteCuestionarioPedagogiaComponent;
  let fixture: ComponentFixture<EstudianteCuestionarioPedagogiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteCuestionarioPedagogiaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteCuestionarioPedagogiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
