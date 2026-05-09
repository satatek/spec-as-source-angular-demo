import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { HomePageComponent } from './home-page.component';
import { AuthFacade } from '../../core/auth/auth.facade';
import { KeycloakProfileViewModel } from '../../core/auth/profile.models';

describe('HomePageComponent', () => {
  const ensureProfileLoaded = vi.fn(async () => null);
  const logout = vi.fn(async (_redirectTarget?: string) => undefined);
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
    logout.mockClear();
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
      imports: [HomePageComponent],
      providers: [
        {
          provide: AuthFacade,
          useValue: {
            session,
            profile,
            isProfileLoading,
            ensureProfileLoaded,
            logout,
          },
        },
      ],
    }).compileComponents();
  });

  it('loads the Keycloak profile when the component is created', () => {
    TestBed.createComponent(HomePageComponent).detectChanges();

    expect(ensureProfileLoaded).toHaveBeenCalledTimes(1);
  });

  it('renders a personalized greeting and profile details', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome, Casey Rivers.');
    expect(compiled.textContent).toContain('casey@example.com');
    expect(compiled.textContent).not.toContain('Log off');
    expect(compiled.textContent).toContain('funny and happy things happening in the demo');
  });

  it('keeps page markup content-only without duplicated shell landmarks', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')).toBeNull();
    expect(compiled.querySelector('footer')).toBeNull();
    expect(compiled.querySelector('nav')).toBeNull();
  });

  it('shows a fallback warning when profile data is incomplete', () => {
    profile.set({
      subject: 'user-123',
      displayName: 'casey',
      username: 'casey',
      email: null,
      emailVerified: null,
      firstName: null,
      lastName: null,
    });

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Some profile fields are not available from Keycloak');
    expect(compiled.textContent).toContain('Not provided');
  });

  it('shows retryable logout feedback and disables the action while sign-out is in progress', () => {
    session.set({
      ...session(),
      status: 'signing-out',
      lastErrorMessage: 'Your sign out could not be completed. Please try again.',
    });

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Signing you out and returning to the welcome page');
    expect(compiled.textContent).not.toContain('Your sign out could not be completed. Please try again.');
  });

  it('shows a recoverable logout error once sign-out fails', () => {
    session.set({
      ...session(),
      status: 'error',
      lastErrorMessage: 'Your sign out could not be completed. Please try again.',
    });

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Your sign out could not be completed. Please try again.');
  });
});