import { SidebarMenuItem } from '../../layout/shell-menu.models';
import {
  createEmptyHomeFeatureCollectionState,
  createReadyHomeFeatureCollectionState,
  HomeFeatureCard,
  HomeFeatureCollectionState,
  HomeFeatureGroup,
} from './home-page.models';

export interface HomeFeatureCollections {
  readonly directCards: ReadonlyArray<HomeFeatureCard>;
  readonly groups: ReadonlyArray<HomeFeatureGroup>;
}

export function mapSidebarItemsToHomeFeatureCollections(
  items: ReadonlyArray<SidebarMenuItem>
): HomeFeatureCollections {
  const directCards: HomeFeatureCard[] = [];
  const groups: HomeFeatureGroup[] = [];

  for (const item of items) {
    if (item.children !== null && item.children.length > 0) {
      const children = item.children
        .map((child) =>
          createCard({
            id: child.id,
            label: child.label,
            route: child.route,
            icon: child.icon,
            source: 'child',
            parentId: item.id,
            order: child.order,
          })
        )
        .sort((left, right) => left.order - right.order);

      if (children.length > 0) {
        groups.push({
          id: item.id,
          label: normalizeLabel(item.label, item.id),
          icon: item.icon,
          order: item.order,
          children,
          initiallyExpanded: true,
        });
      }

      continue;
    }

    if (item.route === null) {
      continue;
    }

    directCards.push(
      createCard({
        id: item.id,
        label: item.label,
        route: item.route,
        icon: item.icon,
        source: 'top-level',
        parentId: null,
        order: item.order,
      })
    );
  }

  return {
    directCards: directCards.sort((left, right) => left.order - right.order),
    groups: groups.sort((left, right) => left.order - right.order),
  };
}

export function buildHomeFeatureCollectionState(
  items: ReadonlyArray<SidebarMenuItem>,
  actionErrorMessage: string | null = null
): HomeFeatureCollectionState {
  const mapped = mapSidebarItemsToHomeFeatureCollections(items);

  if (mapped.directCards.length === 0 && mapped.groups.length === 0) {
    return createEmptyHomeFeatureCollectionState(actionErrorMessage);
  }

  return createReadyHomeFeatureCollectionState(mapped.directCards, mapped.groups, actionErrorMessage);
}

function createCard(card: HomeFeatureCard): HomeFeatureCard {
  return {
    ...card,
    label: normalizeLabel(card.label, card.id),
  };
}

function normalizeLabel(label: string, fallback: string): string {
  const trimmed = label.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}
