import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { RUNTIME_SIDEBAR_MENU_CONFIG_PATH, ShellMenuConfigLoader } from './shell-menu-config.loader';

describe('ShellMenuConfigLoader', () => {
  let loader: ShellMenuConfigLoader;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    loader = TestBed.inject(ShellMenuConfigLoader);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads and normalizes a valid runtime menu payload', async () => {
    const resultPromise = firstValueFrom(loader.loadMenu());

    const request = httpTestingController.expectOne(RUNTIME_SIDEBAR_MENU_CONFIG_PATH);
    expect(request.request.method).toBe('GET');

    request.flush({
      version: '1',
      items: [
        {
          id: 'home',
          label: 'Home',
          route: '/home',
          icon: 'dashboard',
          requiresAuth: true,
          visibleWhenAuthenticated: true,
          order: 20,
        },
        {
          id: 'welcome',
          label: 'Welcome',
          route: '/',
          icon: 'home',
          requiresAuth: false,
          visibleWhenAuthenticated: null,
          order: 10,
        },
      ],
    });

    const result = await resultPromise;
    expect(result.status).toBe('ready');
    expect(result.errorMessage).toBeNull();
    expect(result.items.map((item) => item.id)).toEqual(['welcome', 'home']);
  });

  it('returns fallback state when payload is invalid', async () => {
    const resultPromise = firstValueFrom(loader.loadMenu());

    const request = httpTestingController.expectOne(RUNTIME_SIDEBAR_MENU_CONFIG_PATH);
    request.flush({
      version: '1',
      items: [
        {
          id: 'invalid-leaf',
          label: 'Broken',
          route: 'home',
          order: 10,
        },
      ],
    });

    const result = await resultPromise;
    expect(result.status).toBe('error');
    expect(result.items).toEqual([]);
    expect(result.errorMessage).toContain('Top-level menu route must be app-relative');
  });

  it('drops unsupported nested levels and keeps two-level structure', async () => {
    const resultPromise = firstValueFrom(loader.loadMenu());

    const request = httpTestingController.expectOne(RUNTIME_SIDEBAR_MENU_CONFIG_PATH);
    request.flush({
      version: '1',
      items: [
        {
          id: 'account',
          label: 'Account',
          route: null,
          order: 10,
          children: [
            {
              id: 'profile',
              label: 'Profile',
              route: '/account',
              order: 10,
              children: [
                {
                  id: 'ignored-grandchild',
                  label: 'Ignored',
                  route: '/ignored',
                },
              ],
            },
          ],
        },
      ],
    });

    const result = await resultPromise;
    expect(result.status).toBe('ready');
    expect(result.items[0]?.children?.length).toBe(1);
    expect((result.items[0]?.children?.[0] as unknown as { children?: unknown }).children).toBeUndefined();
  });

  it('returns fallback state when HTTP request fails', async () => {
    const resultPromise = firstValueFrom(loader.loadMenu());

    const request = httpTestingController.expectOne(RUNTIME_SIDEBAR_MENU_CONFIG_PATH);
    request.flush('server error', {
      status: 500,
      statusText: 'Server Error',
    });

    const result = await resultPromise;
    expect(result.status).toBe('error');
    expect(result.items).toEqual([]);
    expect(result.errorMessage).toBe('Unable to load navigation menu configuration.');
  });
});
