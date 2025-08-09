import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  availableLangs = [
    // --- Tier 1 (Existing) ---
    { code: 'en', name: 'English' },
    { code: 'gu', name: 'ગુજરાતી' }, // Gujarati
    { code: 'hi', name: 'हिंदी' },     // Hindi (Using 'hi' which is the standard ISO 639-1 code)

    // --- Tier 2 ---
    { code: 'nl', name: 'Nederlands' }, // Dutch
    { code: 'he', name: 'עברית' },      // Hebrew
    { code: 'zh-CN', name: '简体中文' },  // Chinese (Simplified)
    { code: 'ru', name: 'Русский' },    // Russian

    // --- Tier 3 ---
    { code: 'th', name: 'ไทย' },         // Thai
    { code: 'fr', name: 'Français' },   // French
    { code: 'pt', name: 'Português' },  // Portuguese
    { code: 'af', name: 'Afrikaans' }    // Afrikaans
  ];

  constructor(public translate: TranslateService) {
    this.initLanguage();
  }

  private initLanguage(): void {
    this.translate.addLangs(this.availableLangs.map(l => l.code));
    const savedLang = localStorage.getItem('app-language');

    if (savedLang && this.availableLangs.some(l => l.code === savedLang)) {
      this.translate.use(savedLang);
    } else {
      // If no saved language, use the default from the module
      this.translate.use(this.translate.getDefaultLang() || 'en');
    }
  }

  setLanguage(langCode: string): void {
    console.log("bg-transparent");
    this.translate.use(langCode);
    localStorage.setItem('app-language', langCode);
  }

  getCurrentLang(): string {
    return this.translate.currentLang;
  }
}