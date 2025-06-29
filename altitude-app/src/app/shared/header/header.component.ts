import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeTogglerComponent } from '../theme-toggler/theme-toggler.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ThemeTogglerComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
