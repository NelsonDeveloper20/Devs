import { TestBed } from '@angular/core/testing';

import { UserchangesService } from './userchanges.service';

describe('UserchangesService', () => {
  let service: UserchangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserchangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
