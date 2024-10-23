import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaiAtencionPersonalizadaComponent } from './dai-atencion-personalizada.component';

describe('DaiAtencionPersonalizadaComponent', () => {
  let component: DaiAtencionPersonalizadaComponent;
  let fixture: ComponentFixture<DaiAtencionPersonalizadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaiAtencionPersonalizadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaiAtencionPersonalizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
