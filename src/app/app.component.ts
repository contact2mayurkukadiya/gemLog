import { Component, effect, Signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { User } from '@angular/fire/auth';
import { map, Observable, Subscription, take } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { MenuService, NzMenuModule } from 'ng-zorro-antd/menu';
import { MainMenuComponent } from './shared/components/main-menu/main-menu.component';
import { MobileActionBarComponent } from './shared/components/mobile-action-bar/mobile-action-bar.component';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';
import { FirestoreService } from './core/services/firestore.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PwaUpdateService } from './core/services/pwa-update.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';

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
  private authSubscription!: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private languageService: LanguageService,
    private themeService: ThemeService,
    private pwaUpdateService: PwaUpdateService,
    private modal: NzModalService,
    private translate: TranslateService
  ) {
    this.user$ = this.authService.user$;
    this.isMobile = toSignal(
      this.breakpointObserver
        .observe([Breakpoints.Handset, Breakpoints.Tablet])
        .pipe(map(result => result.matches))
    );

    effect(() => {
      const updateEvent = this.pwaUpdateService.updateReadySignal();
      console.log("updateEvent====>", updateEvent);
      if (updateEvent?.type === 'VERSION_READY') {
        this.showUpdateNotification();
      }
    });
  }

  ngOnInit(): void {
    this.pwaUpdateService.initializeUpdateCheck();

    this.authSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        this.loadUserPreferences(user);
      } else {
        this.resetUserPreferences();
      }
    });
  }

  showUpdateNotification(): void {
    const translationKeys = [
      'VERSION_UPGRADE_NOTIFICATION_TITLE',
      'VERSION_UPGRADE_NOTIFICATION_CONTENT',
      'VERSION_UPGRADE_NOTIFICATION_OK_BUTTON'
    ];


    this.translate.get(translationKeys).pipe(
      take(1)
    ).subscribe(translations => {

      this.modal.confirm({
        nzTitle: translations['VERSION_UPGRADE_NOTIFICATION_TITLE'],
        nzContent: translations['VERSION_UPGRADE_NOTIFICATION_CONTENT'],
        nzOkText: translations['VERSION_UPGRADE_NOTIFICATION_OK_BUTTON'],
        nzOkType: 'primary',
        nzOkDanger: true,
        nzCancelText: null,
        nzCentered: true,
        nzMaskClosable: false,
        nzClosable: false,
        nzOnOk: () => {
          this.pwaUpdateService.activateUpdate();
        },
      });

    });
  }

  get currentTheme() {
    return this.themeService.isDarkMode ? 'dark' : 'light';
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

  resetUserPreferences(): void {
    this.languageService.resetToDefault();
    this.themeService.loadInitialTheme();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }


}
