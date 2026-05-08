import { describe, expect, it } from 'vitest';

import { formatRuntimeConfigError, renderRuntimeConfigError } from './bootstrap-error';

describe('bootstrap-error', () => {
  it('formats explicit runtime config errors for display', () => {
    expect(formatRuntimeConfigError(new Error('Runtime configuration request failed with status 404.'))).toBe(
      'Runtime configuration request failed with status 404.'
    );
  });

  it('renders an accessible configuration error inside app-root', () => {
    document.body.innerHTML = '<app-root></app-root>';

    renderRuntimeConfigError(document, 'Runtime configuration payload must be a JSON object.');

    const alert = document.querySelector('app-root [role="alert"]');
    expect(alert?.textContent).toContain('Application configuration error');
    expect(alert?.textContent).toContain('Runtime configuration payload must be a JSON object.');
  });
});
