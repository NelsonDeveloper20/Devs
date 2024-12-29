import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSalidaEntradaSapComponent } from './detalle-salida-entrada-sap.component';

describe('DetalleSalidaEntradaSapComponent', () => {
  let component: DetalleSalidaEntradaSapComponent;
  let fixture: ComponentFixture<DetalleSalidaEntradaSapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSalidaEntradaSapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSalidaEntradaSapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
