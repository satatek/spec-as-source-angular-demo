import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AuthFacade } from '../core/auth/auth.facade';
import { APP_LAYOUT_SECTIONS, SHELL_NAV_ITEMS, ShellLayoutState, ShellNavigationItem } from './shell-navigation.models';

@Component({
  selector: 'app-shell',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly layoutSections = APP_LAYOUT_SECTIONS;
  readonly isMobile = signal(false);
  readonly sidenavOpened = signal(true);
  readonly sidenavMode = computed<ShellLayoutState['mode']>(() => (this.isMobile() ? 'over' : 'side'));
  readonly layoutState = computed<ShellLayoutState>(() => ({
    mode: this.sidenavMode(),
    opened: this.sidenavOpened(),
    isMobile: this.isMobile(),
  }));
  readonly navigationItems = computed(() =>
    SHELL_NAV_ITEMS.filter((item) => this.isNavigationItemVisible(item))
  );

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 959px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.isMobile.set(state.matches);
        this.sidenavOpened.set(!state.matches);
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.isMobile()) {
          this.sidenavOpened.set(false);
        }
      });
  }

  toggleSidenav(): void {
    this.sidenavOpened.update((opened) => !opened);
  }

  closeSidenavOnNavigate(): void {
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }

  trackByLabel(_index: number, item: ShellNavigationItem): string {
    return item.label;
  }

  private isNavigationItemVisible(item: ShellNavigationItem): boolean {
    if (item.visibleWhenAuthenticated === null) {
      return true;
    }

    return this.authFacade.isAuthenticated() === item.visibleWhenAuthenticated;
  }
}
