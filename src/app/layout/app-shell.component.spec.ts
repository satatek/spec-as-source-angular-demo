import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';

import { AuthFacade } from '../core/auth/auth.facade';
import { CLOCK_MIN_WIDTH_QUERY, MOBILE_BREAKPOINT_QUERY } from './header-clock.constants';
import { KeycloakProfileViewModel } from '../core/auth/profile.models';
import { AppShellComponent } from './app-shell.component';
import { ShellMenuConfigLoader } from './shell-menu-config.loader';
import { SidebarMenuItem, SidebarMenuLoadResult } from './shell-menu.models';

class BreakpointObserverStub {
  private readonly queries = new Map<string, BehaviorSubject<BreakpointState>>();

  observe = vi.fn((query: string) => this.ensureQuery(query).asObservable());

  setMatches(query: string, matches: boolean): void {
    this.ensureQuery(query).next({ matches, breakpoints: { [query]: matches } });
  }

  private ensureQuery(query: string): BehaviorSubject<BreakpointState> {
    if (!this.queries.has(query)) {
      const defaultMatches = query.includes('min-width');
      this.queries.set(
        query,
        new BehaviorSubject<BreakpointState>({
          matches: defaultMatches,
          breakpoints: { [query]: defaultMatches },
        })
      );
    }

    return this.queries.get(query)!;
  }
}

describe('AppShellComponent', () => {
  const defaultMenuItems: SidebarMenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      route: '/home',
      icon: 'dashboard',
      requiresAuth: true,
      visibleWhenAuthenticated: true,
      order: 10,
      children: null,
    },
    {
      id: 'welcome',
      label: 'Welcome',
      route: '/',
      icon: 'home',
      requiresAuth: false,
      visibleWhenAuthenticated: null,
      order: 20,
      children: null,
    },
    {
      id: 'account',
      label: 'Account',
      route: null,
      icon: 'manage_accounts',
      requiresAuth: true,
      visibleWhenAuthenticated: true,
      order: 30,
      children: [
        {
          id: 'profile',
          label: 'Profile',
          route: '/account',
          icon: 'account_circle',
          requiresAuth: true,
          visibleWhenAuthenticated: true,
          order: 10,
        },
      ],
    },
  ];

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
  const loadMenu = vi.fn(() =>
    of({
      status: 'ready',
      items: defaultMenuItems,
      errorMessage: null,
    } as SidebarMenuLoadResult)
  );

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
    loadMenu.mockReset();
    loadMenu.mockReturnValue(
      of({
        status: 'ready',
        items: defaultMenuItems,
        errorMessage: null,
      } as SidebarMenuLoadResult)
    );

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
        {
          provide: ShellMenuConfigLoader,
          useValue: {
            loadMenu,
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

  it('renders a header toggle control that can open and close the sidebar', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggleButton = compiled.querySelector('button.layout-shell__menu-toggle') as HTMLButtonElement;

    expect(toggleButton).toBeTruthy();
    expect(toggleButton.getAttribute('aria-label')).toBe('Toggle sidebar navigation');

    toggleButton.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.layoutState().opened).toBe(false);

    toggleButton.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.layoutState().opened).toBe(true);
  });

  it('switches to mobile drawer mode when breakpoint matches', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    const breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as BreakpointObserverStub;

    breakpointObserver.setMatches(MOBILE_BREAKPOINT_QUERY, true);
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

  it('renders a fallback message when menu configuration cannot be loaded', () => {
    loadMenu.mockReturnValueOnce(
      of({
        status: 'error',
        items: [],
        errorMessage: 'Menu configuration unavailable.',
      } as SidebarMenuLoadResult)
    );

    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Menu configuration unavailable.');
  });

  it('renders child links for two-level menus without requiring expansion', async () => {
    session.set({
      ...session(),
      status: 'authenticated',
      isAuthenticated: true,
    });
    isAuthenticated.set(true);

    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const parentRow = compiled.querySelector('.layout-shell__parent-item');

    expect(parentRow).toBeTruthy();

    const nestedList = compiled.querySelector('.layout-shell__nested-list');
    expect(nestedList).not.toBeNull();
    expect(nestedList?.textContent).toContain('Profile');
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

    breakpointObserver.setMatches(MOBILE_BREAKPOINT_QUERY, true);
    fixture.componentInstance.toggleSidenav();
    fixture.detectChanges();

    expect(fixture.componentInstance.layoutState().opened).toBe(true);

    await router.navigateByUrl('/home');
    fixture.detectChanges();

    expect(fixture.componentInstance.layoutState().opened).toBe(false);
  });

  it('collapses the mobile drawer after selecting a nested child route', async () => {
    session.set({
      ...session(),
      status: 'authenticated',
      isAuthenticated: true,
    });
    isAuthenticated.set(true);

    const fixture = TestBed.createComponent(AppShellComponent);
    const breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as BreakpointObserverStub;

    breakpointObserver.setMatches(MOBILE_BREAKPOINT_QUERY, true);
    breakpointObserver.setMatches(CLOCK_MIN_WIDTH_QUERY, false);
    fixture.componentInstance.toggleSidenav();
    fixture.detectChanges();

    if (!fixture.componentInstance.isParentExpanded('account')) {
      fixture.componentInstance.toggleParent('account');
    }
    fixture.detectChanges();

    const childLink = fixture.nativeElement.querySelector('.layout-shell__nested-list a[mat-list-item]') as HTMLAnchorElement;
    expect(childLink).toBeTruthy();

    childLink.click();
    fixture.componentInstance.closeSidenavOnNavigate();
    fixture.detectChanges();

    expect(fixture.componentInstance.layoutState().opened).toBe(false);
  });

  it('shows centered clock with timezone on tablet and desktop widths', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    const breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as BreakpointObserverStub;

    breakpointObserver.setMatches(CLOCK_MIN_WIDTH_QUERY, true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const clock = compiled.querySelector('[data-testid="header-clock"]');

    expect(clock).not.toBeNull();
    expect(clock?.textContent).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('hides clock below the 768px threshold', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    const breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as BreakpointObserverStub;

    breakpointObserver.setMatches(CLOCK_MIN_WIDTH_QUERY, false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="header-clock"]')).toBeNull();
  });
});
