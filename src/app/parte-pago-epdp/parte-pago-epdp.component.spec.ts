import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartePagoEpdpComponent } from './parte-pago-epdp.component';

describe('PartePagoEpdpComponent', () => {
  let component: PartePagoEpdpComponent;
  let fixture: ComponentFixture<PartePagoEpdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartePagoEpdpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartePagoEpdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
