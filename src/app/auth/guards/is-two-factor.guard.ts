import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isTwoFactorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log(state);
  const loginPath = router.parseUrl("/auth/login");
  return authService.authStatus()==='2FA' ? true : new RedirectCommand(loginPath);
};
