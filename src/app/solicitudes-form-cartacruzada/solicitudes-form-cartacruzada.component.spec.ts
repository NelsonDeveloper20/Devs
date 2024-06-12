import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesFormCartacruzadaComponent } from './solicitudes-form-cartacruzada.component';

describe('SolicitudesFormCartacruzadaComponent', () => {
  let component: SolicitudesFormCartacruzadaComponent;
  let fixture: ComponentFixture<SolicitudesFormCartacruzadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesFormCartacruzadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesFormCartacruzadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
