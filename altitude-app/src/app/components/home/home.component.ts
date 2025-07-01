import {
  Component,
  computed,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ThemeToggleService } from '../../services/theme-toggle.service';
import { routeAnimations } from '../../shared/route-animations';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SelectionStore } from '../../store/campaign.store';
@Component({
  selector: 'app-home',
  imports: [HeaderComponent, SelectModule, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [routeAnimations],
})
export class HomeComponent implements OnInit {
  // @HostBinding('@routeAnimations') routeAnimations = true;
  router = inject(Router);
  store = inject(SelectionStore);
  requestOptions = [
    { name: 'Email Request', code: 'email', icon: 'assets/images/email.svg' },
    {
      name: 'Social Media Campaign',
      code: 'social',
      icon: 'assets/images/InstagramLogo.svg',
    },
    {
      name: 'Product Description',
      code: 'product',
      icon: 'assets/images/FileText.svg',
    },
    {
      name: 'Website Blog',
      code: 'blog',
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
  generateContent() {
    if (this.selectedRequests) {
      this.store.setCampaignType(this.selectedRequests);
    }
    this.router.navigate(['/generate-request']);
  }
}
