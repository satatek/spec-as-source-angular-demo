import { describe, expect, it } from 'vitest';

import { buildKeycloakProviderOptions } from './keycloak.config';

describe('keycloak.config', () => {
  it('builds provider options from validated runtime settings', () => {
    const result = buildKeycloakProviderOptions({
      environmentName: 'production',
      keycloakUrl: 'https://sso.example.com',
      realm: 'demo-prod',
      clientId: 'angular-demo-web',
      appOrigin: 'https://app.example.com',
      silentCheckSsoRedirectUri: 'https://app.example.com/assets/silent-check-sso.html',
      postLoginRoute: '/home',
      postLogoutRoute: '/',
      postLoginRedirectUri: 'https://app.example.com/home',
      postLogoutRedirectUri: 'https://app.example.com/',
    });

    expect(result).toEqual({
      config: {
        url: 'https://sso.example.com',
        realm: 'demo-prod',
        clientId: 'angular-demo-web',
      },
      initOptions: {
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: true,
        silentCheckSsoRedirectUri: 'https://app.example.com/assets/silent-check-sso.html',
      },
    });
  });

  it('uses the active-origin redirect URIs supplied by runtime settings rather than localhost defaults', () => {
    const result = buildKeycloakProviderOptions({
      environmentName: 'staging',
      keycloakUrl: 'https://sso.staging.example.com',
      realm: 'demo-staging',
      clientId: 'angular-demo-web',
      appOrigin: 'https://staging.example.com',
      silentCheckSsoRedirectUri: 'https://staging.example.com/assets/silent-check-sso.html',
      postLoginRoute: '/home',
      postLogoutRoute: '/',
      postLoginRedirectUri: 'https://staging.example.com/home',
      postLogoutRedirectUri: 'https://staging.example.com/',
    });

    expect(result.initOptions?.silentCheckSsoRedirectUri).toBe(
      'https://staging.example.com/assets/silent-check-sso.html'
    );
    expect(JSON.stringify(result)).not.toContain('localhost');
  });
});