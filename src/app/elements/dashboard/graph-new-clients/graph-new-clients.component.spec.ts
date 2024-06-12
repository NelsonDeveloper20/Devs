import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphNewClientsComponent } from './graph-new-clients.component';

describe('GraphNewClientsComponent', () => {
  let component: GraphNewClientsComponent;
  let fixture: ComponentFixture<GraphNewClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphNewClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphNewClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
