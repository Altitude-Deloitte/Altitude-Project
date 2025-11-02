import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeToggleService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(true);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();
  // to change the source of the video based on the theme
  private sourceBehaviourSubject = new BehaviorSubject<string>('');
  public source$ = this.sourceBehaviourSubject.asObservable();
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   const storedTheme = localStorage.getItem('theme');
    //   const prefersDark = window.matchMedia(
    //     '(prefers-color-scheme: dark)'
    //   ).matches;

    //   const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
    //   this.setTheme(isDark);
    // }
    this.setTheme(true)
  }

  setTheme(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);

    // if (isPlatformBrowser(this.platformId)) {
    // const htmlElement = document.documentElement;

    if (isDark) {
      // htmlElement.classList.add('dark');
      this.sourceBehaviourSubject.next('assets/videos/dark-particles.mp4');
      // localStorage.setItem('theme', 'dark');
    } else {
      this.sourceBehaviourSubject.next(
        'assets/videos/vecteezy_abstract-motion-background-animation-with-a-beautiful-gently_26592036.mp4'
      );
      // htmlElement.classList.remove('dark');
      // localStorage.setItem('theme', 'light');
    }
    // }
  }

  toggleTheme(): void {
    const currentTheme = this.isDarkModeSubject.value;
    this.setTheme(!currentTheme);
  }

  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}
