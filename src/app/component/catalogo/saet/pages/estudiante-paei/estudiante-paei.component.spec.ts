import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudiantePaeiComponent } from './estudiante-paei.component';

describe('EstudiantePaeiComponent', () => {
  let component: EstudiantePaeiComponent;
  let fixture: ComponentFixture<EstudiantePaeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudiantePaeiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudiantePaeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
