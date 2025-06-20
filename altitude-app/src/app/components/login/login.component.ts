import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeTogglerComponent } from '../../shared/theme-toggler/theme-toggler.component';
import { routeAnimations } from '../../shared/route-animations';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ThemeTogglerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [routeAnimations],
})
export class LoginComponent {}
