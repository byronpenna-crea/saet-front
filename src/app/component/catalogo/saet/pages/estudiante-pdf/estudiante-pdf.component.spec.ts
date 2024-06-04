import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudiantePdfComponent } from './estudiante-pdf.component';

describe('EstudiantePdfComponent', () => {
  let component: EstudiantePdfComponent;
  let fixture: ComponentFixture<EstudiantePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudiantePdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudiantePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
