import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarModuloDialogComponent } from './asignar-modulo-dialog.component';

describe('AsignarModuloDialogComponent', () => {
  let component: AsignarModuloDialogComponent;
  let fixture: ComponentFixture<AsignarModuloDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarModuloDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarModuloDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
