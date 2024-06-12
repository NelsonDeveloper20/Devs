import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMonthlyTargetComponent } from './graph-monthly-target.component';

describe('GraphMonthlyTargetComponent', () => {
  let component: GraphMonthlyTargetComponent;
  let fixture: ComponentFixture<GraphMonthlyTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphMonthlyTargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphMonthlyTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
