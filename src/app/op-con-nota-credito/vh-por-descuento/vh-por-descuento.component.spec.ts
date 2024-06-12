import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhPorDescuentoComponent } from './vh-por-descuento.component';

describe('VhPorDescuentoComponent', () => {
  let component: VhPorDescuentoComponent;
  let fixture: ComponentFixture<VhPorDescuentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhPorDescuentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhPorDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
