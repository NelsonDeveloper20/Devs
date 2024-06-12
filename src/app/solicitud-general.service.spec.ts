import { TestBed } from '@angular/core/testing';

import { SolicitudGeneralService } from './solicitud-general.service';

describe('SolicitudGeneralService', () => {
  let service: SolicitudGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
