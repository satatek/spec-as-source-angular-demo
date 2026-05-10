import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AuthFacade } from '../../core/auth/auth.facade';
import { KeycloakProfileViewModel } from '../../core/auth/profile.models';
import { AccountPageComponent } from './account-page.component';

describe('AccountPageComponent', () => {
  const ensureProfileLoaded = vi.fn(async () => null);
  const session = signal({
    status: 'authenticated',
    isAuthenticated: true,
    loginUrlRequested: false,
    lastErrorMessage: null as string | null,
    redirectTarget: '/home',
  });
  const profile = signal<KeycloakProfileViewModel | null>(null);
  const isProfileLoading = signal(false);

  beforeEach(async () => {
    ensureProfileLoaded.mockClear();
    profile.set({
      subject: 'user-123',
      displayName: 'Casey Rivers',
      username: 'casey',
      email: 'casey@example.com',
      emailVerified: true,
      firstName: 'Casey',
      lastName: 'Rivers',
    });
    isProfileLoading.set(false);

    await TestBed.configureTestingModule({
      imports: [AccountPageComponent],
      providers: [
        {
          provide: AuthFacade,
          useValue: {
            session,
            profile,
            isProfileLoading,
            ensureProfileLoaded,
          },
        },
      ],
    }).compileComponents();
  });

  it('loads the profile and renders the account summary', () => {
    const fixture = TestBed.createComponent(AccountPageComponent);
    fixture.detectChanges();

    expect(ensureProfileLoaded).toHaveBeenCalledTimes(1);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Your logged-in profile');
    expect(compiled.textContent).toContain('casey@example.com');
    expect(compiled.textContent).not.toContain('Log off');
    expect(compiled.querySelector('[data-testid="account-page"]')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="account-summary-card"]')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="account-profile-card"]')).not.toBeNull();
  });

  it('uses Material theme tokens in component styles and avoids legacy hardcoded colors', () => {
    const fixture = TestBed.createComponent(AccountPageComponent);
    fixture.detectChanges();

    const styles = Array.from(document.querySelectorAll('style'))
      .map((styleElement) => styleElement.textContent ?? '')
      .join('\n');

    expect(styles).toContain('--mat-sys-surface');
    expect(styles).toContain('--mat-sys-on-surface');
    expect(styles).not.toContain('#6b7c93');
    expect(styles).not.toContain('#4d617d');
  });

  it('shows a polite loading state while profile is being fetched', () => {
    isProfileLoading.set(true);

    const fixture = TestBed.createComponent(AccountPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const loading = compiled.querySelector('[data-testid="account-loading-state"]');
    expect(loading).not.toBeNull();
    expect(loading?.getAttribute('role')).toBe('status');
    expect(loading?.getAttribute('aria-live')).toBe('polite');
  });

  it('shows a recoverable warning state when session has an error', () => {
    session.set({
      ...session(),
      status: 'error',
      lastErrorMessage: 'Unable to refresh your profile right now.',
    });

    const fixture = TestBed.createComponent(AccountPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Unable to refresh your profile right now.');

    const warning = compiled.querySelector('[data-testid="account-warning-state"]');
    expect(warning?.getAttribute('role')).toBe('status');
    expect(warning?.getAttribute('aria-live')).toBe('polite');
  });

  it('keeps page markup content-only without duplicated shell landmarks', () => {
    const fixture = TestBed.createComponent(AccountPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')).toBeNull();
    expect(compiled.querySelector('footer')).toBeNull();
    expect(compiled.querySelector('nav')).toBeNull();
  });
});