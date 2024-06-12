import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhCambioDatosBoletaComponent } from './vh-cambio-datos-boleta.component';

describe('VhCambioDatosBoletaComponent', () => {
  let component: VhCambioDatosBoletaComponent;
  let fixture: ComponentFixture<VhCambioDatosBoletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhCambioDatosBoletaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhCambioDatosBoletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
