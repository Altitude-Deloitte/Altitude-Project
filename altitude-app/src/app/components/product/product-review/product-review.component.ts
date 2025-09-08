import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-product-review',
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    AccordionModule,
    RouterLink,
  ],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.css',
})
export class ProductReviewComponent {
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

  //csv
  productResponses: any[] = []; // Holds all responses
  currentIndex: number = 0; // Tracks the current row being displayed
  currentResponse: any = null; // Holds the current response
  productTitle: string = ''; // Extracted title
  productDescription: string = ''; // Extracted description
  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService // private chnge: ChangeDetectorRef
  ) {}

  formData: any;
  ngOnInit(): void {
    console.log('File readed :  ............', this.data);

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
      console.log('Form data received:', this.formData);
    });
    this.contentDisabled = true;
    /*  this.aiContentGenerationService.getProductResponsetData().subscribe(data => {
      this.editorContentSocialMedia = data?.description;
      console.log("review proct details :", this.editorContentSocialMedia )
      this.productTitle = this.extractTitle(this.editorContentSocialMedia);
        this.productDescription = this.extractDescription(this.editorContentSocialMedia);
     

      this.chnge.detectChanges();
    });*/
    this.aiContentGenerationService
      .getProductResponsetData()
      .subscribe((responses) => {
        this.productResponses = responses;

        if (this.productResponses.length > 0) {
          // Set the initial response
          this.setCurrentResponse(0);
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
}
