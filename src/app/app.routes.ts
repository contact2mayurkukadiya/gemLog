import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PriceTiersComponent } from './settings/price-tiers/price-tiers.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'settings',
        component: PriceTiersComponent,
        canActivate: [AuthGuard]
    },
    // {
    //     path: 'log',
    //     loadChildren: () => import('./log-entry/log-entry.module').then(m => m.LogEntryModule),
    //     canActivate: [AuthGuard]
    // },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    { path: '**', redirectTo: '/auth/login' }
];
