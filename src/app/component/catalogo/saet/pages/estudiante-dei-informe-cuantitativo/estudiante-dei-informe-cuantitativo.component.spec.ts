import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteDeiInformeCuantitativoComponent } from './estudiante-dei-informe-cuantitativo.component';

describe('EstudianteDeiInformeCuantitativoComponent', () => {
  let component: EstudianteDeiInformeCuantitativoComponent;
  let fixture: ComponentFixture<EstudianteDeiInformeCuantitativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudianteDeiInformeCuantitativoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteDeiInformeCuantitativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
