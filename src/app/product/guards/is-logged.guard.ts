import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';

export const isLoggedGuard: CanActivateFn = (route, state) => {
 const authService = inject(AuthService);
  const router = inject(Router);
  const path = router.parseUrl('/product');
  return authService.token() ? new  RedirectCommand(path) : true;
};
