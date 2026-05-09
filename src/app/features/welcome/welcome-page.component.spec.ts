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
  const login = vi.fn(async (_redirectTarget?: string) => undefined);
  const dismissError = vi.fn();

  beforeEach(async () => {
    login.mockClear();
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
            login,
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

  it('renders the Keycloak login action for anonymous users', () => {
    const fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sign in with Keycloak');
    expect(compiled.textContent).toContain('friendly demo page');
  });

  it('starts the login flow when the primary action is clicked', async () => {
    const fixture = TestBed.createComponent(WelcomePageComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[mat-flat-button]') as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith('/home');
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
});