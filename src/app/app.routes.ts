import { Routes } from '@angular/router';
import { authGuard } from './Core/guards/auth.guard';
import { isAuthGuard } from './Core/guards/is-auth.guard';
import { Login } from './Pages/Auth/login/login';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Layout/main-outlet/main-outlet').then(m => m.MainOutlet),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./Pages/home/home').then(m => m.Home)
      },
      {
        path: 'project/:id',
        loadComponent: () =>
          import('./Pages/project-details/project-details').then(m => m.ProjectDetails)
      }
    ]
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./Layout/admin-layout/admin-layout').then(m => m.AdminLayout),
        canActivate: [authGuard] ,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./Pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
      }
     
    ]
  },

  {
    path: 'login',
    component: Login,
  },

  // fallback
  {
    path: '**',
    redirectTo: ''
  }
];
