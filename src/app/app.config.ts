import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, enableProdMode, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { provideTranslateService, TranslateStore } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import localeEn from '@angular/common/locales/en';
import localeHi from '@angular/common/locales/hi';
import localeNl from '@angular/common/locales/nl';
import localeHe from '@angular/common/locales/he';
import localeZh from '@angular/common/locales/zh';
import localeRu from '@angular/common/locales/ru';
import localeTh from '@angular/common/locales/th';
import localeFr from '@angular/common/locales/fr';
import localePt from '@angular/common/locales/pt';
import localeAf from '@angular/common/locales/af';
import { provideServiceWorker } from '@angular/service-worker';


registerLocaleData(localeEn);
registerLocaleData(localeHi);
registerLocaleData(localeNl);
registerLocaleData(localeHe);
registerLocaleData(localeZh);
registerLocaleData(localeRu);
registerLocaleData(localeTh);
registerLocaleData(localeFr);
registerLocaleData(localePt);
registerLocaleData(localeAf);


if (environment.production) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Enabled only for production builds
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideNzI18n(en_US),
    importProvidersFrom(
      FormsModule,
      NzDrawerModule,
      NzMenuModule
    ),
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: 'i18n/',
        suffix: '.json'
      })
    }),
    TranslateStore,
    provideAnimationsAsync(),
    provideHttpClient(),
    NzModalService, provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
