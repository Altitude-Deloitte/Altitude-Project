import { ChangeDetectorRef, Component, ViewChild, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AccordionModule } from 'primeng/accordion';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-client',
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    AccordionModule,
    RouterLink,
    OverlayPanelModule,
    FormsModule,
  ],
  templateUrl: './image-client.component.html',
  styleUrl: './image-client.component.css',
})
export class ImageClientComponent {
  @ViewChild('commentPanel') commentPanel!: OverlayPanel;
  commentText: string = '';
  panelStyle: any = {};
  clickEvent?: MouseEvent;
  commentBox = '';
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

  constructor(private aiContentGenerationService: ContentGenerationService, private route: Router) {
    // Watch for chat response from AI chat
    effect(() => {
      const chatResponse = this.aiContentGenerationService.chatResponse();
      if (chatResponse?.result?.generation) {
        this.processChatResponse(chatResponse.result.generation);
      }
    });
  }

  ngOnInit(): void {
    this.contentDisabled = true;

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
      console.log('Form data received:', this.formData);
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
      console.log('getImagegetImage', data);
      if (data) {
        this.imageUrl = data;
        this.isVideoFormat = this.isMp4(data);
      }
      this.contentDisabled = false;
    });

    this.isImageRegenrateDisabled = false;
    this.contentDisabled = true;
  }
  isMp4(url: string): boolean {
    return url.toLowerCase().endsWith('.mp4');
  }

  // Process chat response data
  processChatResponse(generationData: any) {
    console.log('Processing chat response in image client:', generationData);

    // Update component data based on chat response
    if (generationData.image_url) {
      const url = generationData.image_url;
      this.imageUrl = url;
      this.isVideoFormat = this.isMp4(url);
      this.contentDisabled = false;
    }

    // Clear chat response after processing
    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 1000);
  }

  onPanelClick(event: MouseEvent) {
    this.clickEvent = event;
    this.commentPanel.show(event);
  }
  positionPanel(event: any) {
    if (this.clickEvent) {
      this.panelStyle = {
        'left.px': this.clickEvent.clientX,
        'top.px': this.clickEvent.clientY,
      };
    }
  }
  saveComment() { }

  navigateBack(): void {
    this.aiContentGenerationService.setIsBack(true);
    this.route.navigateByUrl('/image-review');
  }
}
