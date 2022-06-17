import { TestBed } from '@angular/core/testing';

import { SaleSrviceService } from './sale-srvice.service';

describe('SaleSrviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaleSrviceService = TestBed.get(SaleSrviceService);
    expect(service).toBeTruthy();
  });
});
