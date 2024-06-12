import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricacionEstacionComponent } from './fabricacion-estacion.component';

describe('FabricacionEstacionComponent', () => {
  let component: FabricacionEstacionComponent;
  let fixture: ComponentFixture<FabricacionEstacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabricacionEstacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricacionEstacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
