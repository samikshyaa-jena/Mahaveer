import { TestBed } from '@angular/core/testing';

import { ErpServiceService } from './erp-service.service';

describe('ErpServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErpServiceService = TestBed.get(ErpServiceService);
    expect(service).toBeTruthy();
  });
});
