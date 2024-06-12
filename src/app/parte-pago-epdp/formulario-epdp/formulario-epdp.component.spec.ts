import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEpdpComponent } from './formulario-epdp.component';

describe('FormularioEpdpComponent', () => {
  let component: FormularioEpdpComponent;
  let fixture: ComponentFixture<FormularioEpdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioEpdpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioEpdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
