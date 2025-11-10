import { Component, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule, KeyValue } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AccordionModule } from 'primeng/accordion';
import { SocketConnectionService } from '../../../services/socket-connection.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-video-review',
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    AccordionModule,
    RouterLink,
    ProgressSpinnerModule,
    LoaderComponent,
    FormsModule,
    InputTextModule,
    ToastModule,
    DrawerModule,
  ],
  providers: [MessageService],
  templateUrl: './video-review.component.html',
  styleUrl: './video-review.component.css',
})
export class VideoReviewComponent {
  imageUrl: any;
  formData: any;
  contentDisabled = false;
  isVideoFormat = false;
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
  currentDate: any = new Date();
  currentsDate: any = this.currentDate.toISOString().split('T')[0];
  showAgenticWorkflow = false;

  // Video regeneration properties
  imageFeedback: string = '';
  isRegeneratingImage: boolean = false;
  videoPayload: FormData | null = null;

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
    // Clear socket data before starting to prevent old messages from showing
    this.socketConnection.clearAgentData();

    this.contentDisabled = true;

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
      console.log('Video form data received:', this.formData);
      this.initializeVideoPayload();
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
      if (data) {
        console.log('Video URL received:', data);
        this.imageUrl = data;
        this.isVideoFormat = this.isMp4(data);
        this.contentDisabled = false;
        this.loading = false;
      }
    });

    this.isImageRegenrateDisabled = false;
  }

  processChatResponse(result: any): void {
    console.log('Processing chat response:', result);

    if (result.video_url || result.image_url) {
      this.imageUrl = result.video_url || result.image_url;
      this.isVideoFormat = this.isMp4(this.imageUrl);
    }

    this.loading = false;
    this.contentDisabled = false;
    this.isImageRegenrateDisabled = false;

    // Disconnect socket after content is loaded
    this.socketConnection.disconnect();

    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 300);
  }

  initializeVideoPayload(): void {
    if (!this.formData) return;

    // For video generation, we only need the prompt/brief
    this.videoPayload = new FormData();
    this.videoPayload.append('brief', this.formData?.prompt || '');

    console.log('Video payload initialized with brief:', this.formData?.prompt);
  }

  regenerateVideo(): void {
    if (!this.imageFeedback || this.imageFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter video feedback to regenerate',
        life: 3000
      });
      return;
    }

    // Use only the feedback as the brief (no combining with original prompt)
    console.log('Regenerating video with brief:', this.imageFeedback);

    // Create FormData for multipart form data
    const videoFormData = new FormData();
    videoFormData.append('brief', this.imageFeedback);

    this.isRegeneratingImage = true;
    // Don't set loading = true for regeneration (keep main loader hidden)

    this.aiContentGenerationService.generateVoeVideo(videoFormData).subscribe({
      next: (response: any) => {
        console.log('Video regenerated:', response);

        if (response?.video_url) {
          this.imageUrl = response.video_url;
          this.isVideoFormat = this.isMp4(this.imageUrl);
          this.aiContentGenerationService.setImage(this.imageUrl);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Video regenerated successfully',
          life: 3000,
          styleClass: 'custom-toast-success'
        });

        // Clear feedback input
        this.imageFeedback = '';
      },
      error: (error) => {
        console.error('Error regenerating video:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate video. Please try again.',
          life: 3000
        });
        this.isRegeneratingImage = false;
      },
      complete: () => {
        this.isRegeneratingImage = false;
      }
    });
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

  // Workflow visualization methods
  getWorkflowAgents(): Array<{ name: string; status: string; updatedAt: string }> {
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
      const agentData = socketData[agentName];
      return {
        name: agentName,
        status: agentData?.status || 'PENDING',
        updatedAt: agentData?.updatedAt || '--:--:--'
      };
    });
  }

  getLineColor(status: string): string {
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

  // generateVideo(): void {
  //   if (!this.videoPrompt || this.videoPrompt.trim() === '') {
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Warning',
  //       detail: 'Please enter a prompt to generate video',
  //       life: 3000
  //     });
  //     return;
  //   }

  //   if (!this.videoPayload) {
  //     this.initializeVideoPayload();
  //   }

  //   this.videoPayload?.append('prompt', this.videoPrompt);

  //   this.isGeneratingVideo = true;
  //   this.loading = true;

  //   this.aiContentGenerationService.generateVoeVideo(this.videoPayload!).subscribe({
  //     next: (data) => {
  //       console.log('Video generated:', data);

  //       if (data?.result?.video_url || data?.result?.image_url) {
  //         this.imageUrl = data.result.video_url || data.result.image_url;
  //         this.isVideoFormat = this.isMp4(this.imageUrl);
  //       }

  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Video generated successfully',
  //         life: 3000,
  //         styleClass: 'custom-toast-success'
  //       });

  //       this.videoPrompt = '';
  //       this.initializeVideoPayload();
  //     },
  //     error: (error) => {
  //       console.error('Error generating video:', error);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Failed to generate video. Please try again.',
  //         life: 3000
  //       });
  //     },
  //     complete: () => {
  //       this.isGeneratingVideo = false;
  //       this.loading = false;
  //     }
  //   });
  // }
}

