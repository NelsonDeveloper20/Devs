import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanestacionDialogComponent } from './scanestacion-dialog.component';

describe('ScanestacionDialogComponent', () => {
  let component: ScanestacionDialogComponent;
  let fixture: ComponentFixture<ScanestacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanestacionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanestacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
