import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCotizacionComponent } from './registro-cotizacion.component';

describe('RegistroCotizacionComponent', () => {
  let component: RegistroCotizacionComponent;
  let fixture: ComponentFixture<RegistroCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
