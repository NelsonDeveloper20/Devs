import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaSnCruzadaComponent } from './carta-sn-cruzada.component';

describe('CartaSnCruzadaComponent', () => {
  let component: CartaSnCruzadaComponent;
  let fixture: ComponentFixture<CartaSnCruzadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartaSnCruzadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartaSnCruzadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
