import { TestBed } from '@angular/core/testing';

import { TaxUtilService } from './tax-util.service';

describe('TaxUtilService', () => {
  let service: TaxUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
