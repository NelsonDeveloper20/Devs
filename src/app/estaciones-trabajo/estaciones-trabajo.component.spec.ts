import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionesTrabajoComponent } from './estaciones-trabajo.component';

describe('EstacionesTrabajoComponent', () => {
  let component: EstacionesTrabajoComponent;
  let fixture: ComponentFixture<EstacionesTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstacionesTrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstacionesTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
