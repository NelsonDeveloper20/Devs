import { TestBed } from '@angular/core/testing';

import { ActiveMenuService } from './active-menu.service';

describe('ActiveMenuService', () => {
  let service: ActiveMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
