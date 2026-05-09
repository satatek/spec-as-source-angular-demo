import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { AuthFacade } from '../core/auth/auth.facade';
import { KeycloakProfileViewModel } from '../core/auth/profile.models';
import { AppShellComponent } from './app-shell.component';

class BreakpointObserverStub {
  private readonly state$ = new BehaviorSubject<BreakpointState>({
    matches: false,
    breakpoints: {},
  });

  observe = vi.fn(() => this.state$.asObservable());

  setMatches(matches: boolean): void {
    this.state$.next({ matches, breakpoints: {} });
  }
}

describe('AppShellComponent', () => {
  const session = signal({
    status: 'anonymous',
    isAuthenticated: false,
    loginUrlRequested: false,
    lastErrorMessage: null as string | null,
    redirectTarget: null as string | null,
  });
  const profile = signal<KeycloakProfileViewModel | null>(null);
  const isAuthenticated = signal(false);
  const logout = vi.fn(async () => undefined);
  const login = vi.fn(async () => undefined);

  beforeEach(async () => {
    isAuthenticated.set(false);
    session.set({
      status: 'anonymous',
      isAuthenticated: false,
      loginUrlRequested: false,
      lastErrorMessage: null,
      redirectTarget: null,
    });
    profile.set(null);
    logout.mockClear();
    login.mockClear();

    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [
        provideRouter([
          { path: '', component: AppShellComponent },
          { path: 'home', component: AppShellComponent },
          { path: 'account', component: AppShellComponent },
        ]),
        {
          provide: BreakpointObserver,
          useClass: BreakpointObserverStub,
        },
        {
          provide: AuthFacade,
          useValue: {
            session,
            profile,
            isAuthenticated,
            logout,
            login,
          },
        },
      ],
    }).compileComponents();
  });

  it('renders semantic shell regions in the correct order', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')).not.toBeNull();
    expect(compiled.querySelector('main')).not.toBeNull();
    expect(compiled.querySelector('footer')).not.toBeNull();
  });

  it('starts in desktop layout mode with sidenav opened', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.layoutState()).toMatchObject({
      mode: 'side',
      opened: true,
      isMobile: false,
    });
  });

  it('switches to mobile drawer mode when breakpoint matches', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    const breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as BreakpointObserverStub;

    breakpointObserver.setMatches(true);
    fixture.detectChanges();

    expect(fixture.componentInstance.layoutState()).toMatchObject({
      mode: 'over',
      opened: false,
      isMobile: true,
    });
  });

  it('shows authenticated-only navigation items only when authenticated', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();

    const compiledBefore = fixture.nativeElement as HTMLElement;
    expect(compiledBefore.textContent).toContain('Welcome');
    expect(compiledBefore.textContent).not.toContain('Home');

    isAuthenticated.set(true);
    fixture.detectChanges();

    const compiledAfter = fixture.nativeElement as HTMLElement;
    expect(compiledAfter.textContent).toContain('Home');
  });

  it('renders the authenticated email in the top-right profile trigger', () => {
    profile.set({
      subject: 'user-123',
      displayName: 'Casey Rivers',
      username: 'casey',
      email: 'casey@example.com',
      emailVerified: true,
      firstName: 'Casey',
      lastName: 'Rivers',
    });
    session.set({
      ...session(),
      status: 'authenticated',
      isAuthenticated: true,
    });
    isAuthenticated.set(true);

    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const profileTrigger = compiled.querySelector('button[mat-stroked-button]') as HTMLButtonElement;
    expect(compiled.textContent).toContain('casey@example.com');
    expect(profileTrigger.getAttribute('aria-label')).toBe('Open profile menu for casey@example.com');
  });

  it('opens the account entry point from the profile menu', async () => {
    profile.set({
      subject: 'user-123',
      displayName: 'Casey Rivers',
      username: 'casey',
      email: 'casey@example.com',
      emailVerified: true,
      firstName: 'Casey',
      lastName: 'Rivers',
    });
    session.set({
      ...session(),
      status: 'authenticated',
      isAuthenticated: true,
    });
    isAuthenticated.set(true);

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();

    const profileTrigger = fixture.nativeElement.querySelector('button[mat-stroked-button]') as HTMLButtonElement;
    profileTrigger.click();
    await fixture.whenStable();

    const profileMenuButton = Array.from(document.querySelectorAll('button.mat-mdc-menu-item')).find(
      (element) => element.textContent?.includes('Profile')
    ) as HTMLButtonElement | undefined;

    expect(profileMenuButton).toBeDefined();
    profileMenuButton?.click();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith('/account');
  });

  it('closes the mobile drawer after route navigation', async () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    const breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as BreakpointObserverStub;
    const router = TestBed.inject(Router);

    breakpointObserver.setMatches(true);
    fixture.componentInstance.toggleSidenav();
    fixture.detectChanges();

    expect(fixture.componentInstance.layoutState().opened).toBe(true);

    await router.navigateByUrl('/home');
    fixture.detectChanges();

    expect(fixture.componentInstance.layoutState().opened).toBe(false);
  });
});
