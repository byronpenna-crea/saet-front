import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaetMensajeUsuarioComponent } from './saet-mensaje-usuario.component';

describe('SaetMensajeUsuarioComponent', () => {
  let component: SaetMensajeUsuarioComponent;
  let fixture: ComponentFixture<SaetMensajeUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaetMensajeUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaetMensajeUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
