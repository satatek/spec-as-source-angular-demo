import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { WelcomePageFacade } from './welcome-page.facade';
import { sanitizeAppRedirectTarget } from '../../core/auth/redirect.utils';

@Component({
  selector: 'app-welcome-page',
  imports: [MatButtonModule, MatCardModule, MatProgressBarModule, MatSnackBarModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly facade = inject(WelcomePageFacade);
  readonly redirectTarget = sanitizeAppRedirectTarget(this.route.snapshot.queryParamMap.get('redirectTo'));

  constructor() {
    effect(() => {
      if (this.facade.isAuthenticated()) {
        void this.router.navigateByUrl(this.redirectTarget);
      }
    });
  }

  async signIn(): Promise<void> {
    await this.facade.login(this.redirectTarget);
  }
}