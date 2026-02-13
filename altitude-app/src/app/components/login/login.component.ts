import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeTogglerComponent } from '../../shared/theme-toggler/theme-toggler.component';
import { routeAnimations } from '../../shared/route-animations';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  username: string;
  password: string;
}

interface UsersData {
  users: User[];
}

@Component({
  selector: 'app-login',
  imports: [ButtonModule, FormsModule, CommonModule], //add themetoggler component over here
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [routeAnimations],
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;

    this.http.get<UsersData>('assets/users.json').subscribe({
      next: (data) => {
        const user = data.users.find(
          (u) => u.username === this.email && u.password === this.password
        );

        if (user) {
          // Successful login
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Invalid username or password';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errorMessage = 'An error occurred. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
