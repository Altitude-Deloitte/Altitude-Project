import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule, KeyValue } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AccordionModule } from 'primeng/accordion';
import { SocketConnectionService } from '../../../services/socket-connection.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-video-review',
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    AccordionModule,
    RouterLink,
    ProgressSpinnerModule
  ],
  templateUrl: './video-review.component.html',
  styleUrl: './video-review.component.css',
})
export class VideoReviewComponent {
  imageUrl: any;
  formData: any;
  contentDisabled = false;
  isVideoFormat = false;
  //silder
  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  isImageRegenrateDisabled = false;
  currentDate: any = new Date();
  currentsDate: any = this.currentDate.toISOString().split('T')[0];
  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService,
    public socketConnection: SocketConnectionService
  ) { }

  ngOnInit(): void {
    this.contentDisabled = true;
    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
        setTimeout(() => {
      if (data) {
        this.imageUrl = data;
        this.isVideoFormat = this.isMp4(data);
      }
      this.contentDisabled = false;
       }, 3000);
    });

    this.isImageRegenrateDisabled = false;
    this.contentDisabled = true;
  }
  isMp4(url: string): boolean {
    return url.toLowerCase().endsWith('.mp4');
  }
  keepOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0; // Or implement custom sorting logic if needed
  }
  navigateToForm(): void {
    this.route.navigateByUrl('video-client');
  }
}
