import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhDevolucionComponent } from './vh-devolucion.component';

describe('VhDevolucionComponent', () => {
  let component: VhDevolucionComponent;
  let fixture: ComponentFixture<VhDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhDevolucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
