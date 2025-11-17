import { Routes } from '@angular/router';
import { authGuard } from './Core/guards/auth.guard';
import { isAuthGuard } from './Core/guards/is-auth.guard';

export const routes: Routes = [

    {
        path: 'home',
        loadComponent: () => import('./Pages/home/home').then(m => m.Home)
    },
    {
        path: 'login',
        loadComponent: () => import('./Pages/Auth/login/login').then(m => m.Login),
        canActivate: [isAuthGuard]
    },
    {
        path: 'project/:id',
        loadComponent: () => import('./Pages/project-details/project-details').then(m => m.ProjectDetails)
    },
    {
        path: 'admin',
        loadComponent: () => import('./Pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
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
