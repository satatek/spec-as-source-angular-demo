import { MatDrawerMode } from '@angular/material/sidenav';

export type LayoutSectionId = 'header' | 'content' | 'footer';

export interface LayoutSection {
  id: LayoutSectionId;
  landmark: 'header' | 'main' | 'footer';
  isShared: boolean;
  order: number;
}

export interface ShellNavigationItem {
  label: string;
  route: string;
  icon: string | null;
  requiresAuth: boolean;
  visibleWhenAuthenticated: boolean | null;
}

export interface ShellLayoutState {
  mode: MatDrawerMode;
  opened: boolean;
  isMobile: boolean;
}

export const APP_LAYOUT_SECTIONS: readonly LayoutSection[] = [
  {
    id: 'header',
    landmark: 'header',
    isShared: true,
    order: 1,
  },
  {
    id: 'content',
    landmark: 'main',
    isShared: false,
    order: 2,
  },
  {
    id: 'footer',
    landmark: 'footer',
    isShared: true,
    order: 3,
  },
];

export const SHELL_NAV_ITEMS: readonly ShellNavigationItem[] = [
  {
    label: 'Welcome',
    route: '/',
    icon: 'home',
    requiresAuth: false,
    visibleWhenAuthenticated: null,
  },
  {
    label: 'Home',
    route: '/home',
    icon: 'dashboard',
    requiresAuth: true,
    visibleWhenAuthenticated: true,
  },
];
