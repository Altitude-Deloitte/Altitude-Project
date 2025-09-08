import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [HeaderComponent],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
})
export class SuccessComponent {
  router = inject(Router);
  navigateToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }
  navigateToHome() {
    this.router.navigateByUrl('/');
  }
}
