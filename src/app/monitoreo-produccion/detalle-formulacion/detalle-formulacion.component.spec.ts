import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFormulacionComponent } from './detalle-formulacion.component';

describe('DetalleFormulacionComponent', () => {
  let component: DetalleFormulacionComponent;
  let fixture: ComponentFixture<DetalleFormulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleFormulacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleFormulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
