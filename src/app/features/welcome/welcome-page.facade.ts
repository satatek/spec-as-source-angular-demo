import { Injectable, computed, inject } from '@angular/core';

import { AuthFacade } from '../../core/auth/auth.facade';

@Injectable({ providedIn: 'root' })
export class WelcomePageFacade {
  private readonly authFacade = inject(AuthFacade);

  readonly session = this.authFacade.session;
  readonly isAuthenticated = this.authFacade.isAuthenticated;
  readonly isChecking = computed(() => this.session().status === 'checking');
  readonly errorMessage = computed(() => this.session().lastErrorMessage);

  dismissError(): void {
    this.authFacade.clearError();
  }
}