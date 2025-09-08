import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ButtonModule } from 'primeng/button';
// import { InputTextarea } from  'primeng/inputtextarea';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TextareaModule } from 'primeng/textarea';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
// import { QuillModule } from 'ngx-quill';
import { Router, RouterLink } from '@angular/router';

import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-product-client',
  imports: [
    HeaderComponent,
    ButtonModule,
    CommonModule,
    SelectModule,
    RouterLink,
    OverlayPanelModule,
    TextareaModule,
    FormsModule,
    AccordionModule,
  ],
  templateUrl: './product-client.component.html',
  styleUrl: './product-client.component.css',
})
export class ProductClientComponent {
  @ViewChild('commentPanel') commentPanel!: OverlayPanel;
  commentText: string = '';
  panelStyle: any = {};
  clickEvent?: MouseEvent;
  commentBox = '';
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
    private aiContentGenerationService: ContentGenerationService,
    private route: Router,
    private chnge: ChangeDetectorRef
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
      this.chnge.detectChanges();
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

  inputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }

  navigateToForm(): void {
    this.route.navigateByUrl('client-desc');
    this.chnge.detectChanges();
  }

  navigateToDashboard(): void {
    this.route.navigateByUrl('dashboard');
    this.chnge.detectChanges();
  }

  // Download responses as Excel file
  downloadExcel(): void {
    const data = this.productResponses.map((response) => ({
      'Image URL': response.imageUrl,
      'Product Title': this.extractTitle(response.description),
      'Product Description': this.extractDescription(response.description),
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });

    saveAs(blob, 'ProductResponses.xlsx');
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
  saveComment() {}
}
