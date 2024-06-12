import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhAnulacionDevolucionClienteComponent } from './vh-anulacion-devolucion-cliente.component';

describe('VhAnulacionDevolucionClienteComponent', () => {
  let component: VhAnulacionDevolucionClienteComponent;
  let fixture: ComponentFixture<VhAnulacionDevolucionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhAnulacionDevolucionClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhAnulacionDevolucionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
