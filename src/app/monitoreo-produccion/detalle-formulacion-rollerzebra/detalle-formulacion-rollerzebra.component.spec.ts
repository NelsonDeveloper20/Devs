import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFormulacionRollerzebraComponent } from './detalle-formulacion-rollerzebra.component';

describe('DetalleFormulacionRollerzebraComponent', () => {
  let component: DetalleFormulacionRollerzebraComponent;
  let fixture: ComponentFixture<DetalleFormulacionRollerzebraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleFormulacionRollerzebraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleFormulacionRollerzebraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
