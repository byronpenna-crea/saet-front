import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetInicioComponent } from './saet-inicio.component';

describe('SaetInicioComponent', () => {
  let component: SaetInicioComponent;
  let fixture: ComponentFixture<SaetInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetInicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
