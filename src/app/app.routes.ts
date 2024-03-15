import { Routes } from '@angular/router';
import { AuthGuard } from './modules/shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/pages/login/login.page'),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./modules/auth/pages/register/register.page').then(
        (m) => m.RegistroComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () => import('./modules/home/pages/home/home.page'),
  },
  {
    path: 'profile-page',
    loadComponent: () =>
      import('./modules/user/pages/profile-page/profile-page.page'),
    canActivate: [AuthGuard],
  },
];
