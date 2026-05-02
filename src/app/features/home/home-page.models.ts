import { AuthSessionState } from '../../core/auth/auth.models';
import { KeycloakProfileViewModel } from '../../core/auth/profile.models';

export interface HomeProfileField {
  label: string;
  value: string;
  missing?: boolean;
}

export interface HomePageState {
  greeting: string;
  profileFields: HomeProfileField[];
  profileWarning: string | null;
  canLogoff: boolean;
  isLogoffInProgress: boolean;
  logoffErrorMessage: string | null;
}

export function buildHomePageState(
  profile: KeycloakProfileViewModel | null,
  session: AuthSessionState
): HomePageState {
  if (!profile) {
    return {
      greeting: 'Welcome back.',
      profileFields: [],
      profileWarning: 'We could not load your Keycloak profile yet.',
      canLogoff: session.status !== 'signing-out',
      isLogoffInProgress: session.status === 'signing-out',
      logoffErrorMessage: session.status === 'error' && session.isAuthenticated ? session.lastErrorMessage : null,
    };
  }

  const profileFields: HomeProfileField[] = [
    createField('Subject', profile.subject),
    createField('Display name', profile.displayName),
    createField('Username', profile.username),
    createField('Email', profile.email),
    createField('First name', profile.firstName),
    createField('Last name', profile.lastName),
    createField(
      'Email verified',
      profile.emailVerified === null ? null : profile.emailVerified ? 'Yes' : 'No'
    ),
  ];

  const missingCount = profileFields.filter((field) => field.missing).length;

  return {
    greeting: `Welcome, ${profile.displayName}.`,
    profileFields,
    profileWarning:
      missingCount > 0
        ? 'Some profile fields are not available from Keycloak for this account.'
        : null,
    canLogoff: session.status !== 'signing-out',
    isLogoffInProgress: session.status === 'signing-out',
    logoffErrorMessage: session.status === 'error' && session.isAuthenticated ? session.lastErrorMessage : null,
  };
}

function createField(label: string, value: string | null): HomeProfileField {
  if (!value) {
    return {
      label,
      value: 'Not provided',
      missing: true,
    };
  }

  return {
    label,
    value,
  };
}