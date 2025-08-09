import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FirestoreService } from "./firestore.service";
import { AuthService } from "./auth.service";
import { NzI18nService, en_US, hi_IN, nl_NL, he_IL, zh_CN, ru_RU, th_TH, fr_FR, pt_PT } from 'ng-zorro-antd/i18n';
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
interface AppLocale {
  ngZorro: any;
  dateFns: any;
}


@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  availableLangs = [
    { code: 'en', name: 'English' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'hi', name: 'हिंदी' },

    { code: 'nl', name: 'Nederlands' }, // Dutch
    { code: 'he', name: 'עברית' },      // Hebrew
    { code: 'zh-CN', name: '简体中文' },  // Chinese (Simplified)
    { code: 'ru', name: 'Русский' },    // Russian

    { code: 'th', name: 'ไทย' },         // Thai
    { code: 'fr', name: 'Français' },   // French
    { code: 'pt', name: 'Português' },  // Portuguese
    { code: 'af', name: 'Afrikaans' }    // Afrikaans
  ];

  private locales: { [key: string]: AppLocale } = {
    'en': { ngZorro: en_US, dateFns: localeEn },
    'gu': { ngZorro: en_US, dateFns: localeEn },  // Fallback to en_US for Zorro, but use gu for date-fns
    'hi': { ngZorro: hi_IN, dateFns: localeHi },
    'nl': { ngZorro: nl_NL, dateFns: localeNl },
    'he': { ngZorro: he_IL, dateFns: localeHe },
    'zh-CN': { ngZorro: zh_CN, dateFns: localeZh },
    'ru': { ngZorro: ru_RU, dateFns: localeRu },
    'th': { ngZorro: th_TH, dateFns: localeTh },
    'fr': { ngZorro: fr_FR, dateFns: localeFr },
    'pt': { ngZorro: pt_PT, dateFns: localePt },
    'af': { ngZorro: en_US, dateFns: localeAf } // Fallback to en_US for Zorro, but use af for date-fns
  };



  constructor(
    public translate: TranslateService,
    private nzI18nService: NzI18nService,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    this.initLanguage();
  }

  private initLanguage(): void {
    this.translate.addLangs(this.availableLangs.map(l => l.code));
    const localLang = localStorage.getItem('app-language') || this.translate.getDefaultLang() || 'en';
    this.setLanguage(localLang, false);
  }

  setLanguage(langCode: string, saveToDb: boolean = true): void {
    if (!this.locales[langCode]) return;

    // 1. Set language for ngx-translate and NG-ZORRO
    this.translate.use(langCode);
    const localeData = this.locales[langCode];
    this.nzI18nService.setLocale({ ...localeData.ngZorro, dateLocale: localeData.dateFns });
    localStorage.setItem('app-language', langCode); // Keep local storage for instant loads

    // 2. Save preference to Firestore if requested
    const userId = this.authService.getCurrentUserId();
    if (saveToDb && userId) {
      this.firestoreService.updateUserPreferences(userId, { language: langCode }).subscribe();
    }
  }

  loadInitialLanguageForUser(savedLang: string): void {
    if (savedLang) {
      this.setLanguage(savedLang, false); // Don't re-save it to the DB
    }
  }


  getCurrentLang(): string {
    return this.translate.currentLang;
  }
}