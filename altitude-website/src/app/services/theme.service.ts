import { effect, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme';

  // Signal for reactive theme state
  public theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Effect to apply theme changes to document
    effect(() => {
      this.applyTheme(this.theme());
    });
  }

  private getInitialTheme(): Theme {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    return 'light';
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Add new theme class
    root.classList.add(theme);

    // Save to localStorage
    localStorage.setItem(this.THEME_KEY, theme);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  }

  private updateMetaThemeColor(theme: Theme): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = theme === 'dark' ? '#040105' : '#ffffff';

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    }
  }

  public toggleTheme(): void {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
  }

  public setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  public isDark(): boolean {
    return this.theme() === 'dark';
  }

  public isLight(): boolean {
    return this.theme() === 'light';
  }
}
