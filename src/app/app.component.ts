import { Component, Signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { User } from '@angular/fire/auth';
import { map, Observable, take } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { MenuService, NzMenuModule } from 'ng-zorro-antd/menu';
import { MainMenuComponent } from './shared/components/main-menu/main-menu.component';
import { MobileActionBarComponent } from './shared/components/mobile-action-bar/mobile-action-bar.component';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';
import { FirestoreService } from './core/services/firestore.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    MainMenuComponent,
    MobileActionBarComponent,
    NzMenuModule,
    SharedModule,
    RouterModule,
    RouterOutlet,
  ],
  providers: [MenuService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  drawerVisible = false;
  user$: Observable<User | null>;
  isMobile: Signal<boolean | undefined>;



  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {
    this.user$ = this.authService.user$;
    this.isMobile = toSignal(
      this.breakpointObserver
        .observe([Breakpoints.Handset, Breakpoints.Tablet])
        .pipe(map(result => result.matches))
    );
  }

  ngOnInit(): void {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.loadUserPreferences(user);
      }
    });
  }

  loadUserPreferences(user: User): void {
    this.firestoreService.getUserData(user.uid).pipe(take(1)).subscribe(prefs => {
      if (prefs) {
        if (prefs.language) {
          this.languageService.loadInitialLanguageForUser(prefs.language);
        }
        if (prefs.theme) {
          this.themeService.loadInitialThemeForUser(prefs.theme);
        }
      }
    });
  }
}
