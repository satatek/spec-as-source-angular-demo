import { describe, expect, it, vi } from 'vitest';

import { loadRuntimeConfig, RUNTIME_KEYCLOAK_CONFIG_PATH, validateRuntimeConfig } from './runtime-config.loader';

describe('runtime-config.loader', () => {
  const validPayload = {
    environmentName: 'staging',
    keycloakUrl: 'https://sso.staging.example.com',
    realm: 'demo-staging',
    clientId: 'angular-demo-web',
    silentCheckSsoPath: '/assets/silent-check-sso.html',
    postLoginRoute: '/home',
    postLogoutRoute: '/',
  };

  it('validates a complete runtime config payload and derives active-origin redirect URIs', () => {
    const result = validateRuntimeConfig(validPayload, 'https://demo.example.com');

    expect(result.status).toBe('ready');
    expect(result.message).toBeNull();
    expect(result.settings).toMatchObject({
      environmentName: 'staging',
      keycloakUrl: 'https://sso.staging.example.com',
      realm: 'demo-staging',
      clientId: 'angular-demo-web',
      appOrigin: 'https://demo.example.com',
      silentCheckSsoRedirectUri: 'https://demo.example.com/assets/silent-check-sso.html',
      postLoginRedirectUri: 'https://demo.example.com/home',
      postLogoutRedirectUri: 'https://demo.example.com/',
    });
  });

  it('rejects payloads with missing required values', () => {
    const result = validateRuntimeConfig(
      {
        ...validPayload,
        clientId: '',
      },
      'https://demo.example.com'
    );

    expect(result.status).toBe('invalid');
    expect(result.message).toBe('clientId must be a non-empty string.');
    expect(result.settings).toBeNull();
  });

  it('rejects payloads whose route values are not app-relative', () => {
    const result = validateRuntimeConfig(
      {
        ...validPayload,
        postLoginRoute: 'home',
      },
      'https://demo.example.com'
    );

    expect(result.status).toBe('invalid');
    expect(result.message).toBe("postLoginRoute must be an app-relative path that starts with '/'.");
  });

  it('loads and validates runtime config from the expected public path', async () => {
    const json = vi.fn(async () => validPayload);
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json,
    } as unknown as Response));

    const result = await loadRuntimeConfig(fetchMock as typeof fetch, 'https://demo.example.com');

    expect(fetchMock).toHaveBeenCalledWith(RUNTIME_KEYCLOAK_CONFIG_PATH, {
      cache: 'no-store',
    });
    expect(json).toHaveBeenCalledTimes(1);
    expect(result.postLoginRedirectUri).toBe('https://demo.example.com/home');
  });

  it('throws when the runtime config request fails', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 503,
    } as unknown as Response));

    await expect(loadRuntimeConfig(fetchMock as typeof fetch, 'https://demo.example.com')).rejects.toThrow(
      'Runtime configuration request failed with status 503.'
    );
  });
});