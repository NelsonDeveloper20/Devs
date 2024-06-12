import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhCartaCruzadaComponent } from './vh-carta-cruzada.component';

describe('VhCartaCruzadaComponent', () => {
  let component: VhCartaCruzadaComponent;
  let fixture: ComponentFixture<VhCartaCruzadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhCartaCruzadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhCartaCruzadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
