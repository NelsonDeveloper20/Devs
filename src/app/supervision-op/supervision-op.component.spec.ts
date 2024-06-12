import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisionOpComponent } from './supervision-op.component';

describe('SupervisionOpComponent', () => {
  let component: SupervisionOpComponent;
  let fixture: ComponentFixture<SupervisionOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisionOpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
