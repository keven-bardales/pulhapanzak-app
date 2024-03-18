import { Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../app/modules/tabs/tabs.routes').then((m) => m.routes),
    canActivate: [() => inject(AuthGuard).canActivate()],
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
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
