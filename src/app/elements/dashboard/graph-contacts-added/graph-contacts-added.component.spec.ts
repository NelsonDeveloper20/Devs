import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphContactsAddedComponent } from './graph-contacts-added.component';

describe('GraphContactsAddedComponent', () => {
  let component: GraphContactsAddedComponent;
  let fixture: ComponentFixture<GraphContactsAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphContactsAddedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphContactsAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
