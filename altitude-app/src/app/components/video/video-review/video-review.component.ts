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
  loading = true; // Start as true to show loader immediately on navigation, will be set to false when content loads
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
  clientBack = false;

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

    // Watch for socket completion signal
    effect(() => {
      const allCompleted = this.socketConnection.allAgentsCompleted();

      if (allCompleted && this.loading) {
        setTimeout(() => {
          this.loading = false;
          this.socketConnection.disconnect();
        }, 500);
      }
    });
  }

  private sessionId: string = ''; // Unique session ID for this component instance

  ngOnInit(): void {
    this.socketConnection.setWorkflowType('video');
    console.log('ngOnInit - Initial loading state:', this.loading);

    // Check isBack flag from service
    this.aiContentGenerationService.getIsBack().subscribe(isBack => {
      if (isBack) {
        this.clientBack = isBack;
        console.log('� isBack flag is true - keeping loading false');
        this.loading = false;
        this.contentDisabled = false;
        // Reset the flag after checking


        // Get formData and reload existing content
        this.aiContentGenerationService.getData().subscribe((data) => {
          this.formData = data;
          if (this.clientBack) {
            console.log('🔄 Returning from client - loading saved data instantly');
            this.loading = false;
          } else {
            this.loading = true;

          }
          this.initializeVideoPayload();
        });

        this.reloadExistingVideoContent();
        return;
      }
    });

    // Check if we already have existing video content (returning from client)
    const hasExistingContentInComponent = this.imageUrl && this.imageUrl.length > 0;

    // Check if service has video data (for when component is recreated)
    let hasExistingContentInService = false;
    this.aiContentGenerationService.getImage().subscribe(data => {
      hasExistingContentInService = !!data;
    }).unsubscribe();

    const hasExistingContent = hasExistingContentInComponent || hasExistingContentInService;

    if (hasExistingContent) {
      console.log('🔄 Returning from client screen - preserving state, NOT clearing data');
      this.loading = false; // Ensure loading stays false
      this.contentDisabled = false;

      // Still need to get formData for display purposes
      this.aiContentGenerationService.getData().subscribe((data) => {
        this.formData = data;

        // Check isBack flag in getData as well
        this.aiContentGenerationService.getIsBack().subscribe(isBack => {
          if (isBack) {
            this.loading = false;
            this.aiContentGenerationService.setIsBack(false);
          }
        });

        this.initializeVideoPayload();
      });

      // Reload existing content from service
      this.reloadExistingVideoContent();
      return; // Skip initialization to avoid clearing existing content
    }

    // NEW GENERATION - Only executed when coming from form
    console.log('🆕 Starting NEW generation from form');

    // Session ID already generated and set in form component - don't regenerate!
    // this.sessionId = this.socketConnection.generateSessionId();
    // this.socketConnection.setSessionId(this.sessionId);
    console.log('🎯 Video review session started (from form)');

    // Socket data already cleared in form component - don't clear again!
    // this.socketConnection.clearAgentData();

    this.contentDisabled = true;

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
      console.log('Video form data received:', this.formData);

      // Check isBack flag before setting loading to true
      this.aiContentGenerationService.getIsBack().subscribe(isBack => {
        if (!isBack && data && Object.keys(data).length > 0) {
          console.log('🆕 Form data received - starting new generation, loading set to true');
          this.loading = true;

        } else if (isBack) {
          console.log('🔄 isBack flag is true in getData - keeping loading false');
          this.loading = false;
          this.aiContentGenerationService.setIsBack(false);
        }
      });

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
    // this.socketConnection.disconnect();

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

    this.aiContentGenerationService.generateVoeVideo(videoFormData, this.sessionId).subscribe({
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
  getWorkflowAgents(): Array<{ name: string; status: string }> {
    const socketData = this.socketConnection.dataSignal();

    // Define all agents in the correct order (video has only 2 agents)
    const agentOrder = [
      'prompt generation agent',
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

  // Reload existing content from service when returning from client
  reloadExistingVideoContent(): void {
    console.log('🔄 Reloading existing video content from service...');

    this.aiContentGenerationService.getImage().subscribe((data) => {
      if (!data) {
        console.log('⚠️ No existing video data found in service');
        return;
      }

      console.log('📥 Reloading existing video data:', data);

      this.imageUrl = data;
      this.isVideoFormat = this.isMp4(data);
      this.contentDisabled = false;

      console.log('✅ Video content reloaded successfully');
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    // Clear session ID to stop receiving socket messages
    this.socketConnection.clearSessionId();
    console.log('🧹 Video review session ended:', this.sessionId);
  }
}

