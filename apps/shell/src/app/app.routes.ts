import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'profile',
    loadChildren: () => import('profile/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'panel',
    loadChildren: () => import('panel/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'tasks',
    loadChildren: () => import('tasks/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('dashboard/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    loadChildren: () => import('dashboard/Routes').then((m) => m!.remoteRoutes),
  },
];
