import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesAdvComponent } from './solicitudes-adv.component';

describe('SolicitudesAdvComponent', () => {
  let component: SolicitudesAdvComponent;
  let fixture: ComponentFixture<SolicitudesAdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesAdvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesAdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
