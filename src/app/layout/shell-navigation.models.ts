import { MatDrawerMode } from '@angular/material/sidenav';

import { SidebarMenuChildItem, SidebarMenuItem } from './shell-menu.models';

export type LayoutSectionId = 'header' | 'content' | 'footer';

export interface LayoutSection {
  id: LayoutSectionId;
  landmark: 'header' | 'main' | 'footer';
  isShared: boolean;
  order: number;
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

export function filterMenuItemsForAuth(
  items: readonly SidebarMenuItem[],
  isAuthenticated: boolean
): SidebarMenuItem[] {
  return items
    .filter((item) => isMenuEntryVisible(item, isAuthenticated))
    .map((item) => ({
      ...item,
      children: filterChildItemsForAuth(item.children, isAuthenticated),
    }))
    .filter((item) => item.route !== null || (item.children !== null && item.children.length > 0));
}

function filterChildItemsForAuth(
  children: readonly SidebarMenuChildItem[] | null,
  isAuthenticated: boolean
): SidebarMenuChildItem[] | null {
  if (children === null) {
    return null;
  }

  return children.filter((child) => isMenuEntryVisible(child, isAuthenticated));
}

function isMenuEntryVisible(
  item: Pick<SidebarMenuItem, 'requiresAuth' | 'visibleWhenAuthenticated'>,
  isAuthenticated: boolean
): boolean {
  if (item.requiresAuth && !isAuthenticated) {
    return false;
  }

  if (item.visibleWhenAuthenticated === null) {
    return true;
  }

  return isAuthenticated === item.visibleWhenAuthenticated;
}
