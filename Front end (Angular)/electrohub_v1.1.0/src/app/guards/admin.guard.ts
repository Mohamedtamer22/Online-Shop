import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminGuard: CanActivateFn = () => {
  const adminAuthService = inject(AdminAuthService);
  const router = inject(Router);

  return adminAuthService.isAdminLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => isLoggedIn ? true : router.createUrlTree(['/admin-login']))
  );
};
