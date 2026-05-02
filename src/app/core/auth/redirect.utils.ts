export function sanitizeAppRedirectTarget(value: string | null | undefined, fallback = '/home'): string {
  if (!value || !value.startsWith('/')) {
    return fallback;
  }

  if (value.startsWith('//') || value.includes('://')) {
    return fallback;
  }

  return value;
}