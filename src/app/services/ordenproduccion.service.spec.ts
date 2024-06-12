import { TestBed } from '@angular/core/testing';

import { OrdenproduccionService } from './ordenproduccion.service';

describe('OrdenproduccionService', () => {
  let service: OrdenproduccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenproduccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
