import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCotizacionsComponent } from './registro-cotizacions.component';

describe('RegistroCotizacionsComponent', () => {
  let component: RegistroCotizacionsComponent;
  let fixture: ComponentFixture<RegistroCotizacionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCotizacionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCotizacionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
