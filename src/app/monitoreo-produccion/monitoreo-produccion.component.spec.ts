import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoProduccionComponent } from './monitoreo-produccion.component';

describe('MonitoreoProduccionComponent', () => {
  let component: MonitoreoProduccionComponent;
  let fixture: ComponentFixture<MonitoreoProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoreoProduccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
