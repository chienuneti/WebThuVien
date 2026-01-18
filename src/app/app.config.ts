import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AuthService } from './shared/services/auth.service';
import { AuthServiceMock } from './shared/services/auth.service.mock';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    
    // Use mock or real auth service based on environment
    {
      provide: AuthService,
      useClass: environment.useMockBackend ? AuthServiceMock : AuthService,
    },
  ]
};
