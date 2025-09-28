import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaMiniexcelComponent } from './carga-miniexcel.component';

describe('CargaMiniexcelComponent', () => {
  let component: CargaMiniexcelComponent;
  let fixture: ComponentFixture<CargaMiniexcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaMiniexcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaMiniexcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
