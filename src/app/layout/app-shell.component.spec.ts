import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { AuthFacade } from '../core/auth/auth.facade';
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
  const isAuthenticated = signal(false);

  beforeEach(async () => {
    isAuthenticated.set(false);

    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [
        provideRouter([
          { path: '', component: AppShellComponent },
          { path: 'home', component: AppShellComponent },
        ]),
        {
          provide: BreakpointObserver,
          useClass: BreakpointObserverStub,
        },
        {
          provide: AuthFacade,
          useValue: {
            isAuthenticated,
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
