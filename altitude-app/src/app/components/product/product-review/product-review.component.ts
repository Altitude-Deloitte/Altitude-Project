import { Component, Input, effect, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
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
  selector: 'app-product-review',
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
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.css',
})
export class ProductReviewComponent implements OnDestroy {
  // Subscriptions
  private productContentSubscription?: Subscription;

  @Input() data: { imageUrl: string; attributes: string }[] = [];

  editorContentSocialMedia: any;
  characterCount: number = 0;
  imageUrl: any;
  imageContainerHeight = '0px';
  imageContainerWidth = '0px';
  imageHeight = '0px';
  imageWidth = '0px';
  isContentLoaded = true;
  commonPrompt: any;
  commoImagePrompt: any;
  contentDisabled = false;
  isEMailPromptDisabled = false;
  commonPromptIsLoading = false;
  isImageRegenrateDisabled = false;
  isImageRefineDisabled = false;
  existingContent: any;
  totalWordCount: any;
  brandlogo!: string;
  loading = true;
  showAgenticWorkflow = false;

  //csv
  productResponses: any[] = []; // Holds all responses
  currentIndex: number = 0; // Tracks the current row being displayed
  currentResponse: any = null; // Holds the current response
  productTitle: string = ''; // Extracted title
  productDescription: string = ''; // Extracted description

  // Regeneration properties
  contentFeedback: string = '';
  isRegeneratingContent: boolean = false;
  productPayload: FormData | null = null;

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

  formData: any;
  ngOnInit(): void {
    console.log('File readed :  ............', this.data);

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
      console.log('Form data received:', this.formData);
      this.initializeProductPayload();
    });
    this.contentDisabled = true;
    this.loading = true;
    /*  this.aiContentGenerationService.getProductResponsetData().subscribe(data => {
      this.editorContentSocialMedia = data?.description;
      console.log("review proct details :", this.editorContentSocialMedia )
      this.productTitle = this.extractTitle(this.editorContentSocialMedia);
        this.productDescription = this.extractDescription(this.editorContentSocialMedia);
     

      this.chnge.detectChanges();
    });*/
    this.productContentSubscription = this.aiContentGenerationService
      .getProductResponsetData()
      .subscribe((responses) => {
        this.productResponses = responses;

        if (this.productResponses.length > 0) {
          // Set the initial response
          this.setCurrentResponse(0);
        }
        this.loading = false;
        this.contentDisabled = false;
      });
  }

  processChatResponse(result: any): void {
    console.log('Processing chat response:', result);

    if (result.product_descriptions) {
      this.productResponses = result.product_descriptions;
      if (this.productResponses.length > 0) {
        this.setCurrentResponse(0);
      }
    }

    this.loading = false;
    this.contentDisabled = false;

    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 300);
  }

  initializeProductPayload(): void {
    if (!this.formData) return;

    this.productPayload = new FormData();
    this.productPayload.append('use_case', 'Product Description');
    this.productPayload.append('purpose', this.formData?.purpose || '');
    this.productPayload.append('brand', this.formData?.brand || '');
    this.productPayload.append('tone', this.formData?.tone || '');

    if (this.formData?.additional && this.formData?.additional.trim() !== '') {
      this.productPayload.append('additional_details', this.formData?.additional);
    }
  }

  validateContentFeedback(feedback: string): boolean {
    const lowerFeedback = feedback.toLowerCase().trim();

    // Check if feedback mentions word count/limit
    const hasWordKeyword = lowerFeedback.includes('word count') ||
      lowerFeedback.includes('word limit') ||
      lowerFeedback.includes('words');

    // If word count/limit is mentioned, extract the number and validate it's >= 50
    if (hasWordKeyword) {
      const numbers = feedback.match(/\b\d+\b/g);
      if (numbers && numbers.length > 0) {
        const wordLimit = parseInt(numbers[0], 10);
        if (wordLimit < 50) {
          return false; // Invalid: word limit less than 50
        }
      }
    }

    return true; // Valid feedback
  }

  regenerateContent(): void {
    if (!this.contentFeedback || this.contentFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter feedback to regenerate content',
        life: 3000
      });
      return;
    }

    if (!this.validateContentFeedback(this.contentFeedback)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Word Limit',
        detail: 'Word limit should be more than 50 words.',
        life: 5000
      });
      return;
    }

    if (!this.productPayload) {
      this.initializeProductPayload();
    }

    this.productPayload?.append('feedback', this.contentFeedback);
    this.productPayload?.append('regenerate', 'true');

    this.isRegeneratingContent = true;
    // Don't set loading = true for regeneration (keep loader hidden)

    this.aiContentGenerationService.generateContent(this.productPayload!).subscribe({
      next: (data) => {
        console.log('Content regenerated:', data);

        if (data?.result?.product_descriptions) {
          this.productResponses = data.result.product_descriptions;
          if (this.productResponses.length > 0) {
            this.setCurrentResponse(0);
          }
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Content regenerated successfully',
          life: 3000
        });

        this.contentFeedback = '';
        this.initializeProductPayload();
      },
      error: (error) => {
        console.error('Error regenerating content:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate content. Please try again.',
          life: 3000
        });
        this.isRegeneratingContent = false;
      },
      complete: () => {
        this.isRegeneratingContent = false;
      }
    });
  }

  // Set the current response based on the index
  setCurrentResponse(index: number): void {
    if (index >= 0 && index < this.productResponses.length) {
      this.currentIndex = index;
      this.currentResponse = this.productResponses[index];
      this.imageUrl = this.currentResponse.imageUrl;
      this.productTitle = this.extractTitle(this.currentResponse.description);
      this.productDescription = this.extractDescription(
        this.currentResponse.description
      );
      // this.chnge.detectChanges();
    }
  }

  // Navigate to the next response
  nextResponse(): void {
    if (this.currentIndex < this.productResponses.length - 1) {
      this.setCurrentResponse(this.currentIndex + 1);
    }
  }

  // Navigate to the previous response
  previousResponse(): void {
    if (this.currentIndex > 0) {
      this.setCurrentResponse(this.currentIndex - 1);
    }
  }

  extractTitle(response: string): string {
    // Match the line starting with "Product Title:"
    const titleMatch = response.match(/Product Title:\s*(.+)/);
    return titleMatch ? titleMatch[1].trim() : 'Unknown Title';
  }

  extractDescription(response: string): string {
    // Match the text after "Product Description:"
    const descriptionMatch = response.match(/Product Description:\s*([\s\S]+)/);
    return descriptionMatch
      ? descriptionMatch[1].trim()
      : 'No description available.';
  }

  setImageDimensions(height: string, width: string) {
    this.imageContainerHeight = height;
    this.imageContainerWidth = width;
    this.imageHeight = height;
    this.imageWidth = width;
  }

  onCreateProject() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '400px';
    // this.dialog.open(SuccessDialogComponent, dialogConfig);
  }

  inputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }

  navigateToForm(): void {
    this.route.navigateByUrl('product-client');
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
    if (this.contentFeedback) {
      this.contentFeedback += ' ' + text;
    } else {
      this.contentFeedback = text;
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from observables to prevent memory leaks
    this.productContentSubscription?.unsubscribe();
  }
}

