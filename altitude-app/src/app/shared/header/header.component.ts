import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ThemeTogglerComponent } from '../theme-toggler/theme-toggler.component';
import { RouterLink } from '@angular/router';
import { TabStore } from '../../store/tab.store';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, ThemeTogglerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  store = inject(TabStore);
  setActiveTab(tab: 'home' | 'dashboard') {
    this.store.setActiveTab(tab);
  }
}
