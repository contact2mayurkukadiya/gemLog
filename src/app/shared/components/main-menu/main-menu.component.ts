import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { SharedModule } from '../../shared.module';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    ThemeToggleComponent,
    SharedModule,
    RouterModule
  ],
  templateUrl: './main-menu.component.html'
})
export class MainMenuComponent {
  // Allow the parent component to specify the theme
  @Input() theme: 'light' | 'dark' = 'dark';
  isMobile = input<boolean>(false);

  // Create an output event to notify the parent when an item is clicked
  @Output() menuItemClicked = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
    public languageService: LanguageService
  ) { }

  // All menu logic, including logout, now lives cleanly in this component
  logout(): void {
    this.authService.logout().subscribe({
      complete: () => this.router.navigate(['/auth/login']),
      error: (err: any) => {
        console.error('Logout failed', err);
        this.router.navigate(['/auth/login']);
      },
    });
  }

  get isDark(): boolean {
    return this.themeService.isDarkMode;
  }

  set isDark(value: boolean) {
    // This is called automatically by [(ngModel)] from our custom control
    // You could also add logic to not toggle if the value is the same.
    this.themeService.toggleTheme();
  }



  get selectedLanguage() {
    return this.languageService.getCurrentLang();
  }

  setLanguage(langCode: any) {
    this.languageService.setLanguage(langCode);
  }


  // This method will be called on any menu item click
  onItemClick(): void {
    this.menuItemClicked.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // This prevents the parent's (click) event from firing when the toggle is clicked
  onToggleClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}