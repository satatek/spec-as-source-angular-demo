import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { AuthFacade } from '../../core/auth/auth.facade';
import { ShellMenuConfigLoader } from '../../layout/shell-menu-config.loader';
import { SidebarMenuItem } from '../../layout/shell-menu.models';
import { filterMenuItemsForAuth } from '../../layout/shell-navigation.models';
import { buildHomeFeatureCollectionState } from './home-feature-cards.mapper';
import { createErrorHomeFeatureCollectionState } from './home-page.models';

@Component({
  selector: 'app-home-page',
  imports: [MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly menuConfigLoader = inject(ShellMenuConfigLoader);
  private readonly router = inject(Router);

  private readonly rawMenuItems = signal<SidebarMenuItem[]>([]);
  private readonly menuStatus = signal<'loading' | 'ready' | 'error'>('loading');
  private readonly menuErrorMessage = signal<string | null>(null);
  private readonly actionErrorMessage = signal<string | null>(null);

  readonly navigationItems = computed(() =>
    filterMenuItemsForAuth(this.rawMenuItems(), this.authFacade.isAuthenticated())
  );
  readonly greeting = computed(() => {
    const displayName = this.authFacade.profile()?.displayName?.trim();
    return displayName ? `Hello, ${displayName}` : 'Hello';
  });
  readonly viewState = computed(() => {
    if (this.menuStatus() === 'error') {
      return createErrorHomeFeatureCollectionState(
        this.menuErrorMessage() ?? 'Unable to load feature navigation.',
        this.actionErrorMessage()
      );
    }

    return buildHomeFeatureCollectionState(this.navigationItems(), this.actionErrorMessage());
  });

  constructor() {
    void this.authFacade.ensureProfileLoaded();

    this.menuConfigLoader
      .loadMenu()
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.rawMenuItems.set(result.items);
        this.menuStatus.set(result.status);
        this.menuErrorMessage.set(result.errorMessage);
      });
  }

  async navigateTo(route: string): Promise<void> {
    this.actionErrorMessage.set(null);

    try {
      const navigated = await this.router.navigateByUrl(route);
      if (!navigated) {
        this.actionErrorMessage.set('We could not open this feature right now. Please try again.');
      }
    } catch {
      this.actionErrorMessage.set('We could not open this feature right now. Please try again.');
    }
  }
}