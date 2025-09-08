import { Routes } from '@angular/router';
import { BlogClientComponent } from './components/blog/blog-client/blog-client.component';
import { BlogReviewComponent } from './components/blog/blog-review/blog-review.component';
import { EmailReviewComponent } from './components/email/email-review/email-review.component';
import { SuccessComponent } from './components/success/success.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientRemarkComponent } from './components/email/client-remark/client-remark.component';
import { GenerateRequestComponent } from './components/generate-request/generate-request.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
    // component: LoginComponent,
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    // component: HomeComponent,
  },
  {
    path: 'generate-request',
    loadComponent: () =>
      import('./components/generate-request/generate-request.component').then(
        (m) => m.GenerateRequestComponent
      ),
    // component: GenerateRequestComponent,
  },

  {
    path: 'client-remark',
    loadComponent: () =>
      import('./components/email/client-remark/client-remark.component').then(
        (m) => m.ClientRemarkComponent
      ),
    // component: ClientRemarkComponent,
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    // component: DashboardComponent,
  },
  {
    path: 'success-page',
    loadComponent: () =>
      import('./components/success/success.component').then(
        (m) => m.SuccessComponent
      ),
    // component: SuccessComponent,
  },
  {
    path: 'email-review',
    loadComponent: () =>
      import('./components/email/email-review/email-review.component').then(
        (m) => m.EmailReviewComponent
      ),
    // component: EmailReviewComponent,
  },
  {
    path: 'blog-review',
    loadComponent: () =>
      import('./components/blog/blog-review/blog-review.component').then(
        (m) => m.BlogReviewComponent
      ),
    // component: BlogReviewComponent,
  },
  {
    path: 'blog-client',
    loadComponent: () =>
      import('./components/blog/blog-client/blog-client.component').then(
        (m) => m.BlogClientComponent
      ),
    // component: BlogClientComponent,
  },
  {
    path: 'social-review',
    loadComponent: () =>
      import('./components/social/social-review/social-review.component').then(
        (m) => m.SocialReviewComponent
      ),
  },
  {
    path: 'social-client',
    loadComponent: () =>
      import('./components/social/social-client/social-client.component').then(
        (m) => m.SocialClientComponent
      ),
  },
  {
    path: 'video-review',
    loadComponent: () =>
      import('./components/video/video-review/video-review.component').then(
        (m) => m.VideoReviewComponent
      ),
  },
  {
    path: 'product-review',
    loadComponent: () =>
      import(
        './components/product/product-review/product-review.component'
      ).then((m) => m.ProductReviewComponent),
  },
  {
    path: 'product-client',
    loadComponent: () =>
      import(
        './components/product/product-client/product-client.component'
      ).then((m) => m.ProductClientComponent),
  },
  {
    path: 'image-review',
    loadComponent: () =>
      import(
        './components/image-generation/image-review/image-review.component'
      ).then((m) => m.ImageReviewComponent),
  },
  {
    path: 'virtual-review',
    loadComponent: () =>
      import(
        './components/virtual/virtual-review/virtual-review.component'
      ).then((m) => m.VirtualReviewComponent),
  },
  {
    path: 'virtual-client',
    loadComponent: () =>
      import(
        './components/virtual/virtual-client/virtual-client.component'
      ).then((m) => m.VirtualClientComponent),
  },
  {
    path: 'image-client',
    loadComponent: () =>
      import(
        './components/image-generation/image-client/image-client.component'
      ).then((m) => m.ImageClientComponent),
  },
  {
    path: 'video-client',
    loadComponent: () =>
      import('./components/video/video-client/video-client.component').then(
        (m) => m.VideoClientComponent
      ),
  },
  {
    path: 'combined-review',
    loadComponent: () =>
      import(
        './components/Combined/combined-review/combined-review.component'
      ).then((m) => m.CombinedReviewComponent),
  },
  {
    path: 'combined-client',
    loadComponent: () =>
      import(
        './components/Combined/combined-client/combined-client.component'
      ).then((m) => m.CombinedClientComponent),
  },
  {
    path: 'meme-creation',
    loadComponent: () =>
      import('./components/meme/meme-creation/meme-creation.component').then(
        (m) => m.MemeCreationComponent
      ),
  },
  {
    path: 'meme-review',
    loadComponent: () =>
      import('./components/meme/meme-review/meme-review.component').then(
        (m) => m.MemeReviewComponent
      ),
  },
];
