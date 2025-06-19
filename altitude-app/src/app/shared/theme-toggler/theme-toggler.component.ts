import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-toggler',
  imports: [CommonModule],
  templateUrl: './theme-toggler.component.html',
  styleUrl: './theme-toggler.component.css',
})
export class ThemeTogglerComponent implements OnInit {
  isDarkMode: boolean = false;

  ngOnInit() {
    //   const storedTheme = localStorage.getItem('theme');
    //   this.isDarkMode = storedTheme === 'dark';
    //   this.updateTheme();
    // }
    // toggleTheme() {
    //   this.isDarkMode = !this.isDarkMode;
    //   localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    //   this.updateTheme();
    // }
    // updateTheme() {
    //   const htmlElement = document.documentElement;
    //   if (this.isDarkMode) {
    //     htmlElement.classList.add('dark');
    //   } else {
    //     htmlElement.classList.remove('dark');
    //   }
  }
}
