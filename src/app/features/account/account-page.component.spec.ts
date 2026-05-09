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
  });
});