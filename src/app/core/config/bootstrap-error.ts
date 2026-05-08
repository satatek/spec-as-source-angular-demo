const DEFAULT_RUNTIME_CONFIG_ERROR_MESSAGE =
  'The application could not load its environment configuration. Update /config/keycloak.json and reload the page.';

export function formatRuntimeConfigError(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return DEFAULT_RUNTIME_CONFIG_ERROR_MESSAGE;
}

export function renderRuntimeConfigError(documentRef: Document, message: string): void {
  const mountTarget = documentRef.querySelector('app-root') ?? documentRef.body;
  const wrapper = documentRef.createElement('section');
  const title = documentRef.createElement('h1');
  const body = documentRef.createElement('p');

  wrapper.setAttribute('role', 'alert');
  wrapper.setAttribute('aria-live', 'assertive');
  wrapper.style.maxWidth = '42rem';
  wrapper.style.margin = '4rem auto';
  wrapper.style.padding = '1.5rem';
  wrapper.style.border = '1px solid #d93025';
  wrapper.style.borderRadius = '0.75rem';
  wrapper.style.background = '#fff5f4';
  wrapper.style.color = '#6a1b17';
  wrapper.style.fontFamily = 'system-ui, sans-serif';

  title.textContent = 'Application configuration error';
  title.style.marginTop = '0';
  body.textContent = message;

  wrapper.append(title, body);
  mountTarget.replaceChildren(wrapper);
}
