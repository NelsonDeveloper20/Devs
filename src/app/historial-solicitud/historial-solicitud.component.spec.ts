import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialSolicitudComponent } from './historial-solicitud.component';

describe('HistorialSolicitudComponent', () => {
  let component: HistorialSolicitudComponent;
  let fixture: ComponentFixture<HistorialSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
