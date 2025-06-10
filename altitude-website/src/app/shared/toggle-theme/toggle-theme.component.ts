import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button, ButtonModule } from 'primeng/button';
import { ThemeService } from '../../services/theme.service';
@Component({
  selector: 'app-toggle-theme',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './toggle-theme.component.html',
  styleUrl: './toggle-theme.component.css',
})
export class ToggleThemeComponent {
  public themeService = inject(ThemeService);
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
