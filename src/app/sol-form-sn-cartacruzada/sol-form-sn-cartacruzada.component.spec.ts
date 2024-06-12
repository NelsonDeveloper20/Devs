import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolFormSnCartacruzadaComponent } from './sol-form-sn-cartacruzada.component';

describe('SolFormSnCartacruzadaComponent', () => {
  let component: SolFormSnCartacruzadaComponent;
  let fixture: ComponentFixture<SolFormSnCartacruzadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolFormSnCartacruzadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolFormSnCartacruzadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
