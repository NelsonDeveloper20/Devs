import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhAnulacioFacturanDevolucionClienteComponent } from './vh-anulacion-factura-devolucion-cliente.component';

describe('VhAnulacioFacturanDevolucionClienteComponent', () => {
  let component: VhAnulacioFacturanDevolucionClienteComponent;
  let fixture: ComponentFixture<VhAnulacioFacturanDevolucionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhAnulacioFacturanDevolucionClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhAnulacioFacturanDevolucionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
