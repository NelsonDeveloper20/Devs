import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaProduccionComponent } from './linea-produccion.component';

describe('LineaProduccionComponent', () => {
  let component: LineaProduccionComponent;
  let fixture: ComponentFixture<LineaProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineaProduccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineaProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
