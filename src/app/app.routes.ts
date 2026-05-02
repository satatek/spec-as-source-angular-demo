import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';
import { canActivateAuthenticatedRoute } from './core/auth/auth.guard';

export const routes: Routes = [
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
		path: '**',
		redirectTo: '',
	},
];
