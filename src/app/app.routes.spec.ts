import { TestBed } from '@angular/core/testing';

import { routes } from './app.routes';
import { HomePageComponent } from './features/home/home-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';

describe('app routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('uses the welcome page as the public entry route', () => {
    expect(routes[0]).toMatchObject({
      path: '',
      pathMatch: 'full',
      component: WelcomePageComponent,
    });
  });

  it('protects the home route and maps it to the home page component', () => {
    expect(routes[1]).toMatchObject({
      path: 'home',
      component: HomePageComponent,
    });
    expect(routes[1]?.canActivate?.length).toBe(1);
  });
});