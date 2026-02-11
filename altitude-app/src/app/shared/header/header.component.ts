import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ThemeTogglerComponent } from '../theme-toggler/theme-toggler.component';
import { Router, RouterLink } from '@angular/router';
import { TabStore } from '../../store/tab.store';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, Menu],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  store = inject(TabStore);
  private router = inject(Router);

  @ViewChild('profileMenu') profileMenu!: Menu;

  profileMenuItems: MenuItem[] = [
    {
      label: 'Client Brief',
      icon: 'pi pi-file-edit',
      command: () => this.router.navigate(['/client-brief'])
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog'
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out'
    }
  ];

  setActiveTab(tab: 'home' | 'dashboard') {
    this.store.setActiveTab(tab);
  }

  toggleProfileMenu(event: Event) {
    this.profileMenu.toggle(event);
  }
}
