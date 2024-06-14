import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisionDialogComponent } from './supervision-dialog.component';

describe('SupervisionDialogComponent', () => {
  let component: SupervisionDialogComponent;
  let fixture: ComponentFixture<SupervisionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
