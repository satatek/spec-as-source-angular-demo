export interface SidebarMenuConfig {
  version: string;
  items: SidebarMenuItem[];
}

export interface SidebarMenuChildItem {
  id: string;
  label: string;
  route: string;
  icon: string | null;
  requiresAuth: boolean;
  visibleWhenAuthenticated: boolean | null;
  order: number;
}

export interface SidebarMenuItem {
  id: string;
  label: string;
  route: string | null;
  icon: string | null;
  requiresAuth: boolean;
  visibleWhenAuthenticated: boolean | null;
  order: number;
  children: SidebarMenuChildItem[] | null;
}

export interface SidebarMenuLoadResult {
  status: 'ready' | 'error';
  items: SidebarMenuItem[];
  errorMessage: string | null;
}

export function createSidebarMenuFallback(): SidebarMenuItem[] {
  return [];
}

export function normalizeSidebarMenuConfig(payload: unknown): SidebarMenuItem[] {
  if (!isRecord(payload)) {
    throw new Error('Menu payload must be a JSON object.');
  }

  const version = payload['version'];
  if (typeof version !== 'string' || version.trim().length === 0) {
    throw new Error('Menu payload version must be a non-empty string.');
  }

  const rawItems = payload['items'];
  if (!Array.isArray(rawItems)) {
    throw new Error('Menu payload items must be an array.');
  }

  const itemIds = new Set<string>();
  const normalized = rawItems
    .map((rawItem) => normalizeTopLevelItem(rawItem))
    .filter((item): item is SidebarMenuItem => item !== null)
    .map((item) => {
      if (itemIds.has(item.id)) {
        throw new Error(`Duplicate top-level menu id '${item.id}'.`);
      }
      itemIds.add(item.id);
      return item;
    });

  return normalized.sort((left, right) => left.order - right.order);
}

function normalizeTopLevelItem(rawItem: unknown): SidebarMenuItem | null {
  if (!isRecord(rawItem)) {
    throw new Error('Top-level menu item must be an object.');
  }

  const children = normalizeChildren(rawItem['children']);
  const item = {
    id: readNonEmptyString(rawItem, 'id', 'Top-level menu id is required.'),
    label: readNonEmptyString(rawItem, 'label', 'Top-level menu label is required.'),
    route: normalizeTopLevelRoute(rawItem['route'], children),
    icon: readOptionalString(rawItem, 'icon'),
    requiresAuth: readBooleanWithDefault(rawItem, 'requiresAuth', false),
    visibleWhenAuthenticated: readVisibility(rawItem['visibleWhenAuthenticated']),
    order: readFiniteNumber(rawItem, 'order', 'Top-level menu order is required.'),
    children,
  };

  return item;
}

function normalizeChildren(rawChildren: unknown): SidebarMenuChildItem[] | null {
  if (rawChildren === null || typeof rawChildren === 'undefined') {
    return null;
  }

  if (!Array.isArray(rawChildren)) {
    throw new Error('Top-level menu children must be an array when provided.');
  }

  const childIds = new Set<string>();
  const normalizedChildren = rawChildren
    .map((rawChild) => normalizeChildItem(rawChild))
    .map((child) => {
      if (childIds.has(child.id)) {
        throw new Error(`Duplicate child menu id '${child.id}'.`);
      }
      childIds.add(child.id);
      return child;
    });

  return normalizedChildren.sort((left, right) => left.order - right.order);
}

function normalizeChildItem(rawChild: unknown): SidebarMenuChildItem {
  if (!isRecord(rawChild)) {
    throw new Error('Child menu item must be an object.');
  }

  return {
    id: readNonEmptyString(rawChild, 'id', 'Child menu id is required.'),
    label: readNonEmptyString(rawChild, 'label', 'Child menu label is required.'),
    route: readAppRelativePath(rawChild, 'route', 'Child menu route is required.'),
    icon: readOptionalString(rawChild, 'icon'),
    requiresAuth: readBooleanWithDefault(rawChild, 'requiresAuth', false),
    visibleWhenAuthenticated: readVisibility(rawChild['visibleWhenAuthenticated']),
    order: readFiniteNumber(rawChild, 'order', 'Child menu order is required.'),
  };
}

function normalizeTopLevelRoute(rawRoute: unknown, children: SidebarMenuChildItem[] | null): string | null {
  if (rawRoute === null || typeof rawRoute === 'undefined') {
    if (children && children.length > 0) {
      return null;
    }

    throw new Error('Top-level leaf menu items must define a route.');
  }

  if (typeof rawRoute !== 'string' || !rawRoute.startsWith('/')) {
    throw new Error('Top-level menu route must be app-relative and start with \'/\'.');
  }

  return rawRoute;
}

function readNonEmptyString(source: Record<string, unknown>, key: string, errorMessage: string): string {
  const value = source[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(errorMessage);
  }
  return value;
}

function readOptionalString(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  if (typeof value === 'undefined' || value === null) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new Error(`${key} must be a string when provided.`);
  }
  return value;
}

function readFiniteNumber(source: Record<string, unknown>, key: string, errorMessage: string): number {
  const value = source[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(errorMessage);
  }
  return value;
}

function readBooleanWithDefault(source: Record<string, unknown>, key: string, defaultValue: boolean): boolean {
  const value = source[key];
  if (typeof value === 'undefined') {
    return defaultValue;
  }

  if (typeof value !== 'boolean') {
    throw new Error(`${key} must be a boolean when provided.`);
  }

  return value;
}

function readVisibility(value: unknown): boolean | null {
  if (value === null || typeof value === 'undefined') {
    return null;
  }

  if (typeof value !== 'boolean') {
    throw new Error('visibleWhenAuthenticated must be true, false, or null.');
  }

  return value;
}

function readAppRelativePath(source: Record<string, unknown>, key: string, errorMessage: string): string {
  const value = source[key];
  if (typeof value !== 'string' || !value.startsWith('/')) {
    throw new Error(errorMessage);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
