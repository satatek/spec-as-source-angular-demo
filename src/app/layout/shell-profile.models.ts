import { AuthSessionState } from '../core/auth/auth.models';
import { KeycloakProfileViewModel } from '../core/auth/profile.models';

export interface HeaderProfileState {
  isAuthenticated: boolean;
  displayEmail: string | null;
  displayLabel: string;
  iconName: string;
  isLoading: boolean;
  errorMessage: string | null;
  canOpenAccount: boolean;
  canLogoff: boolean;
  canLogin: boolean;
}

export type ProfileActionId = 'open-profile' | 'logoff' | 'login';

export interface ProfileActionItem {
  id: ProfileActionId;
  label: string;
  requiresAuth: boolean;
  isDestructive: boolean;
  targetRoute: string | null;
}

export const PROFILE_ACTION_ITEMS: readonly ProfileActionItem[] = [
  {
    id: 'open-profile',
    label: 'Profile',
    requiresAuth: true,
    isDestructive: false,
    targetRoute: '/account',
  },
  {
    id: 'logoff',
    label: 'Log off',
    requiresAuth: true,
    isDestructive: true,
    targetRoute: null,
  },
  {
    id: 'login',
    label: 'Sign in',
    requiresAuth: false,
    isDestructive: false,
    targetRoute: '/home',
  },
];

export function buildHeaderProfileState(
  session: AuthSessionState,
  profile: KeycloakProfileViewModel | null
): HeaderProfileState {
  const isAuthenticated = session.isAuthenticated;
  const displayEmail = isAuthenticated ? profile?.email ?? profile?.username ?? null : null;

  return {
    isAuthenticated,
    displayEmail,
    displayLabel: isAuthenticated ? displayEmail ?? profile?.displayName ?? 'Account' : 'Guest',
    iconName: isAuthenticated ? 'account_circle' : 'person',
    isLoading: session.status === 'checking' || session.status === 'signing-out',
    errorMessage: session.lastErrorMessage,
    canOpenAccount: isAuthenticated,
    canLogoff: isAuthenticated,
    canLogin: !isAuthenticated,
  };
}

export function getVisibleProfileActions(profileState: HeaderProfileState): readonly ProfileActionItem[] {
  return PROFILE_ACTION_ITEMS.filter((action) => {
    if (action.requiresAuth) {
      return profileState.isAuthenticated;
    }

    return true;
  });
}