import { Routes } from '@angular/router';
import { authGuard } from './Core/guards/auth.guard';
import { isAuthGuard } from './Core/guards/is-auth.guard';

export const routes: Routes = [

    {
        path: 'home',
        loadComponent: () => import('./Pages/home/home').then(m => m.Home),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./Pages/Auth/login/login').then(m => m.Login),
        canActivate: [isAuthGuard]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
