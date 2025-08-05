import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-action-bar',
  imports: [
    SharedModule,
    RouterModule
  ],
  templateUrl: './mobile-action-bar.component.html',
  styleUrl: './mobile-action-bar.component.scss'
})
export class MobileActionBarComponent {
  actions = [
    {
      label: 'Home',
      icon: 'appstore',
      route: '/dashboard'
    },
    {
      label: 'Add Log',
      icon: 'form',
      route: '/log/add'
    },
    {
      label: 'Pricing',
      icon: 'dollar',
      route: '/settings'
    }
  ];

}
