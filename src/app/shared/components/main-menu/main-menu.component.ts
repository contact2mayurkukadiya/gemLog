import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Standalone Imports
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzMenuModule,
    NzIconModule,
  ],
  templateUrl: './main-menu.component.html'
})
export class MainMenuComponent {
  // Allow the parent component to specify the theme
  @Input() theme: 'light' | 'dark' = 'dark';

  // Create an output event to notify the parent when an item is clicked
  @Output() menuItemClicked = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) { }

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

  // This method will be called on any menu item click
  onItemClick(): void {
    this.menuItemClicked.emit();
  }
}