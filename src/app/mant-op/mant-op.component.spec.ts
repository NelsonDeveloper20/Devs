import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantOpComponent } from './mant-op.component';

describe('MantOpComponent', () => {
  let component: MantOpComponent;
  let fixture: ComponentFixture<MantOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantOpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
