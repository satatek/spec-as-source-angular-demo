import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { WelcomePageComponent } from './welcome-page.component';
import { WelcomePageFacade } from './welcome-page.facade';

describe('WelcomePageComponent', () => {
  const session = signal({
    status: 'anonymous',
    isAuthenticated: false,
    loginUrlRequested: false,
    lastErrorMessage: null as string | null,
    redirectTarget: null as string | null,
  });
  const isAuthenticated = signal(false);
  const dismissError = vi.fn();

  beforeEach(async () => {
    dismissError.mockClear();
    session.set({
      status: 'anonymous',
      isAuthenticated: false,
      loginUrlRequested: false,
      lastErrorMessage: null,
      redirectTarget: null,
    });
    isAuthenticated.set(false);

    await TestBed.configureTestingModule({
      imports: [WelcomePageComponent],
      providers: [
        provideRouter([]),
        {
          provide: WelcomePageFacade,
          useValue: {
            session,
            isAuthenticated,
            isChecking: () => session().status === 'checking',
            errorMessage: () => session().lastErrorMessage,
            dismissError,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the welcome content without page-level sign-in action', () => {
    const fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('friendly demo page');
    expect(compiled.textContent).not.toContain('Sign in with Keycloak');
    expect(compiled.querySelector('[data-testid="welcome-page"]')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="welcome-hero-card"]')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="welcome-details-card"]')).not.toBeNull();
  });

  it('keeps themed structure order with hero content before details content', () => {
    const fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('mat-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]?.getAttribute('data-testid')).toBe('welcome-hero-card');
    expect(cards[1]?.getAttribute('data-testid')).toBe('welcome-details-card');
  });

  it('uses Material theme tokens in component styles and avoids legacy hardcoded colors', () => {
    const fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();

    const styles = Array.from(document.querySelectorAll('style'))
      .map((styleElement) => styleElement.textContent ?? '')
      .join('\n');

    expect(styles).toContain('--mat-sys-surface');
    expect(styles).toContain('--mat-sys-on-surface');
    expect(styles).not.toContain('#f7f8fc');
    expect(styles).not.toContain('#eef2f7');
    expect(styles).not.toContain('#5b5bd6');
  });

  it('keeps page markup content-only without duplicated shell landmarks', () => {
    const fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')).toBeNull();
    expect(compiled.querySelector('footer')).toBeNull();
    expect(compiled.querySelector('nav')).toBeNull();
  });

  it('renders a recoverable status message when sign-in fails', () => {
    session.set({
      ...session(),
      status: 'error',
      lastErrorMessage: 'Keycloak login was cancelled.',
    });

    const fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sign-in did not complete.');
    expect(compiled.textContent).toContain('Keycloak login was cancelled.');

    const statusBanner = compiled.querySelector('[data-testid="welcome-status-banner"]');
    expect(statusBanner?.getAttribute('role')).toBe('status');
    expect(statusBanner?.getAttribute('aria-live')).toBe('polite');
  });

  it('shows progress bar while session status is checking', () => {
    session.set({
      ...session(),
      status: 'checking',
    });

    const fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="welcome-progress"]')).not.toBeNull();
  });

  it('redirects authenticated users to the home page', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    isAuthenticated.set(true);
    session.set({
      ...session(),
      status: 'authenticated',
      isAuthenticated: true,
      redirectTarget: '/home',
    });

    TestBed.createComponent(WelcomePageComponent).detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith('/home');
  });

  it('redirects authenticated users to a safe query redirect target', () => {
    TestBed.resetTestingModule();

    const navigateByUrl = vi.fn().mockResolvedValue(true);
    const localSession = signal({
      status: 'authenticated',
      isAuthenticated: true,
      loginUrlRequested: false,
      lastErrorMessage: null as string | null,
      redirectTarget: '/home',
    });

    TestBed.configureTestingModule({
      imports: [WelcomePageComponent],
      providers: [
        provideRouter([]),
        {
          provide: Router,
          useValue: {
            navigateByUrl,
          },
        },
        {
          provide: WelcomePageFacade,
          useValue: {
            session: localSession,
            isAuthenticated: signal(true),
            isChecking: () => false,
            errorMessage: () => null,
            dismissError: vi.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => (key === 'redirectTo' ? 'https://example.com/evil' : null),
              },
            },
          },
        },
      ],
    });

    TestBed.createComponent(WelcomePageComponent).detectChanges();

    expect(navigateByUrl).toHaveBeenCalledWith('/home');
  });
});