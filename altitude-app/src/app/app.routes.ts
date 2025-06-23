import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'generate-request',
    loadComponent: () =>
      import('./components/generate-request/generate-request.component').then(
        (m) => m.GenerateRequestComponent
      ),
  },
  {
    path: 'review',
    loadComponent: () =>
      import('./components/review/review.component').then(
        (m) => m.ReviewComponent
      ),
  },
];
