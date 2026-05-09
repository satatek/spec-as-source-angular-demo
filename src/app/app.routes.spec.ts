import { TestBed } from '@angular/core/testing';

import { routes } from './app.routes';
import { AccountPageComponent } from './features/account/account-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';
import { AppShellComponent } from './layout/app-shell.component';

describe('app routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('uses the shell component as the root route', () => {
    expect(routes[0]).toMatchObject({
      path: '',
      component: AppShellComponent,
    });
  });

  it('uses the welcome page as the shell child entry route', () => {
    expect(routes[0]?.children?.[0]).toMatchObject({
      path: '',
      pathMatch: 'full',
      component: WelcomePageComponent,
    });
  });

  it('protects the shell home child route and maps it to the home page component', () => {
    expect(routes[0]?.children?.[1]).toMatchObject({
      path: 'home',
      component: HomePageComponent,
    });
    expect(routes[0]?.children?.[1]?.canActivate?.length).toBe(1);
  });

  it('protects the shell account child route and maps it to the account page component', () => {
    expect(routes[0]?.children?.[2]).toMatchObject({
      path: 'account',
      component: AccountPageComponent,
    });
    expect(routes[0]?.children?.[2]?.canActivate?.length).toBe(1);
  });
});