import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhAnulacionNuevocomprobanteComponent } from './vh-anulacion-nuevocomprobante.component';

describe('VhAnulacionNuevocomprobanteComponent', () => {
  let component: VhAnulacionNuevocomprobanteComponent;
  let fixture: ComponentFixture<VhAnulacionNuevocomprobanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhAnulacionNuevocomprobanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhAnulacionNuevocomprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
