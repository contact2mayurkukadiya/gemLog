import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: 'light' | 'dark' = 'light';
  private darkThemeLinkEl: HTMLLinkElement | undefined;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadInitialTheme();
  }

  get isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }


  loadInitialTheme() {
    const localTheme = localStorage.getItem('app-theme') as 'light' | 'dark';
    if (localTheme) {
      this.setTheme(localTheme, false);
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setTheme('dark', false);
      } else {
        this.setTheme('light', false);
      }
    }
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme, true);
  }


  private setTheme(themeName: 'light' | 'dark', saveToDb: boolean = true): void {
    if (this.currentTheme === themeName) return;

    this.currentTheme = themeName;
    localStorage.setItem('app-theme', themeName);
    const userId = this.authService.getCurrentUserId();
    if (saveToDb && userId) {
      this.firestoreService.updateUserPreferences(userId, { theme: themeName }).subscribe();
    }

    if (themeName === 'dark') {
      // Switch to Dark Theme
      this.renderer.addClass(this.document.body, 'dark-theme');
      this.loadDarkThemeCss();
    } else {
      // Switch to Light Theme
      this.renderer.removeClass(this.document.body, 'dark-theme');
      this.removeDarkThemeCss();
    }
  }

  loadInitialThemeForUser(savedTheme: 'light' | 'dark'): void {
    if (savedTheme) {
      this.setTheme(savedTheme, false); // Don't re-save it to the DB
    }
  }


  private loadDarkThemeCss() {
    // Create the <link> tag for the dark theme CSS file
    this.darkThemeLinkEl = this.renderer.createElement('link');
    this.renderer.setAttribute(this.darkThemeLinkEl, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.darkThemeLinkEl, 'href', 'theme-dark.css');
    this.renderer.setAttribute(this.darkThemeLinkEl, 'id', 'dark-theme-style'); // Give it an ID to find it later
    this.renderer.appendChild(this.document.head, this.darkThemeLinkEl);
  }

  private removeDarkThemeCss() {
    const existingLink = this.document.getElementById('dark-theme-style');
    if (existingLink) {
      this.renderer.removeChild(this.document.head, existingLink);
      this.darkThemeLinkEl = undefined;
    }
  }
}