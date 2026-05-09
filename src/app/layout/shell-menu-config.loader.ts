import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of, type Observable } from 'rxjs';

import {
  createSidebarMenuFallback,
  normalizeSidebarMenuConfig,
  SidebarMenuLoadResult,
} from './shell-menu.models';

export const RUNTIME_SIDEBAR_MENU_CONFIG_PATH = '/config/sidebar-menu.json';

@Injectable({ providedIn: 'root' })
export class ShellMenuConfigLoader {
  private readonly httpClient = inject(HttpClient);

  loadMenu(): Observable<SidebarMenuLoadResult> {
    return this.httpClient.get<unknown>(RUNTIME_SIDEBAR_MENU_CONFIG_PATH).pipe(
      map((payload) => {
        const items = normalizeSidebarMenuConfig(payload);

        return {
          status: 'ready',
          items,
          errorMessage: null,
        } as SidebarMenuLoadResult;
      }),
      catchError((error: unknown) => {
        const errorMessage =
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : 'Unable to load navigation menu configuration.';

        return of({
          status: 'error',
          items: createSidebarMenuFallback(),
          errorMessage,
        } as SidebarMenuLoadResult);
      })
    );
  }
}
