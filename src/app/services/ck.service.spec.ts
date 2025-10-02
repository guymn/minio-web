import { TestBed } from '@angular/core/testing';

import { CkService } from '../ck.service';

describe('CkService', () => {
  let service: CkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
