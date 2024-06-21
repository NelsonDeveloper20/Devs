import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMonitoreoDialogComponent } from './detalle-monitoreo-dialog.component';

describe('DetalleMonitoreoDialogComponent', () => {
  let component: DetalleMonitoreoDialogComponent;
  let fixture: ComponentFixture<DetalleMonitoreoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleMonitoreoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMonitoreoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
