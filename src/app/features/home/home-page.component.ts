import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthFacade } from '../../core/auth/auth.facade';
import { buildHomePageState } from './home-page.models';

@Component({
  selector: 'app-home-page',
  imports: [MatCardModule, MatListModule, MatProgressSpinnerModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly authFacade = inject(AuthFacade);
  readonly session = this.authFacade.session;
  readonly profile = this.authFacade.profile;
  readonly isProfileLoading = this.authFacade.isProfileLoading;
  readonly viewState = computed(() => buildHomePageState(this.profile(), this.session()));

  constructor() {
    void this.authFacade.ensureProfileLoaded();
  }
}