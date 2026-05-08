import { bootstrapApplication } from '@angular/platform-browser';

import { createAppConfig } from './app/app.config';
import { formatRuntimeConfigError, renderRuntimeConfigError } from './app/core/config/bootstrap-error';
import { loadRuntimeConfig } from './app/core/config/runtime-config.loader';
import { AppComponent } from './app/app.component';

async function bootstrapApp(): Promise<void> {
  const runtimeSettings = await loadRuntimeConfig();

  await bootstrapApplication(AppComponent, createAppConfig(runtimeSettings));
}

void bootstrapApp().catch((err) => {
  console.error(err);
  renderRuntimeConfigError(document, formatRuntimeConfigError(err));
});
