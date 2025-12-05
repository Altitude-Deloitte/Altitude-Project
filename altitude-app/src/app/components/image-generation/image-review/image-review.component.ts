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
  selector: 'app-image-review',
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
  templateUrl: './image-review.component.html',
  styleUrl: './image-review.component.css',
})
export class ImageReviewComponent {
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

  // Image regeneration properties
  imageFeedback: string = '';
  isRegeneratingImage: boolean = false;
  imagePayload: FormData | null = null;
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
    this.socketConnection.setWorkflowType('image');
    console.log('ngOnInit - Initial loading state:', this.loading);

    // Check isBack flag from service
    this.aiContentGenerationService.getIsBack().subscribe(isBack => {
      if (isBack) {
        this.clientBack = isBack;
        console.log('🔄 isBack flag is true - keeping loading false');
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
          this.initializeImagePayload();
        });

        this.reloadExistingImageContent();
        return;
      }
    });

    // Check if we already have existing image content (returning from client)
    const hasExistingContentInComponent = this.imageUrl && this.imageUrl.length > 0;

    // Check if service has image data (for when component is recreated)
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

        this.initializeImagePayload();
      });

      // Reload existing content from service
      this.reloadExistingImageContent();
      return; // Skip initialization to avoid clearing existing content
    }

    // NEW GENERATION - Only executed when coming from form
    console.log('🆕 Starting NEW generation from form');

    // Session ID already generated and set in form component - don't regenerate!
    // this.sessionId = this.socketConnection.generateSessionId();
    // this.socketConnection.setSessionId(this.sessionId);
    console.log('🎯 Image review session started (from form)');

    // Socket data already cleared in form component - don't clear again!
    // this.socketConnection.clearAgentData();

    this.contentDisabled = true;

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
      console.log('Image form data received:', this.formData);

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

      this.initializeImagePayload();
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
      if (data) {
        console.log('Image URL received:', data);
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

    if (result.image_url) {
      this.imageUrl = result.image_url;
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

  initializeImagePayload(): void {
    if (!this.formData) return;

    // For image generation, we only need the prompt/brief
    this.imagePayload = new FormData();
    this.imagePayload.append('brief', this.formData?.prompt || '');

    console.log('Image payload initialized with brief:', this.formData?.prompt);
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

    // Use only the feedback as the brief (no combining with original prompt)
    console.log('Regenerating image with brief:', this.imageFeedback);

    // Create FormData for multipart form data
    const imageFormData = new FormData();
    imageFormData.append('brief', this.imageFeedback);

    this.isRegeneratingImage = true;
    // Don't set loading = true for regeneration (keep main loader hidden)

    this.aiContentGenerationService.generateImage(imageFormData, this.sessionId).subscribe({
      next: (response: any) => {
        console.log('Image regenerated:', response);

        if (response?.image_url) {
          this.imageUrl = response.image_url;
          this.isVideoFormat = this.isMp4(this.imageUrl);
          this.aiContentGenerationService.setImage(this.imageUrl);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image regenerated successfully',
          life: 3000,
          styleClass: 'custom-toast-success'
        });

        // Clear feedback input
        this.imageFeedback = '';
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
    this.route.navigateByUrl('image-client');
  }

  // Workflow visualization methods
  getWorkflowAgents(): Array<{ name: string; status: string }> {
    const socketData = this.socketConnection.dataSignal();

    // Define all agents in the correct order (image has only 2 agents)
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

  // Reload existing content from service when returning from client
  reloadExistingImageContent(): void {
    console.log('🔄 Reloading existing image content from service...');

    this.aiContentGenerationService.getImage().subscribe((data) => {
      if (!data) {
        console.log('⚠️ No existing image data found in service');
        return;
      }

      console.log('📥 Reloading existing image data:', data);

      this.imageUrl = data;
      this.isVideoFormat = this.isMp4(data);
      this.contentDisabled = false;

      console.log('✅ Image content reloaded successfully');
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    // Clear session ID to stop receiving socket messages
    this.socketConnection.clearSessionId();
    console.log('🧹 Image review session ended:', this.sessionId);
  }
}

