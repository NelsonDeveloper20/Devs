import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhDesistimientoCompraSnEntregaComponent } from './vh-desistimiento-compra-sn-entrega.component';

describe('VhDesistimientoCompraSnEntregaComponent', () => {
  let component: VhDesistimientoCompraSnEntregaComponent;
  let fixture: ComponentFixture<VhDesistimientoCompraSnEntregaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhDesistimientoCompraSnEntregaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhDesistimientoCompraSnEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
