import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LogFormComponent } from '../log-entry/log-form/log-form.component';


@Component({
  selector: 'app-dashboard',
  imports: [
    SharedModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  cards = [
    {
      title: 'Create Pricing',
      icon: 'dollar',
      description: 'Set or update prices for your diamond tiers.',
      action: () => this.router.navigate(['/settings'])
    },
    {
      title: 'Add Diamond Log',
      icon: 'form',
      description: 'Enter your daily diamond count in a quick-entry modal.',
      action: () => this.openAddLogModal() // <-- This action is different
    },
    {
      title: 'View Monthly Log',
      icon: 'table',
      description: 'Review your earnings in a detailed monthly grid.',
      action: () => this.router.navigate(['/dashboard/monthly-view'])
    }
  ];

  constructor(private router: Router, private modalService: NzModalService) { }

  // A method to handle navigation. You could also use routerLink directly.
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  openAddLogModal(): void {
    this.modalService.create({
      nzTitle: 'Add Today\'s Diamond Log',
      nzContent: LogFormComponent,
      nzWidth: '800px',
      nzFooter: null,
    });
  }
}
