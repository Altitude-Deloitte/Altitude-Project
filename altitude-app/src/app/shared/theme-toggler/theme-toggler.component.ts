import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeToggleService } from '../../services/theme-toggle.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggler',
  imports: [CommonModule],
  templateUrl: './theme-toggler.component.html',
  styleUrl: './theme-toggler.component.css',
})
export class ThemeTogglerComponent implements OnInit, OnDestroy {
  isDarkMode: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private themeService: ThemeToggleService) {}

  ngOnInit() {
    this.subscription.add(
      this.themeService.isDarkMode$.subscribe((isDark) => {
        this.isDarkMode = isDark;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
