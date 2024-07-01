import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteDetallePaeiComponent } from './estudiante-detalle-paei.component';

describe('EstudianteDetallePaeiComponent', () => {
  let component: EstudianteDetallePaeiComponent;
  let fixture: ComponentFixture<EstudianteDetallePaeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudianteDetallePaeiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteDetallePaeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
