import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

import { sanitizeAppRedirectTarget } from './redirect.utils';

const isAccessAllowed = async (
  _route: Parameters<CanActivateFn>[0],
  state: Parameters<CanActivateFn>[1],
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  if (authData.authenticated) {
    return true;
  }

  const router = inject(Router);
  const redirectTo = sanitizeAppRedirectTarget(state.url, '/');

  return router.createUrlTree(['/'], {
    queryParams: redirectTo !== '/' ? { redirectTo } : undefined,
  });
};

export const canActivateAuthenticatedRoute = createAuthGuard<CanActivateFn>(isAccessAllowed);