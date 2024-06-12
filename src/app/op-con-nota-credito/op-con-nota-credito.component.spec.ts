import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OPConNotaCreditoComponent } from './op-con-nota-credito.component';

describe('OPConNotaCreditoComponent', () => {
  let component: OPConNotaCreditoComponent;
  let fixture: ComponentFixture<OPConNotaCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OPConNotaCreditoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OPConNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
