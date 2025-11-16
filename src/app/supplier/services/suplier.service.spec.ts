import { TestBed } from '@angular/core/testing';

import { SuplierService } from './suplier.service';

describe('SuplierService', () => {
  let service: SuplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
