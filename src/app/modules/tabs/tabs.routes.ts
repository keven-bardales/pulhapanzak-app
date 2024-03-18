import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'gallery',
        loadComponent: () =>
          import('../gallery/ui/pages/gallery/gallery.page').then(
            (m) => m.GalleryPage
          ),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('../../modules/home/ui/pages/home/home.page').then(
            (m) => m.HomePage
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            '../../modules/profile/ui/pages/user-profile/user-profile.page'
          ).then((m) => m.UserProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
