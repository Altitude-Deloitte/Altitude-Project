import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AccordionModule } from 'primeng/accordion';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { SocketConnectionService } from '../../../services/socket-connection.service';
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
  showAgenticWorkflow = false;

  // Regeneration properties
  imageFeedback: string = '';
  isRegeneratingImage: boolean = false;
  imagePayload: FormData | null = null;

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
      this.initializeImagePayload();
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
      console.log('getImagegetImage', data);
      if (data) {
        this.imageUrl = data;
        this.isVideoFormat = this.isMp4(data);
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
      this.isVideoFormat = this.isMp4(result.image_url);
    }

    this.loading = false;
    this.contentDisabled = false;
    this.isImageRegenrateDisabled = false;

    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 300);
  }

  // Initialize image payload from form data or collected data from chat-app
  initializeImagePayload(): void {
    if (!this.formData) return;

    this.imagePayload = new FormData();

    // Use collected data structure (from chat-app) if available, otherwise use formData (from image-form)
    const useCase = this.formData?.use_case || 'Image Generation';
    const purpose = this.formData?.purpose || '';
    const brand = this.formData?.brand || '';
    const tone = this.formData?.tone || '';
    const topic = this.formData?.topic || '';
    const targetReader = this.formData?.target_reader || '';
    const imageDetails = this.formData?.image_details || '';
    const imageDescription = this.formData?.image_description || this.formData?.imageOpt || this.formData?.imgDesc || '';

    this.imagePayload.append('use_case', useCase);
    this.imagePayload.append('purpose', purpose);
    this.imagePayload.append('brand', brand);
    this.imagePayload.append('tone', tone);
    this.imagePayload.append('topic', topic);

    if (targetReader && targetReader.trim() !== '') {
      this.imagePayload.append('target_reader', targetReader);
    }
    if (imageDetails && imageDetails.trim() !== '') {
      this.imagePayload.append('image_details', imageDetails);
    }
    if (imageDescription && imageDescription.trim() !== '') {
      this.imagePayload.append('image_description', imageDescription);
    }
    if (this.formData?.additional && this.formData?.additional.trim() !== '') {
      this.imagePayload.append('additional_details', this.formData?.additional);
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
    this.initializeImagePayload();

    // Add image feedback and regenerate flag to payload
    this.imagePayload?.append('image_feedback', this.imageFeedback);
    this.imagePayload?.append('regenerate', 'true');

    this.isRegeneratingImage = true;
    this.loading = true;

    this.aiContentGenerationService.generateContent(this.imagePayload!).subscribe({
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
        this.initializeImagePayload();
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
        this.loading = false;
      },
      complete: () => {
        this.isRegeneratingImage = false;
        this.loading = false;
      }
    });
  }
  isMp4(url: string): boolean {
    return url.toLowerCase().endsWith('.mp4');
  }

  navigateToForm(): void {
    this.route.navigateByUrl('image-client');
  }
  navigateToSuccess(): void {
    this.route
      .navigate(['/success-page'])
      .then(() => {
        console.log('Navigation to success page completed');
      })
      .catch((error) => {
        console.error('Navigation error:', error);
      });
  }

  // Workflow visualization methods
  getWorkflowAgents() { const socketData = this.socketConnection.dataSignal(); const agentOrder = ['Extraction Agent', 'prompt generation agent', 'content generation agent', 'reviewer agent']; return agentOrder.map((agentName, index) => { const agentData = socketData[agentName]; const previousAgentName = index > 0 ? agentOrder[index - 1] : null; const previousAgentData = previousAgentName ? socketData[previousAgentName] : null; return { name: agentName, status: agentData?.status || 'COMPLETED', updatedAt: agentData?.updatedAt || '--:--:--', previousStatus: previousAgentData?.status || 'COMPLETED' }; }); }
  getLineColor(currentStatus: string, previousStatus?: string): string { if (previousStatus === 'COMPLETED' && (currentStatus === 'IN_PROGRESS' || currentStatus === 'STARTED')) return '#eab308'; if (currentStatus === 'COMPLETED') return '#22c55e'; return 'transparent'; }
  getMarkerUrl(currentStatus: string, previousStatus?: string): string { if (previousStatus === 'COMPLETED' && (currentStatus === 'IN_PROGRESS' || currentStatus === 'STARTED')) return 'url(#arrowYellow)'; if (currentStatus === 'COMPLETED') return 'url(#arrowGreen)'; return ''; }
  shouldShowDashedLine(currentStatus: string, previousStatus?: string): boolean { return previousStatus === 'COMPLETED' && (currentStatus === 'IN_PROGRESS' || currentStatus === 'STARTED'); }
  getNodeColor(): string { return '#1e1e1e'; }
  getStatusIconColor(status: string): string { switch (status) { case 'COMPLETED': return '#22c55e'; case 'IN_PROGRESS': case 'STARTED': return 'transparent'; case 'FAILED': return '#ef4444'; default: return '#6b7280'; } }
  getStatusTextColor(status: string): string { switch (status) { case 'COMPLETED': return '#86efac'; case 'IN_PROGRESS': case 'STARTED': return '#fde047'; case 'FAILED': return '#fca5a5'; default: return '#d1d5db'; } }
  showStatusDot(status: string): boolean { return status === 'COMPLETED'; }
  showBorderAnimation(status: string): boolean { return status === 'IN_PROGRESS' || status === 'STARTED'; }
  trackByIndex(index: number): number { return index; }
  appendToContentFeedback(text: string): void {
    if (this.imageFeedback) {
      this.imageFeedback += ' ' + text;
    } else {
      this.imageFeedback = text;
    }
  }
}

