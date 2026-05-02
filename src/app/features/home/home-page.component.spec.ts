import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { HomePageComponent } from './home-page.component';
import { AuthFacade } from '../../core/auth/auth.facade';
import { KeycloakProfileViewModel } from '../../core/auth/profile.models';

describe('HomePageComponent', () => {
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
      imports: [HomePageComponent],
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
});