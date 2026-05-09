import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthFacade } from '../../core/auth/auth.facade';

@Component({
  selector: 'app-account-page',
  imports: [MatCardModule, MatListModule, MatProgressSpinnerModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {
  private readonly authFacade = inject(AuthFacade);

  readonly session = this.authFacade.session;
  readonly profile = this.authFacade.profile;
  readonly isProfileLoading = this.authFacade.isProfileLoading;

  readonly viewState = computed(() => {
    const profile = this.profile();
    const session = this.session();

    return {
      status: session.status === 'authenticated' ? 'ready' : session.status === 'error' ? 'error' : 'loading',
      profileFields: [
        { label: 'Email', value: profile?.email ?? 'Not provided' },
        { label: 'Name', value: profile?.displayName ?? 'Authenticated user' },
        { label: 'Username', value: profile?.username ?? 'Not provided' },
      ],
      canLogoff: session.isAuthenticated && session.status !== 'signing-out',
      feedbackMessage: session.lastErrorMessage,
    };
  });

  constructor() {
    void this.authFacade.ensureProfileLoaded();
  }
}