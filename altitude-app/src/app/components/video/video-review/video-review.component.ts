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
import { SelectModule } from 'primeng/select';

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
    SelectModule,
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

  imageFeedback: string = '';
  isRegeneratingImage: boolean = false;
  videoPayload: FormData | null = null;
  clientBack = false;

  aspectRatioOptions = [
    { label: '16:9', value: '16:9' },
    { label: '9:16', value: '9:16' }
  ];
  selectedRegenAspectRatio: string = '16:9';

  formatStyleOptions = [
    { label: 'Cinematic', value: 'Cinematic' },
    { label: 'Talking Head', value: 'Talking Head' },
    { label: 'Motion Graphic', value: 'Motion Graphic' },
    { label: 'Fast-cut Montage', value: 'Fast-cut Montage' }
  ];
  selectedRegenFormatStyle: string = '';

  toneOptions = [
    { label: 'Bold', value: 'Bold' },
    { label: 'Premium', value: 'Premium' },
    { label: 'Playful', value: 'Playful' },
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Informative', value: 'Informative' }
  ];
  selectedRegenTone: string = '';

  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService,
    public socketConnection: SocketConnectionService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {
    effect(() => {
      const chatResponse = this.aiContentGenerationService.chatResponse();
      if (chatResponse?.result) {
        this.processChatResponse(chatResponse.result);
      }
    });

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

  private sessionId: string = '';

  ngOnInit(): void {
    this.socketConnection.setWorkflowType('video');

    this.aiContentGenerationService.getIsBack().subscribe(isBack => {
      if (isBack) {
        this.clientBack = isBack;
        this.loading = false;
        this.contentDisabled = false;


        this.aiContentGenerationService.getData().subscribe((data) => {
          this.formData = data;
          if (this.clientBack) {
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

    const hasExistingContentInComponent = this.imageUrl && this.imageUrl.length > 0;

    let hasExistingContentInService = false;
    this.aiContentGenerationService.getImage().subscribe(data => {
      hasExistingContentInService = !!data;
    }).unsubscribe();

    const hasExistingContent = hasExistingContentInComponent || hasExistingContentInService;

    if (hasExistingContent) {
      this.loading = false;
      this.contentDisabled = false;

      this.aiContentGenerationService.getData().subscribe((data) => {
        this.formData = data;

        this.aiContentGenerationService.getIsBack().subscribe(isBack => {
          if (isBack) {
            this.loading = false;
            this.aiContentGenerationService.setIsBack(false);
          }
        });

        this.initializeVideoPayload();
      });

      this.reloadExistingVideoContent();
      return;
    }

    this.contentDisabled = true;

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;

      this.aiContentGenerationService.getIsBack().subscribe(isBack => {
        if (!isBack && data && Object.keys(data).length > 0) {
          this.loading = true;
        } else if (isBack) {
          this.loading = false;
          this.aiContentGenerationService.setIsBack(false);
        }
      });

      this.initializeVideoPayload();
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
      if (data) {
        this.imageUrl = data;
        this.isVideoFormat = this.isMp4(data);
        this.contentDisabled = false;
        this.loading = false;
      }
    });

    this.isImageRegenrateDisabled = false;
  }

  processChatResponse(result: any): void {
    if (result.video_url || result.image_url) {
      this.imageUrl = result.video_url || result.image_url;
      this.isVideoFormat = this.isMp4(this.imageUrl);
    }

    this.loading = false;
    this.contentDisabled = false;
    this.isImageRegenrateDisabled = false;

    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 300);
  }

  initializeVideoPayload(): void {
    if (!this.formData) return;

    this.videoPayload = new FormData();
    this.videoPayload.append('brief', this.formData?.prompt || '');

    this.selectedRegenAspectRatio = this.formData?.aspectRatio || '16:9';
    this.selectedRegenFormatStyle = this.formData?.formatStyle || '';
    this.selectedRegenTone = this.formData?.tone || '';
  }

  buildRegenerationPrompt(feedback: string): string {
    let prompt = feedback?.trim() || '';
    const settings: string[] = [];
    if (this.selectedRegenTone) settings.push(`with ${this.selectedRegenTone.toLowerCase()} tone`);
    if (this.selectedRegenFormatStyle) settings.push(`in ${this.selectedRegenFormatStyle.toLowerCase()} format style`);
    if (settings.length > 0) {
      prompt = prompt ? `${prompt} ${settings.join(', ')}` : settings.join(', ');
    }
    return prompt;
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

    const constructedBrief = this.buildRegenerationPrompt(this.imageFeedback);

    const videoFormData = new FormData();
    videoFormData.append('brief', constructedBrief);

    this.isRegeneratingImage = true;

    this.aiContentGenerationService.generateVoeVideo(videoFormData, this.sessionId, this.selectedRegenAspectRatio).subscribe({
      next: (response: any) => {
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

        this.imageFeedback = '';
      },
      error: (error) => {
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
    return 0;
  }

  downloadVideo(): void {
    if (!this.imageUrl) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No video available to download',
        life: 3000
      });
      return;
    }

    const link = document.createElement('a');
    link.href = this.imageUrl;
    const urlParts = this.imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1] || `video_${Date.now()}.mp4`;
    link.download = filename.includes('.') ? filename : `${filename}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Video download started',
      life: 3000
    });
  }

  getWorkflowAgents(): Array<{ name: string; status: string }> {
    const socketData = this.socketConnection.dataSignal();

    const agentOrder = [
      'prompt generation agent',
      'reviewer agent'
    ];

    return agentOrder.map(agentName => {
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
        return '#22c55e';
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#eab308';
      case 'FAILED':
        return '#ef4444';
      case 'PENDING':
      default:
        return '#6b7280';
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
        return '#1e3a2e';
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#3a2e1e';
      case 'FAILED':
        return '#3a1e1e';
      case 'PENDING':
      default:
        return '#1e1e1e';
    }
  }

  getStatusIconColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#22c55e';
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#eab308';
      case 'FAILED':
        return '#ef4444';
      case 'PENDING':
      default:
        return '#6b7280';
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#86efac';
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#fde047';
      case 'FAILED':
        return '#fca5a5';
      case 'PENDING':
      default:
        return '#d1d5db';
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

  reloadExistingVideoContent(): void {
    this.aiContentGenerationService.getImage().subscribe((data) => {
      if (!data) {
        return;
      }

      this.imageUrl = data;
      this.isVideoFormat = this.isMp4(data);
      this.contentDisabled = false;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.socketConnection.clearSessionId();
  }
}
