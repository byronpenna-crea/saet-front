import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutenticaComponent } from './autentica.component';

describe('AutenticaComponent', () => {
  let component: AutenticaComponent;
  let fixture: ComponentFixture<AutenticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutenticaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutenticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
