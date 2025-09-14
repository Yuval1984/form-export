import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mockPostInterceptor } from './form-export/utils/mock-interceptor.handler';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToasterConfig } from './form-export/interfaces/toasterConfig.interface';

const toasterConfig: ToasterConfig = {
  timeOut: 3000,
  positionClass: 'toast-bottom-right',
  preventDuplicates: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([mockPostInterceptor])),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot(toasterConfig),
      NgxSpinnerModule
    ),
  ],
};
