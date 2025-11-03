import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const isAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const path = router.parseUrl('/auth/login');
  return authService.token() ? true : new  RedirectCommand(path);
};
