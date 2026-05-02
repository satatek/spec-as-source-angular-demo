export interface KeycloakProfileViewModel {
  subject: string;
  displayName: string;
  username: string | null;
  email: string | null;
  emailVerified: boolean | null;
  firstName: string | null;
  lastName: string | null;
}