import {
  ConfigurationValidationOutcome,
  EnvironmentConfigurationProfile,
  KeycloakRuntimeSettings,
  SupportedEnvironmentName,
} from './runtime-config.models';

export const RUNTIME_KEYCLOAK_CONFIG_PATH = '/config/keycloak.json';

type FetchLike = typeof fetch;

export async function loadRuntimeConfig(
  fetchImpl: FetchLike = fetch,
  currentOrigin = readCurrentOrigin()
): Promise<KeycloakRuntimeSettings> {
  const response = await fetchImpl(RUNTIME_KEYCLOAK_CONFIG_PATH, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Runtime configuration request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as unknown;
  const validation = validateRuntimeConfig(payload, currentOrigin);

  if (validation.status !== 'ready' || !validation.settings) {
    throw new Error(validation.message ?? 'Runtime configuration is unavailable.');
  }

  return validation.settings;
}

export function validateRuntimeConfig(
  payload: unknown,
  currentOrigin = readCurrentOrigin()
): ConfigurationValidationOutcome {
  if (!isRecord(payload)) {
    return invalidConfig('Runtime configuration payload must be a JSON object.');
  }

  const environmentName = readEnvironmentName(payload['environmentName']);
  const keycloakUrl = readRequiredString(payload['keycloakUrl'], 'keycloakUrl');
  const realm = readRequiredString(payload['realm'], 'realm');
  const clientId = readRequiredString(payload['clientId'], 'clientId');
  const silentCheckSsoPath = readAppRelativePath(payload['silentCheckSsoPath'], 'silentCheckSsoPath');
  const postLoginRoute = readAppRelativePath(payload['postLoginRoute'], 'postLoginRoute');
  const postLogoutRoute = readAppRelativePath(payload['postLogoutRoute'], 'postLogoutRoute');

  const message =
    environmentName.error ??
    keycloakUrl.error ??
    realm.error ??
    clientId.error ??
    silentCheckSsoPath.error ??
    postLoginRoute.error ??
    postLogoutRoute.error ??
    validateCurrentOrigin(currentOrigin) ??
    validateAbsoluteUrl(keycloakUrl.value, 'keycloakUrl');

  if (message) {
    return invalidConfig(message);
  }

  const appOrigin = currentOrigin.trim();
  const validatedEnvironmentName = environmentName.value;

  if (!validatedEnvironmentName) {
    return invalidConfig('environmentName must be one of development, staging, or production.');
  }

  return {
    status: 'ready',
    message: null,
    settings: {
      environmentName: validatedEnvironmentName,
      keycloakUrl: keycloakUrl.value,
      realm: realm.value,
      clientId: clientId.value,
      appOrigin,
      silentCheckSsoRedirectUri: `${appOrigin}${silentCheckSsoPath.value}`,
      postLoginRoute: postLoginRoute.value,
      postLogoutRoute: postLogoutRoute.value,
      postLoginRedirectUri: `${appOrigin}${postLoginRoute.value}`,
      postLogoutRedirectUri: `${appOrigin}${postLogoutRoute.value}`,
    },
  };
}

function invalidConfig(message: string): ConfigurationValidationOutcome {
  return {
    status: 'invalid',
    message,
    settings: null,
  };
}

function readEnvironmentName(value: unknown): { value: SupportedEnvironmentName; error: null } | { value: null; error: string } {
  if (value === 'development' || value === 'staging' || value === 'production') {
    return { value, error: null };
  }

  return {
    value: null,
    error: 'environmentName must be one of development, staging, or production.',
  };
}

function readRequiredString(value: unknown, fieldName: string): { value: string; error: null } | { value: string; error: string } {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return {
      value: '',
      error: `${fieldName} must be a non-empty string.`,
    };
  }

  return {
    value: value.trim(),
    error: null,
  };
}

function readAppRelativePath(value: unknown, fieldName: string): { value: string; error: null } | { value: string; error: string } {
  const result = readRequiredString(value, fieldName);

  if (result.error) {
    return result;
  }

  if (!result.value.startsWith('/') || result.value.startsWith('//')) {
    return {
      value: result.value,
      error: `${fieldName} must be an app-relative path that starts with '/'.`,
    };
  }

  return result;
}

function validateCurrentOrigin(currentOrigin: string): string | null {
  if (typeof currentOrigin !== 'string' || currentOrigin.trim().length === 0) {
    return 'Current application origin is unavailable.';
  }

  try {
    const parsedOrigin = new URL(currentOrigin);

    if (parsedOrigin.origin !== currentOrigin.trim()) {
      return 'Current application origin must be an absolute origin URL.';
    }

    return null;
  } catch {
    return 'Current application origin must be an absolute origin URL.';
  }
}

function validateAbsoluteUrl(value: string, fieldName: string): string | null {
  try {
    const url = new URL(value);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return `${fieldName} must use http or https.`;
    }

    return null;
  } catch {
    return `${fieldName} must be an absolute URL.`;
  }
}

function readCurrentOrigin(): string {
  if (typeof window === 'undefined' || typeof window.location?.origin !== 'string') {
    return '';
  }

  return window.location.origin;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}