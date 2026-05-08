export type SupportedEnvironmentName = 'development' | 'staging' | 'production';

export interface EnvironmentConfigurationProfile {
  environmentName: SupportedEnvironmentName;
  keycloakUrl: string;
  realm: string;
  clientId: string;
  silentCheckSsoPath: string;
  postLoginRoute: string;
  postLogoutRoute: string;
}

export interface KeycloakRuntimeSettings {
  environmentName: SupportedEnvironmentName;
  keycloakUrl: string;
  realm: string;
  clientId: string;
  appOrigin: string;
  silentCheckSsoRedirectUri: string;
  postLoginRoute: string;
  postLogoutRoute: string;
  postLoginRedirectUri: string;
  postLogoutRedirectUri: string;
}

export interface ConfigurationValidationOutcome {
  status: 'ready' | 'missing' | 'invalid';
  message: string | null;
  settings: KeycloakRuntimeSettings | null;
}