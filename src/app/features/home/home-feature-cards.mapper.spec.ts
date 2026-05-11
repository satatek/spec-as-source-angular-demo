import { describe, expect, it } from 'vitest';

import { SidebarMenuItem } from '../../layout/shell-menu.models';
import { filterMenuItemsForAuth } from '../../layout/shell-navigation.models';
import { buildHomeFeatureCollectionState, mapSidebarItemsToHomeFeatureCollections } from './home-feature-cards.mapper';

describe('home feature cards mapper', () => {
  it('maps top-level leaf items to direct cards', () => {
    const result = mapSidebarItemsToHomeFeatureCollections([
      createLeafItem('home', 'Home', '/home', 20),
      createLeafItem('world-clock', 'World Clock', '/world-clock', 10),
    ]);

    expect(result.directCards.map((item) => item.id)).toEqual(['world-clock', 'home']);
    expect(result.groups).toEqual([]);
  });

  it('maps parent items to groups with child cards and keeps child order', () => {
    const result = mapSidebarItemsToHomeFeatureCollections([
      createParentItem('ocpi', 'OCPI Modules', 30, [
        createChild('sessions', 'Sessions', '/sessions', 30),
        createChild('locations', 'Locations', '/locations', 10),
      ]),
    ]);

    expect(result.directCards).toEqual([]);
    expect(result.groups).toHaveLength(1);
    expect(result.groups[0]?.children.map((child) => child.id)).toEqual(['locations', 'sessions']);
    expect(result.groups[0]?.children.every((child) => child.source === 'child')).toBe(true);
  });

  it('excludes parent groups when children are empty', () => {
    const result = mapSidebarItemsToHomeFeatureCollections([
      createParentItem('parent', 'Parent', 10, []),
    ]);

    expect(result.groups).toEqual([]);
    expect(result.directCards).toEqual([]);
  });

  it('uses fallback labels when incoming labels are blank', () => {
    const result = mapSidebarItemsToHomeFeatureCollections([
      createLeafItem('blank-label', '   ', '/blank', 10),
    ]);

    expect(result.directCards[0]?.label).toBe('blank-label');
  });

  it('builds empty state when there are no mapped items', () => {
    const state = buildHomeFeatureCollectionState([]);

    expect(state.status).toBe('empty');
    expect(state.directCards).toEqual([]);
    expect(state.groups).toEqual([]);
    expect(state.errorMessage).toBeNull();
  });

  it('maps only authenticated-visible items when composed with sidebar auth filter', () => {
    const filtered = filterMenuItemsForAuth(
      [
        {
          ...createLeafItem('private', 'Private', '/private', 10),
          requiresAuth: true,
          visibleWhenAuthenticated: true,
        },
        {
          ...createLeafItem('public', 'Public', '/public', 20),
          requiresAuth: false,
          visibleWhenAuthenticated: false,
        },
      ],
      true
    );

    const result = mapSidebarItemsToHomeFeatureCollections(filtered);
    expect(result.directCards.map((item) => item.id)).toEqual(['private']);
  });
});

function createLeafItem(id: string, label: string, route: string, order: number): SidebarMenuItem {
  return {
    id,
    label,
    route,
    icon: null,
    requiresAuth: false,
    visibleWhenAuthenticated: null,
    order,
    children: null,
  };
}

function createParentItem(
  id: string,
  label: string,
  order: number,
  children: NonNullable<SidebarMenuItem['children']>
): SidebarMenuItem {
  return {
    id,
    label,
    route: null,
    icon: null,
    requiresAuth: false,
    visibleWhenAuthenticated: null,
    order,
    children,
  };
}

function createChild(
  id: string,
  label: string,
  route: string,
  order: number
): NonNullable<SidebarMenuItem['children']>[number] {
  return {
    id,
    label,
    route,
    icon: null,
    requiresAuth: false,
    visibleWhenAuthenticated: null,
    order,
  };
}
