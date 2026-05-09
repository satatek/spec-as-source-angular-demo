import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AuthFacade } from '../core/auth/auth.facade';
import { ShellMenuConfigLoader } from './shell-menu-config.loader';
import { SidebarMenuChildItem, SidebarMenuItem } from './shell-menu.models';
import { APP_LAYOUT_SECTIONS, filterMenuItemsForAuth, ShellLayoutState } from './shell-navigation.models';
import { buildHeaderProfileState, HeaderProfileState } from './shell-profile.models';

type MenuLoadStatus = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-shell',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
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
  private readonly menuConfigLoader = inject(ShellMenuConfigLoader);
  private readonly destroyRef = inject(DestroyRef);

  readonly layoutSections = APP_LAYOUT_SECTIONS;
  readonly isMobile = signal(false);
  readonly sidenavOpened = signal(true);
  readonly rawMenuItems = signal<SidebarMenuItem[]>([]);
  readonly expandedParentIds = signal<string[]>([]);
  readonly menuStatus = signal<MenuLoadStatus>('loading');
  readonly menuErrorMessage = signal<string | null>(null);
  readonly headerProfileState = computed<HeaderProfileState>(() =>
    buildHeaderProfileState(this.authFacade.session(), this.authFacade.profile())
  );
  readonly sidenavMode = computed<ShellLayoutState['mode']>(() => (this.isMobile() ? 'over' : 'side'));
  readonly layoutState = computed<ShellLayoutState>(() => ({
    mode: this.sidenavMode(),
    opened: this.sidenavOpened(),
    isMobile: this.isMobile(),
  }));
  readonly navigationItems = computed(() =>
    filterMenuItemsForAuth(this.rawMenuItems(), this.authFacade.isAuthenticated())
  );

  constructor() {
    this.loadNavigationMenu();

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

  openProfileAccount(): void {
    void this.router.navigateByUrl('/account');
  }

  async logOff(): Promise<void> {
    await this.authFacade.logout('/');
  }

  async signIn(): Promise<void> {
    await this.authFacade.login('/home');
  }

  closeSidenavOnNavigate(): void {
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }

  toggleParent(itemId: string): void {
    this.expandedParentIds.update((ids) => {
      if (ids.includes(itemId)) {
        return ids.filter((id) => id !== itemId);
      }

      return [...ids, itemId];
    });
  }

  isParentExpanded(itemId: string): boolean {
    return this.expandedParentIds().includes(itemId);
  }

  trackByMenuItemId(_index: number, item: SidebarMenuItem): string {
    return item.id;
  }

  trackByChildMenuItemId(_index: number, item: SidebarMenuChildItem): string {
    return item.id;
  }

  private loadNavigationMenu(): void {
    this.menuStatus.set('loading');
    this.menuErrorMessage.set(null);

    this.menuConfigLoader
      .loadMenu()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.rawMenuItems.set(result.items);
        this.menuStatus.set(result.status);
        this.menuErrorMessage.set(result.errorMessage);

        const visibleParentIds = result.items
          .filter((item) => item.children !== null && item.children.length > 0)
          .map((item) => item.id);

        this.expandedParentIds.update((ids) =>
          ids.filter((id) => visibleParentIds.includes(id))
        );
      });
  }
}
