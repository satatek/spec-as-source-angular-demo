export type SessionStatus = 'checking' | 'authenticated' | 'anonymous' | 'error';

export interface AuthSessionState {
  status: SessionStatus;
  isAuthenticated: boolean;
  loginUrlRequested: boolean;
  lastErrorMessage: string | null;
  redirectTarget: string | null;
}

export const initialAuthSessionState: AuthSessionState = {
  status: 'checking',
  isAuthenticated: false,
  loginUrlRequested: false,
  lastErrorMessage: null,
  redirectTarget: null,
};