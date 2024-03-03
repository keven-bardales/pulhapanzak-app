import { Routes } from '@angular/router';

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
];
