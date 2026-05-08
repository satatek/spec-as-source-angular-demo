import { EnvironmentProviders } from '@angular/core';
import { provideKeycloak } from 'keycloak-angular';

import { KeycloakRuntimeSettings } from '../config/runtime-config.models';

type KeycloakProviderOptions = Parameters<typeof provideKeycloak>[0];

export function buildKeycloakProviderOptions(runtimeSettings: KeycloakRuntimeSettings): KeycloakProviderOptions {
  return {
    config: {
      url: runtimeSettings.keycloakUrl,
      realm: runtimeSettings.realm,
      clientId: runtimeSettings.clientId,
    },
    initOptions: {
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: true,
      silentCheckSsoRedirectUri: runtimeSettings.silentCheckSsoRedirectUri,
    },
  };
}

export function provideAppKeycloak(runtimeSettings: KeycloakRuntimeSettings): EnvironmentProviders {
  return provideKeycloak(buildKeycloakProviderOptions(runtimeSettings));
}