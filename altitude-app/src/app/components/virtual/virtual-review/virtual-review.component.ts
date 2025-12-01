import { Component, Input, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AccordionModule } from 'primeng/accordion';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { NgOptimizedImage } from '@angular/common';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { SocketConnectionService } from '../../../services/socket-connection.service';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-virtual-review',
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    AccordionModule,
    RouterLink,
    FormsModule,
    SliderModule,
    SkeletonModule,
    LoaderComponent,
    InputTextModule,
    ToastModule,
    DrawerModule,
  ],
  providers: [MessageService],
  templateUrl: './virtual-review.component.html',
  styleUrl: './virtual-review.component.css',
})
export class VirtualReviewComponent {
  imageUrl: any;
  formData: any;
  contentDisabled = false;
  loading = true;
  //silder
  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  isImageRegenrateDisabled = false;
  widthSlider = '1';
  heightSlider = '';
  positionSlider = '';
  showAgenticWorkflow = false;

  // Regeneration properties
  imageFeedback: string = '';
  isRegeneratingImage: boolean = false;
  virtualPayload: FormData | null = null;

  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService,
    public socketConnection: SocketConnectionService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {
    // Watch for chat response
    effect(() => {
      const chatResponse = this.aiContentGenerationService.chatResponse();
      if (chatResponse?.result) {
        this.processChatResponse(chatResponse.result);
      }
    });
  }

