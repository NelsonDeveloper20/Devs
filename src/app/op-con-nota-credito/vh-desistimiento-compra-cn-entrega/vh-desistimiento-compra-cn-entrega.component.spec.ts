import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhDesistimientoCompraCnEntregaComponent } from './vh-desistimiento-compra-cn-entrega.component';

describe('VhDesistimientoCompraCnEntregaComponent', () => {
  let component: VhDesistimientoCompraCnEntregaComponent;
  let fixture: ComponentFixture<VhDesistimientoCompraCnEntregaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhDesistimientoCompraCnEntregaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhDesistimientoCompraCnEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
