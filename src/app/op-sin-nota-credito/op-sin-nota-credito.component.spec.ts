import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OPSinNotaCreditoComponent } from './op-sin-nota-credito.component';

describe('OPSinNotaCreditoComponent', () => {
  let component: OPSinNotaCreditoComponent;
  let fixture: ComponentFixture<OPSinNotaCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OPSinNotaCreditoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OPSinNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
