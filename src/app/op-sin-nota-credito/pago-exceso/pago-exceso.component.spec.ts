import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoExcesoComponent } from './pago-exceso.component';

describe('PagoExcesoComponent', () => {
  let component: PagoExcesoComponent;
  let fixture: ComponentFixture<PagoExcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoExcesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoExcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
