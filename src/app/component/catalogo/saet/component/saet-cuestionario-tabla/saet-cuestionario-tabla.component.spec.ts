import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetCuestionarioTablaComponent } from './saet-cuestionario-tabla.component';

describe('SaetCuestionarioTablaComponent', () => {
  let component: SaetCuestionarioTablaComponent;
  let fixture: ComponentFixture<SaetCuestionarioTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetCuestionarioTablaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetCuestionarioTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
