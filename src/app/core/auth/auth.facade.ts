import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import Keycloak, { KeycloakProfile } from 'keycloak-js';

import { AuthSessionState, initialAuthSessionState } from './auth.models';
import { KeycloakProfileViewModel } from './profile.models';
import { sanitizeAppRedirectTarget } from './redirect.utils';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly keycloak = inject(Keycloak);
  private readonly router = inject(Router);

  private readonly sessionState = signal<AuthSessionState>(initialAuthSessionState);
  private readonly profileState = signal<KeycloakProfileViewModel | null>(null);
  private readonly profileLoadingState = signal(false);

  readonly session = this.sessionState.asReadonly();
  readonly profile = this.profileState.asReadonly();
  readonly isProfileLoading = this.profileLoadingState.asReadonly();
  readonly isAuthenticated = computed(() => this.sessionState().isAuthenticated);

  constructor() {
    this.syncSessionFromKeycloak();
  }

  syncSessionFromKeycloak(): void {
    const authenticated = this.keycloak.authenticated ?? false;

    this.sessionState.set({
      status: authenticated ? 'authenticated' : 'anonymous',
      isAuthenticated: authenticated,
      loginUrlRequested: false,
      lastErrorMessage: null,
      redirectTarget: authenticated ? '/home' : null,
    });

    if (!authenticated) {
      this.profileState.set(null);
    }
  }

  async login(redirectTarget = '/home'): Promise<void> {
    const safeRedirectTarget = sanitizeAppRedirectTarget(redirectTarget);

    this.sessionState.update((session) => ({
      ...session,
      status: 'checking',
      loginUrlRequested: true,
      redirectTarget: safeRedirectTarget,
      lastErrorMessage: null,
    }));

    await this.keycloak.login({
      redirectUri: `${window.location.origin}${safeRedirectTarget}`,
    });
  }

  clearError(): void {
    this.sessionState.update((session) => ({
      ...session,
      status: session.isAuthenticated ? 'authenticated' : 'anonymous',
      lastErrorMessage: null,
    }));
  }

  async ensureProfileLoaded(): Promise<KeycloakProfileViewModel | null> {
    if (!this.keycloak.authenticated) {
      this.sessionState.set({
        status: 'anonymous',
        isAuthenticated: false,
        loginUrlRequested: false,
        lastErrorMessage: null,
        redirectTarget: '/',
      });
      this.profileState.set(null);
      return null;
    }

    this.profileLoadingState.set(true);

    try {
      await this.keycloak.updateToken(30);
      const profile = await this.keycloak.loadUserProfile();
      const mappedProfile = mapKeycloakProfile(this.keycloak, profile);

      this.profileState.set(mappedProfile);
      this.sessionState.set({
        status: 'authenticated',
        isAuthenticated: true,
        loginUrlRequested: false,
        lastErrorMessage: null,
        redirectTarget: '/home',
      });

      return mappedProfile;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Your session could not be restored. Please sign in again.');

      this.handleProtectedRouteFailure(errorMessage);
      return null;
    } finally {
      this.profileLoadingState.set(false);
    }
  }

  async handleProtectedRouteFailure(message: string): Promise<void> {
    this.profileState.set(null);
    this.sessionState.set({
      status: 'error',
      isAuthenticated: false,
      loginUrlRequested: false,
      lastErrorMessage: message,
      redirectTarget: '/',
    });

    this.keycloak.clearToken();
    await this.router.navigateByUrl('/');
  }
}

function mapKeycloakProfile(keycloak: Keycloak, profile: KeycloakProfile): KeycloakProfileViewModel {
  const tokenParsed = keycloak.tokenParsed ?? {};
  const username = profile.username ?? readStringClaim(tokenParsed['preferred_username']);
  const email = profile.email ?? readStringClaim(tokenParsed['email']);
  const firstName = profile.firstName ?? readStringClaim(tokenParsed['given_name']);
  const lastName = profile.lastName ?? readStringClaim(tokenParsed['family_name']);
  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim() || username || email || 'Authenticated user';

  return {
    subject: keycloak.subject ?? readStringClaim(tokenParsed['sub']) ?? 'unknown-subject',
    displayName,
    username,
    email,
    emailVerified: profile.emailVerified ?? readBooleanClaim(tokenParsed['email_verified']),
    firstName,
    lastName,
  };
}

function readStringClaim(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function readBooleanClaim(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}