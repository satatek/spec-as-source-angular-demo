import { EnvironmentProviders } from '@angular/core';
import { provideKeycloak } from 'keycloak-angular';

const silentCheckSsoRedirectUri = typeof window === 'undefined'
  ? 'http://localhost:4200/assets/silent-check-sso.html'
  : `${window.location.origin}/assets/silent-check-sso.html`;

export function provideAppKeycloak(): EnvironmentProviders {
  return provideKeycloak({
    config: {
      url: 'http://localhost:8080/',
      realm: 'local-demo',
      clientId: 'angular-local-demo',
    },
    initOptions: {
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: true,
      silentCheckSsoRedirectUri,
    },
  });
}