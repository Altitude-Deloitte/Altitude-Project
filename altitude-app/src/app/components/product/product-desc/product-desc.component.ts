import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { FileUpload } from 'primeng/fileupload';
@Component({
  selector: 'app-product-desc',
  imports: [
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    FileUpload,
  ],
  templateUrl: './product-desc.component.html',
  styleUrl: './product-desc.component.css',
})
export class ProductDescComponent {
  taskForm!: FormGroup;
  socialwebsite!: FormGroup;
  //csv
  csvData: { imageUrl: string; attributes: string }[] = [];

  toneOptions: string[] = [
    'Informative',
    'Persuasive',
    'Casual',
    'Sophisticated',
    'Minimalist',
    'Technical',
    'Playful',
    'Inclusive',
  ];

  mediaType: string[] = [
    'Instagram',
    'Facebook',
    'WhatsApp',
    'X',
    'LinkedIn',
    'Pinterest',
  ];

  contentTypes = ['social_media'];
  //campaignData: any;
  imageSize = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  uploadedImages: { file: File; preview: string }[] = [];
  // @ViewChild('fileInput') papaparse!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  readonly reactiveKeywords = signal([
    'Business Enthusiasts',
    'Working Professionals',
    'College Freshers',
  ]);
  toppingList = [
    'Young Gen Z',
    'Millenial',
    'Existing Customer',
    'New Customer',
    'Prospect',
    'Lead',
    'At-risk Customer',
  ];
  purposeArray = [
    'Brand Awareness',
    'Lead Generation and Sales',
    'Polls',
    'Tips / Hacks',
    'Audience Engagement',
    'Caption',
  ];

  languageArrays = ['English(US)', 'English(UK)'];
  englishArrays = ['US', 'UK'];
  vocabularyArrays = ['Simple', 'Complex'];

  imageOption: string = '';
  imageBox: string = '';

  campaignData = ['Facebook', 'Instagram', 'X', 'LinkedIn'];
  platformWordLimits = {
    Facebook: '63206',
    Instagram: '2200',
    X: '25000',
    LinkedIn: '3000',
  };

  selectedToppings: any;
  announcer = inject(LiveAnnouncer);
  imageUrl: null | undefined;
  fileStatus: boolean = false;
  constructor(
    private fb: FormBuilder,

    private route: Router,
    private aiContentGenerationService: ContentGenerationService,

    private http: HttpClient
  ) {}

  urlImage: any;
  onCreateProject(): void {
    //
    var formValues = { ...this.socialwebsite.getRawValue() };
    const { topic } = formValues;
    const { imgDesc } = formValues;
    this.addImageFromURL();
    this.imageUrl = null;

    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '574px',
    //   height: '346px',
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    // if (result) {
    if (this.socialwebsite.valid) {
      var formValues = { ...this.socialwebsite.getRawValue() };
      console.log('Form Values:', formValues);

      this.aiContentGenerationService.setData(formValues);
      this.navigateToForm();
    } else {
      console.log('Form is invalid');
    }
    //   } else {
    //     console.log('Form submission cancelled');
    //   }
    // });
  }

  navigateToForm(): void {
    this.route.navigateByUrl('product-review');
  }

  uploadedIamges: any;
  previewImage(file: File): void {
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const preview = e.target.result;
        //this.uploadedIamges = e.target.result;
        this.uploadedImages.push({ file, preview });
        this.imageBox = 'uploaded';
        this.aiContentGenerationService.setImage(preview);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Item to preview is not a File:', file);
    }
  }

  onFloatingButtonClick(): void {}

  // constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.socialwebsite = this.fb.group({
      taskId: [{ value: this.generateTaskId(), disabled: true }],
      dueDate: [currentDate.toISOString().split('T')[0]],
      topic: [''],
      wordLimit: ['', Validators.required],
      purpose: [''],
      campaign: [''],
      readers: [''],
      Type: ['', Validators.required],
      url: [''],
      imageSize: [''],
      uploadedImage: [''],
      language: [''],
      lang: [''],
      Hashtags: [''],
      brand: [''],
      imageOpt: ['N/A'],
      imgDesc: [''],
    });
    this.aiContentGenerationService.setImage(null);
    this.aiContentGenerationService.setSocialResponseData(null);
  }

  onPlatformChange(
    selectedPlatform: keyof typeof this.platformWordLimits
  ): void {
    const wordLimit = this.platformWordLimits[selectedPlatform] || '';
    this.socialwebsite.patchValue({ wordLimit: wordLimit });
  }

  generateTaskId(): string {
    const timestamp = Date.now();
    return `PD-2204-${timestamp}`;
  }

  triggerFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any): void {
    // Form values
    const formValues = { ...this.socialwebsite.getRawValue() };
    const { Type, wordLimit, lang, language } = formValues;

    const file = event.files[0];
    console.log(event);
    console.log('File:', file);
    // Check for .xlsx file
    if (
      file &&
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const binaryData = e.target.result;

        // Read the workbook
        const workbook = XLSX.read(binaryData, { type: 'binary' });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Map the data into the desired format
        this.csvData = sheetData.map((row: any) => ({
          imageUrl: row.ImageUrl,
          attributes: ` ${row.Product_Specification} ${row.Materials} ${row.Keywords} Tone: ${Type}, Wordlimit: ${wordLimit}, Language: ${lang}, Vocabulary: ${language}`,
        }));

        console.log('Parsed XLSX Data:', this.csvData[0].attributes);
        console.log('Parsed XLSX Data:', this.csvData[0].imageUrl);

        // Call service for each row
        this.csvData.forEach((data) => {
          this.callGenerateDescriptionApi(data);
        });
      };

      // Read the file as binary string
      reader.readAsBinaryString(file);
    } else {
      alert('Please upload a valid XLSX file.');
    }

    // Handle image preview
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      if (files.length) {
        files.forEach((file) => {
          if (file instanceof File) {
            this.previewImage(file);
          } else {
            console.error('Selected item is not a File:', file);
          }
        });
      } else {
        alert('No files selected.');
      }
    }
    this.fileStatus = true;
  }

  deleteImage(index: number): void {
    this.imageBox = '';
    this.uploadedIamges.splice(index, 1);
  }

  addImageFromURL(): void {
    const url = this.socialwebsite.get('url')?.value;
    if (url) {
      this.validateImageURL(url).then((isValid) => {
        if (isValid) {
          this.socialwebsite.get('imageURL')?.reset();
        } else {
          // this.errorMessage = 'Invalid image URL. Please provide a direct image link.';
        }
      });
    }
  }
  validateImageURL(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      this.urlImage = url;
      this.aiContentGenerationService.setImage(img.src);
    });
  }
  onChange(event: { value: string }) {
    this.imageOption = event.value;
    console.log('image option :', this.imageOption);
  }

  // Handle file selection

  /*callGenerateDescriptionApi(data: { imageUrl: string; attributes: string }) {
  this.aiContentGenerationService.generateDescription(data).subscribe(
    (response) => {
      console.log('API Response:', response);
     // alert(`Success: ${response.description}`);
     this.aiContentGenerationService.setProductResponseData(response);
    },
    (error) => {
      console.error('API Error:', error);
      alert('Failed to generate description.');
    }
  );
}*/

  callGenerateDescriptionApi(data: { imageUrl: string; attributes: string }) {
    this.aiContentGenerationService.generateDescription(data).subscribe(
      (response) => {
        console.log('API Response:', response);
        // Add the response to the array in the service
        this.aiContentGenerationService.setProductResponseData({
          imageUrl: data.imageUrl,
          attributes: data.attributes,
          description: response.description,
        });
      },
      (error) => {
        console.error('API Error:', error);
        alert('Failed to generate description.');
      }
    );
  }

  downloadCSV(): void {
    const fileUrl = 'assets/Product_Description_Template.xlsx'; // Path to your CSV file
    const anchor = document.createElement('a'); // Create an anchor element
    anchor.href = fileUrl; // Set the href to the file path
    anchor.download = 'Product_Description_Template.xlsx'; // Set the download attribute with a default file name
    anchor.click(); // Trigger a click event on the anchor
  }
}
