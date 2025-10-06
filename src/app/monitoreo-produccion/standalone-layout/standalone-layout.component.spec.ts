import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandaloneLayoutComponent } from './standalone-layout.component';

describe('StandaloneLayoutComponent', () => {
  let component: StandaloneLayoutComponent;
  let fixture: ComponentFixture<StandaloneLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandaloneLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandaloneLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
