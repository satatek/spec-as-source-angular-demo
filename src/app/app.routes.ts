import { Routes } from '@angular/router';
import { WorldClockPageComponent } from './features/world-clock/world-clock-page.component';
import { AccountPageComponent } from './features/account/account-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';
import { canActivateAuthenticatedRoute } from './core/auth/auth.guard';
import { AppShellComponent } from './layout/app-shell.component';

export const routes: Routes = [
	{
		path: '',
		component: AppShellComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				component: WelcomePageComponent,
			},
			{
				path: 'home',
				component: HomePageComponent,
				canActivate: [canActivateAuthenticatedRoute],
			},
			{
				path: 'account',
				component: AccountPageComponent,
				canActivate: [canActivateAuthenticatedRoute],
			},
			{
				path: 'world-clock',
				component: WorldClockPageComponent,
				data: { title: 'World Clock', icon: 'schedule' },
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
