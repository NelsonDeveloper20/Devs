import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMainUserComponent } from './home-main-user.component';

describe('HomeMainUserComponent', () => {
  let component: HomeMainUserComponent;
  let fixture: ComponentFixture<HomeMainUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeMainUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMainUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
