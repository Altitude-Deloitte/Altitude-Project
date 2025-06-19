import { Component, computed, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ThemeToggleService } from '../../services/theme-toggle.service';
@Component({
  selector: 'app-home',
  imports: [HeaderComponent, SelectModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  requestOptions = [
    { name: 'Email Request', code: 'email', icon: 'assets/images/email.svg' },
    {
      name: 'Social Media Campaign',
      code: 'social',
      icon: 'assets/images/InstagramLogo.svg',
    },
    {
      name: 'Product Description',
      code: 'Product',
      icon: 'assets/images/FileText.svg',
    },
    {
      name: 'Website Blog',
      code: 'website',
      icon: 'assets/images/FileText.svg',
    },
    { name: 'Virtual Try On', code: 'virtual', icon: 'assets/images/cube.svg' },
    { name: 'AI Video', code: 'video', icon: 'assets/images/Video.svg' },
    { name: 'Image Animation', code: 'image', icon: 'assets/images/icon.svg' },
    { name: 'Combined', code: 'combined', icon: 'assets/images/cube.svg' },
    // Add more options as needed
  ];
  source: any;
  selectedRequests: any;
  theme = inject(ThemeToggleService);
  ngOnInit() {
    // Initialize selectedRequests with the first option
    this.theme.source$.subscribe((source) => {
      this.source = source;
    });

    if (this.requestOptions.length > 0) {
      this.selectedRequests = this.requestOptions[0];
    }
    console.log(this.selectedRequests);
  }
}
