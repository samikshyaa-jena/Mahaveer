import { TestBed } from '@angular/core/testing';

import { AadharPayService } from './aadhar-pay.service';

describe('AadharPayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AadharPayService = TestBed.get(AadharPayService);
    expect(service).toBeTruthy();
  });
});