  ngOnInit(): void {
    this.contentDisabled = true;
    this.loading = true;

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
      console.log('Form data received:', this.formData);
      this.initializeVirtualPayload();
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
      console.log('getImagegetImage', data);
      if (data) {
        this.imageUrl = data;
      }
      this.contentDisabled = false;
      this.loading = false;
    });

    this.isImageRegenrateDisabled = false;
  }

  processChatResponse(result: any): void {
    console.log('Processing chat response:', result);

    if (result.image_url) {
      this.imageUrl = result.image_url;
    }

    this.loading = false;
    this.contentDisabled = false;
    this.isImageRegenrateDisabled = false;

    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 300);
  }

  // Initialize virtual payload from form data or collected data from chat-app
  initializeVirtualPayload(): void {
    if (!this.formData) return;

    this.virtualPayload = new FormData();

    // Use collected data structure (from chat-app) if available, otherwise use formData (from virtual-form)
    const useCase = this.formData?.use_case || 'Virtual Try-On';
    const purpose = this.formData?.purpose || '';
    const brand = this.formData?.brand || '';
    const tone = this.formData?.tone || '';
    const topic = this.formData?.topic || '';
    const targetReader = this.formData?.target_reader || '';
    const imageDetails = this.formData?.image_details || '';

    this.virtualPayload.append('use_case', useCase);
    this.virtualPayload.append('purpose', purpose);
    this.virtualPayload.append('brand', brand);

    if (tone && tone.trim() !== '') {
      this.virtualPayload.append('tone', tone);
    }
    if (topic && topic.trim() !== '') {
      this.virtualPayload.append('topic', topic);
    }
    if (targetReader && targetReader.trim() !== '') {
      this.virtualPayload.append('target_reader', targetReader);
    }
    if (imageDetails && imageDetails.trim() !== '') {
      this.virtualPayload.append('image_details', imageDetails);
    }
    if (this.formData?.url1) {
      this.virtualPayload.append('url1', this.formData.url1);
    }
    if (this.formData?.url2) {
      this.virtualPayload.append('url2', this.formData.url2);
    }
    if (this.formData?.additional && this.formData?.additional.trim() !== '') {
      this.virtualPayload.append('additional_details', this.formData?.additional);
    }
  }

  regenerateImage(): void {
    if (!this.imageFeedback || this.imageFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter image feedback to regenerate',
        life: 3000
      });
      return;
    }

    // Reinitialize payload to ensure all form data is fresh
    this.initializeVirtualPayload();

    // Add image feedback and regenerate flag to payload
    this.virtualPayload?.append('image_feedback', this.imageFeedback);
    this.virtualPayload?.append('regenerate', 'true');

    this.isRegeneratingImage = true;
    // Don't set loading = true for regeneration (keep loader hidden)
    this.contentDisabled = true;

    this.aiContentGenerationService.generateContent(this.virtualPayload!).subscribe({
      next: (data) => {
        console.log('Image regenerated:', data);

        // Process the regenerated response using the same handler
        if (data?.result) {
          this.processChatResponse(data.result);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image regenerated successfully',
          life: 3000
        });

        this.imageFeedback = '';

        // Reinitialize payload for next regeneration
        this.initializeVirtualPayload();
      },
      error: (error) => {
        console.error('Error regenerating image:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate image. Please try again.',
          life: 3000
        });
        this.isRegeneratingImage = false;
        this.contentDisabled = false;
      },
      complete: () => {
        this.isRegeneratingImage = false;
        this.contentDisabled = false;
      }
    });
  }
  necklaceWidthMultiplier: String | undefined;
  necklaceYOffset: String | undefined;
  necklaceLeftOffset: String | undefined;
  // Save function
  saveValues(widthMultiplier: string, yOffset: string, leftOffset: string) {
    this.isImageRegenrateDisabled = true;
    // Log and alert the saved values
    console.log('Saved Values:', {
      ulr2: this.formData?.url1,
      url2: this.formData?.url2,
      necklaceWidthMultiplier: widthMultiplier,
      necklaceYOffset: yOffset,
      necklaceLeftOffset: leftOffset,
    });
    this.necklaceWidthMultiplier = widthMultiplier;
    this.necklaceYOffset = yOffset;
    this.necklaceLeftOffset = leftOffset;

    this.aiContentGenerationService
      .saveForm(
        this.formData?.url1,
        this.formData?.url2,
        this.formData?.prompt1,
        this.necklaceWidthMultiplier,
        this.necklaceYOffset,
        this.necklaceLeftOffset,
        this.formData?.position
      )
      .subscribe(
        (response) => {
          console.log('Response banner:', response);
          this.imageUrl = response.imageUrl;
          console.log('banner image:', this.imageUrl);
          this.aiContentGenerationService.setImage(this.imageUrl);
          // Handle the response, maybe navigate to another component to display the image
          this.isImageRegenrateDisabled = false;
        },
        (error) => {
          console.error('Error:', error);
          this.isImageRegenrateDisabled = false;
        }
      );
  }
  navigateToForm(): void {
    this.route.navigateByUrl('virtual-client');
    // this.chnge.detectChanges();
  }

  // Workflow visualization methods
  getWorkflowAgents(): Array<{ name: string; status: string }> {
    const socketData = this.socketConnection.dataSignal();

    // Define all agents in the correct order
    const agentOrder = [
      'Extraction Agent',
      'prompt generation agent',
      'content generation agent',
      'reviewer agent'
    ];

    // Map agents with their current status from socket data or default to 'PENDING'
    return agentOrder.map(agentName => {
      // Try case-insensitive matching to handle "Reviewer Agent" vs "reviewer agent"
      const normalizedName = agentName.toLowerCase();
      const matchingKey = Object.keys(socketData).find(key => key.toLowerCase() === normalizedName);
      const agentData = matchingKey ? socketData[matchingKey] : null;

      return {
        name: agentName,
        status: agentData?.status || 'PENDING'
      };
    });
  } getLineColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#22c55e'; // Green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#eab308'; // Yellow
      case 'FAILED':
        return '#ef4444'; // Red
      case 'PENDING':
      default:
        return '#6b7280'; // Gray
    }
  }

  getMarkerUrl(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'url(#arrowGreen)';
      case 'IN_PROGRESS':
      case 'STARTED':
        return 'url(#arrowYellow)';
      case 'PENDING':
      default:
        return 'url(#arrowGray)';
    }
  }

  getNodeColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#1e3a2e'; // Dark green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#3a2e1e'; // Dark yellow/orange
      case 'FAILED':
        return '#3a1e1e'; // Dark red
      case 'PENDING':
      default:
        return '#1e1e1e'; // Dark gray
    }
  }

  getStatusIconColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#22c55e'; // Green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#eab308'; // Yellow
      case 'FAILED':
        return '#ef4444'; // Red
      case 'PENDING':
      default:
        return '#6b7280'; // Gray
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#86efac'; // Light green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#fde047'; // Light yellow
      case 'FAILED':
        return '#fca5a5'; // Light red
      case 'PENDING':
      default:
        return '#d1d5db'; // Light gray
    }
  }

  trackByIndex(index: number): number { return index; }

  appendToContentFeedback(text: string): void {
    if (this.imageFeedback) {
      this.imageFeedback += ' ' + text;
    } else {
      this.imageFeedback = text;
    }
  }
}

