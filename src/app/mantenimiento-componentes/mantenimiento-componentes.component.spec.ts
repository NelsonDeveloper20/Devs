import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoComponentesComponent } from './mantenimiento-componentes.component';

describe('MantenimientoComponentesComponent', () => {
  let component: MantenimientoComponentesComponent;
  let fixture: ComponentFixture<MantenimientoComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoComponentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
