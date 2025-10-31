import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isTwoFactorGuard } from './is-two-factor.guard';

describe('isTwoFactorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isTwoFactorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
