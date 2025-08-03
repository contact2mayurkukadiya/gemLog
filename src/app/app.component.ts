import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { User } from '@angular/fire/auth';
import { map, Observable } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { MenuService, NzMenuModule } from 'ng-zorro-antd/menu';
import { MainMenuComponent } from './shared/components/main-menu/main-menu.component';

@Component({
  selector: 'app-root',
  imports: [
    MainMenuComponent,
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
  isMobile$: Observable<boolean>;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {
    this.user$ = this.authService.user$;
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(map(result => result.matches));

    this.isMobile$.subscribe(isMobile => {
      if (isMobile) {
        console.log('Mobile view detected', isMobile);
      } else {
        console.log('Desktop view detected', isMobile);
      }
    });
  }

}
