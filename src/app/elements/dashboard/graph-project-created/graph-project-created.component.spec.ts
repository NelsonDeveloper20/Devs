import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphProjectCreatedComponent } from './graph-project-created.component';

describe('GraphProjectCreatedComponent', () => {
  let component: GraphProjectCreatedComponent;
  let fixture: ComponentFixture<GraphProjectCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphProjectCreatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphProjectCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
