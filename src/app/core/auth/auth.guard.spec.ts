import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot } from '@angular/router';
import Keycloak from 'keycloak-js';

import { canActivateAuthenticatedRoute } from './auth.guard';

describe('canActivateAuthenticatedRoute', () => {
  it('allows navigation when the Keycloak session is authenticated', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: Keycloak,
          useValue: {
            authenticated: true,
            resourceAccess: undefined,
            realmAccess: undefined,
          },
        },
      ],
    });

    const result = await TestBed.runInInjectionContext(() =>
      canActivateAuthenticatedRoute({} as ActivatedRouteSnapshot, { url: '/home' } as RouterStateSnapshot)
    );

    expect(result).toBe(true);
  });

  it('redirects anonymous requests for the home route back to the welcome page', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: Keycloak,
          useValue: {
            authenticated: false,
            resourceAccess: undefined,
            realmAccess: undefined,
          },
        },
      ],
    });

    const router = TestBed.inject(Router);
    const result = await TestBed.runInInjectionContext(() =>
      canActivateAuthenticatedRoute({} as ActivatedRouteSnapshot, { url: '/home' } as RouterStateSnapshot)
    );

    expect(result).not.toBe(true);
    expect(router.serializeUrl(result as ReturnType<typeof router.createUrlTree>)).toBe('/?redirectTo=%2Fhome');
  });
});