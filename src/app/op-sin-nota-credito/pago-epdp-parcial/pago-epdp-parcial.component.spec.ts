import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoEpdpParcialComponent } from './pago-epdp-parcial.component';

describe('PagoEpdpParcialComponent', () => {
  let component: PagoEpdpParcialComponent;
  let fixture: ComponentFixture<PagoEpdpParcialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoEpdpParcialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoEpdpParcialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
