import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoPerfilesComponent } from './mantenimiento-perfiles.component';

describe('MantenimientoPerfilesComponent', () => {
  let component: MantenimientoPerfilesComponent;
  let fixture: ComponentFixture<MantenimientoPerfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoPerfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoPerfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
