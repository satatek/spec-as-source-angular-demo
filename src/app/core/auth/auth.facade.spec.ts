import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import Keycloak from 'keycloak-js';
import { vi } from 'vitest';

import { AuthFacade } from './auth.facade';

describe('AuthFacade', () => {
  let keycloakMock: {
    authenticated: boolean;
    subject: string | undefined;
    tokenParsed: Record<string, unknown>;
    login: ReturnType<typeof vi.fn>;
    updateToken: ReturnType<typeof vi.fn>;
    loadUserProfile: ReturnType<typeof vi.fn>;
    clearToken: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    keycloakMock = {
      authenticated: true,
      subject: 'subject-123',
      tokenParsed: {
        preferred_username: 'casey',
        email: 'casey@example.com',
        email_verified: true,
      },
      login: vi.fn(async () => undefined),
      updateToken: vi.fn(async () => true),
      loadUserProfile: vi.fn(async () => ({
        username: 'casey',
        email: 'casey@example.com',
        firstName: 'Casey',
        lastName: 'Rivers',
        emailVerified: true,
      })),
      clearToken: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        provideRouter([]),
        {
          provide: Keycloak,
          useValue: keycloakMock,
        },
      ],
    });
  });

  it('restores an authenticated session from Keycloak on construction', () => {
    const facade = TestBed.inject(AuthFacade);

    expect(facade.session().status).toBe('authenticated');
    expect(facade.isAuthenticated()).toBe(true);
  });

  it('maps the loaded Keycloak profile into the home view model', async () => {
    const facade = TestBed.inject(AuthFacade);

    const profile = await facade.ensureProfileLoaded();

    expect(keycloakMock.updateToken).toHaveBeenCalledWith(30);
    expect(profile?.displayName).toBe('Casey Rivers');
    expect(profile?.email).toBe('casey@example.com');
  });

  it('clears the session and returns to the welcome page when profile loading fails', async () => {
    keycloakMock.loadUserProfile.mockRejectedValueOnce(new Error('profile failure'));
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const facade = TestBed.inject(AuthFacade);

    const profile = await facade.ensureProfileLoaded();

    expect(profile).toBeNull();
    expect(keycloakMock.clearToken).toHaveBeenCalledTimes(1);
    expect(facade.session().status).toBe('error');
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });
});