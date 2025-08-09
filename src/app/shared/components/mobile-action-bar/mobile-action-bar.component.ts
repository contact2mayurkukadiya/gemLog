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
      label: 'HOME',
      icon: 'appstore',
      route: '/dashboard'
    },
    {
      label: 'ADD_LOG',
      icon: 'form',
      route: '/log/add'
    },
    {
      label: 'CREATE_PRICING',
      icon: 'dollar',
      route: '/settings'
    }
  ];

}
