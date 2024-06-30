import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaProdDialogComponent } from './linea-prod-dialog.component';

describe('LineaProdDialogComponent', () => {
  let component: LineaProdDialogComponent;
  let fixture: ComponentFixture<LineaProdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineaProdDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineaProdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
