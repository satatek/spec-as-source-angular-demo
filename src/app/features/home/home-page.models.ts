export type HomeFeatureCollectionStatus = 'ready' | 'empty' | 'error';

export interface HomeFeatureCard {
  readonly id: string;
  readonly label: string;
  readonly route: string;
  readonly icon: string | null;
  readonly source: 'top-level' | 'child';
  readonly parentId: string | null;
  readonly order: number;
}

export interface HomeFeatureGroup {
  readonly id: string;
  readonly label: string;
  readonly icon: string | null;
  readonly order: number;
  readonly children: ReadonlyArray<HomeFeatureCard>;
  readonly initiallyExpanded: boolean;
}

export interface HomeFeatureCollectionState {
  readonly status: HomeFeatureCollectionStatus;
  readonly directCards: ReadonlyArray<HomeFeatureCard>;
  readonly groups: ReadonlyArray<HomeFeatureGroup>;
  readonly errorMessage: string | null;
  readonly actionErrorMessage: string | null;
}

export function createEmptyHomeFeatureCollectionState(
  actionErrorMessage: string | null = null
): HomeFeatureCollectionState {
  return {
    status: 'empty',
    directCards: [],
    groups: [],
    errorMessage: null,
    actionErrorMessage,
  };
}

export function createErrorHomeFeatureCollectionState(
  errorMessage: string,
  actionErrorMessage: string | null = null
): HomeFeatureCollectionState {
  return {
    status: 'error',
    directCards: [],
    groups: [],
    errorMessage,
    actionErrorMessage,
  };
}

export function createReadyHomeFeatureCollectionState(
  directCards: ReadonlyArray<HomeFeatureCard>,
  groups: ReadonlyArray<HomeFeatureGroup>,
  actionErrorMessage: string | null = null
): HomeFeatureCollectionState {
  if (directCards.length === 0 && groups.length === 0) {
    return createEmptyHomeFeatureCollectionState(actionErrorMessage);
  }

  return {
    status: 'ready',
    directCards,
    groups,
    errorMessage: null,
    actionErrorMessage,
  };
}