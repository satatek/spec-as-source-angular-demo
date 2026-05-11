import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { vi } from 'vitest';

import { HomePageComponent } from './home-page.component';
import { AuthFacade } from '../../core/auth/auth.facade';
import { ShellMenuConfigLoader } from '../../layout/shell-menu-config.loader';
import { SidebarMenuItem, SidebarMenuLoadResult } from '../../layout/shell-menu.models';

describe('HomePageComponent', () => {
  const navigateByUrl = vi.fn(async (_route: string) => true);
  const ensureProfileLoaded = vi.fn(async () => null);
  const session = signal({
    status: 'authenticated',
    isAuthenticated: true,
    loginUrlRequested: false,
    lastErrorMessage: null as string | null,
    redirectTarget: '/home',
  });
  const profile = signal<{ displayName: string } | null>(null);
  const isProfileLoading = signal(false);
  const isAuthenticated = signal(true);

  const menuItems: SidebarMenuItem[] = [
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
      id: 'world_clock',
      label: 'World Clock',
      route: '/world-clock',
      icon: 'public',
      requiresAuth: false,
      visibleWhenAuthenticated: true,
      order: 20,
      children: null,
    },
    {
      id: 'ocpi_modules',
      label: 'OCPI Modules',
      route: null,
      icon: null,
      requiresAuth: true,
      visibleWhenAuthenticated: true,
      order: 30,
      children: [
        {
          id: 'locations',
          label: 'Locations',
          route: '/locations',
          icon: 'location_on',
          requiresAuth: true,
          visibleWhenAuthenticated: true,
          order: 10,
        },
        {
          id: 'sessions',
          label: 'Sessions',
          route: '/sessions',
          icon: 'electric_car',
          requiresAuth: true,
          visibleWhenAuthenticated: true,
          order: 20,
        },
      ],
    },
  ];

  const menuLoader = {
    loadMenu: vi.fn((): Observable<SidebarMenuLoadResult> =>
      of({
        status: 'ready',
        items: menuItems,
        errorMessage: null,
      })
    ),
  };

  beforeEach(async () => {
    navigateByUrl.mockClear();
    ensureProfileLoaded.mockClear();
    menuLoader.loadMenu.mockClear();

    isProfileLoading.set(false);
    isAuthenticated.set(true);
    profile.set({ displayName: 'Thiago' });

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        {
          provide: AuthFacade,
          useValue: {
            session,
            profile,
            isProfileLoading,
            isAuthenticated,
            ensureProfileLoaded,
          },
        },
        {
          provide: ShellMenuConfigLoader,
          useValue: menuLoader,
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl,
          },
        },
      ],
    }).compileComponents();
  });

  it('loads runtime menu config on creation', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(ensureProfileLoaded).toHaveBeenCalledTimes(1);
    expect(menuLoader.loadMenu).toHaveBeenCalledTimes(1);
  });

  it('renders Keycloak greeting with display name', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Hello, Thiago');
  });

  it('renders direct feature cards from top-level leaf entries', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('World Clock');
    expect(compiled.textContent).toContain('/world-clock');

    const cards = compiled.querySelectorAll('[data-testid="home-feature-card"]');
    expect(cards.length).toBeGreaterThan(0);

    expect(compiled.querySelector('[data-testid="home-page"]')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="home-feature-sections"]')).not.toBeNull();
  });

  it('renders grouped parent panels with child feature cards', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('OCPI Modules');
    expect(compiled.textContent).toContain('Locations');
    expect(compiled.textContent).toContain('Sessions');

    const groupPanels = compiled.querySelectorAll('[data-testid="home-feature-group-panel"]');
    expect(groupPanels.length).toBeGreaterThan(0);

    const childCards = compiled.querySelectorAll('[data-testid="home-group-child-card"]');
    expect(childCards.length).toBe(2);
  });

  it('navigates through feature card actions', async () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const cardButton = fixture.nativeElement.querySelector(
      '[data-testid="home-feature-card"]'
    ) as HTMLButtonElement;
    cardButton.click();

    await fixture.whenStable();

    expect(navigateByUrl).toHaveBeenCalled();
  });

  it('shows an action error if route navigation is rejected', async () => {
    navigateByUrl.mockResolvedValueOnce(false);

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const cardButton = fixture.nativeElement.querySelector(
      '[data-testid="home-feature-card"]'
    ) as HTMLButtonElement;
    cardButton.click();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('We could not open this feature right now. Please try again.');
  });

  it('shows empty state when no items are visible', () => {
    menuLoader.loadMenu.mockReturnValueOnce(
      of({
        status: 'ready' as const,
        items: [],
        errorMessage: null,
      })
    );

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="home-empty-state"]')).not.toBeNull();
    expect(compiled.textContent).toContain('No features available');
  });

  it('shows error state when menu loading fails', () => {
    menuLoader.loadMenu.mockReturnValueOnce(
      of({
        status: 'error' as const,
        items: [],
        errorMessage: 'Unable to load navigation menu configuration.',
      })
    );

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="home-error-state"]')).not.toBeNull();
    expect(compiled.textContent).toContain('Unable to load navigation menu configuration.');
  });

  it('keeps card styles responsive and focus-visible friendly', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const styles = Array.from(document.querySelectorAll('style'))
      .map((styleElement) => styleElement.textContent ?? '')
      .join('\n');

    expect(styles).toContain('grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));');
    expect(styles).toContain('focus-visible');
  });

  it('applies authentication visibility filtering the same way as the sidebar', () => {
    isAuthenticated.set(false);

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No features available');
    expect(compiled.textContent).not.toContain('World Clock');
  });

  it('renders semantic regions for direct and grouped cards', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const direct = compiled.querySelector('[data-testid="home-direct-features-region"]');
    const grouped = compiled.querySelector('[data-testid="home-grouped-features-region"]');

    expect(direct?.getAttribute('aria-label')).toBe('Direct features');
    expect(grouped?.getAttribute('aria-label')).toBe('Grouped features');
  });

  it('renders grouped child cards in deterministic order', () => {
    menuLoader.loadMenu.mockReturnValueOnce(
      of({
        status: 'ready' as const,
        items: [
          {
            id: 'ordered',
            label: 'Ordered',
            route: null,
            icon: null,
            requiresAuth: false,
            visibleWhenAuthenticated: null,
            order: 10,
            children: [
              {
                id: 'b',
                label: 'B',
                route: '/b',
                icon: null,
                requiresAuth: false,
                visibleWhenAuthenticated: null,
                order: 20,
              },
              {
                id: 'a',
                label: 'A',
                route: '/a',
                icon: null,
                requiresAuth: false,
                visibleWhenAuthenticated: null,
                order: 10,
              },
            ],
          },
        ],
        errorMessage: null,
      })
    );

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const childCards = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid="home-group-child-card"] .feature-card__title')
    ) as HTMLElement[];

    expect(childCards.map((element) => element.textContent?.trim())).toEqual(['A', 'B']);
  });

  it('keeps page markup content-only without duplicated shell landmarks', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')).toBeNull();
    expect(compiled.querySelector('footer')).toBeNull();
    expect(compiled.querySelector('nav')).toBeNull();
  });

  it('handles metadata fallback for blank labels in mapped cards', () => {
    menuLoader.loadMenu.mockReturnValueOnce(
      of({
        status: 'ready' as const,
        items: [
          {
            id: 'fallback-id',
            label: '   ',
            route: '/fallback',
            icon: null,
            requiresAuth: false,
            visibleWhenAuthenticated: null,
            order: 10,
            children: null,
          },
        ],
        errorMessage: null,
      })
    );

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('fallback-id');
  });

  it('renders no grouped panels when parent children are absent after filtering', () => {
    menuLoader.loadMenu.mockReturnValueOnce(
      of({
        status: 'ready' as const,
        items: [
          {
            id: 'parent',
            label: 'Parent',
            route: null,
            icon: null,
            requiresAuth: false,
            visibleWhenAuthenticated: null,
            order: 10,
            children: [],
          },
        ],
        errorMessage: null,
      })
    );

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="home-feature-group-panel"]')).toBeNull();
  });

  it('shows action error when router throws during navigation', async () => {
    navigateByUrl.mockRejectedValueOnce(new Error('Route not found'));

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const cardButton = fixture.nativeElement.querySelector(
      '[data-testid="home-feature-card"]'
    ) as HTMLButtonElement;
    cardButton.click();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('We could not open this feature right now. Please try again.');
  });

  it('renders focus-ring and keyboard-visible interaction styles', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const styles = Array.from(document.querySelectorAll('style'))
      .map((styleElement) => styleElement.textContent ?? '')
      .join('\n');

    expect(styles).toContain('outline: 3px solid');
    expect(styles).toContain('focus-visible');
  });

  it('keeps grouped sections full-width on narrow layouts', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const styles = Array.from(document.querySelectorAll('style'))
      .map((styleElement) => styleElement.textContent ?? '')
      .join('\n');

    expect(styles).toContain('@media (max-width: 640px)');
    expect(styles).toContain('grid-template-columns: minmax(0, 1fr);');
  });

  it('preserves direct card ordering by menu order value', () => {
    menuLoader.loadMenu.mockReturnValueOnce(
      of({
        status: 'ready' as const,
        items: [
          {
            id: 'second',
            label: 'Second',
            route: '/second',
            icon: null,
            requiresAuth: false,
            visibleWhenAuthenticated: null,
            order: 20,
            children: null,
          },
          {
            id: 'first',
            label: 'First',
            route: '/first',
            icon: null,
            requiresAuth: false,
            visibleWhenAuthenticated: null,
            order: 10,
            children: null,
          },
        ],
        errorMessage: null,
      })
    );

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const cardTitles = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid="home-feature-card"] .feature-card__title')
    ) as HTMLElement[];

    expect(cardTitles.map((item) => item.textContent?.trim())).toEqual(['First', 'Second']);
  });

  it('shows grouped section heading and child count metadata', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Grouped features');
    expect(compiled.textContent).toContain('2 links');
  });

  it('renders no direct cards region when state is error', () => {
    menuLoader.loadMenu.mockReturnValueOnce(
      of({
        status: 'error' as const,
        items: [],
        errorMessage: 'Bad menu payload',
      })
    );

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="home-direct-features-region"]')).toBeNull();
    expect(compiled.querySelector('[data-testid="home-grouped-features-region"]')).toBeNull();
    });
});