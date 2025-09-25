import {
  Component,
  ViewChild,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SocketConnectionService } from '../../../services/socket-connection.service';
// import { Select } from 'primeng/select';

@Component({
  selector: 'app-blog-form',
  imports: [
    CommonModule,
    SelectModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RadioButtonModule,
  ],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.css',
})
export class BlogFormComponent {
  taskForm!: FormGroup;
  socialwebsite!: FormGroup;
  toneOptions: string[] = [
    'Formal',
    'Informal',
    'Informative',
    'Persuasive',
    'Inspirational',
    'Narrative',
    'Analytical',
    'Descriptive',
    'Reflective',
    'Objective',
    'Argumentative',
  ];

  mediaType: string[] = [
    'Instagram',
    'Facebook',
    'WhatsApp',
    'X',
    'LinkedIn',
    'Pinterest',
  ];

  contentTypes = ['blog'];
  //campaignData: any;
  imageSize = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  uploadedImages: { file: File; preview: string }[] = [];
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
    'Sales and promotion',
    'Awareness (brand/ product)',
    'Sales enablement',
    'Lead generation',
    'Thought leadership',
    'Training guides',
  ];

  languageArrays = [
    'English(US)',
    'English(UK)',
    // "Hindi",
    // "Korean",
    // "French",
    // "Spanish"
  ];
  englishArrays = ['US', 'UK'];
  vocabularyArrays = ['Simple', 'Complex'];

  imageOption: string = '';
  imageBox: string = '';

  formats = [
    'Listicle',
    'Post Event',
    'Topical',
    'Guide',
    'Blog',
    'Thought Leadership',
    'Initiative Awareness',
    'Trends Blog',
  ];
  selectedTone: any;
  selectedToppings: any;
  announcer = inject(LiveAnnouncer);
  imageUrl!: null;
  audianceData: any;
  blogPayload: any;
  constructor(
    private fb: FormBuilder,
    public socketConnection: SocketConnectionService,
    private route: Router,
    private aiContentGenerationService: ContentGenerationService
  ) {}

  urlImage: any;
  onCreateProject(): void {
    var formValues = { ...this.socialwebsite.getRawValue() };
    const { topic, imgDesc } = formValues;

    this.addImageFromURL();
    this.imageUrl = null;

    // Create FormData instead of object
    this.blogPayload = new FormData();
    this.blogPayload.append('use_case', 'Blog Generation');
    this.blogPayload.append('purpose', formValues?.purpose || '');
    this.blogPayload.append('outline', formValues?.outline || '');
    this.blogPayload.append('format', formValues?.format || '');
    this.blogPayload.append('primary_keywords', formValues?.keywords || '');
    this.blogPayload.append('word_limit', formValues?.wordLimit || '');
    this.blogPayload.append('target_reader', formValues?.readers || '');
    this.blogPayload.append('tone', formValues?.Type || '');
    this.blogPayload.append('image_details', formValues?.imageOpt || '');
    this.blogPayload.append('brand', formValues.brand || '');
    if (formValues?.imgDesc) {
      this.blogPayload.append('image_description', formValues?.imgDesc || '');
    }

    // Conditionally append additional fields
    if (formValues?.additional && formValues?.additional.trim() !== '') {
      this.blogPayload.append('additional_details', formValues?.additional);
    }
    this.aiContentGenerationService.setData(formValues);
    this.aiContentGeneration(formValues, 'Blog Generation');
    this.navigateToForm();
    // if (this.uploadedImages.length == 0 && !this.urlImage) {
    //   console.log('image option :', formValues.imageOpt);
    //   if (formValues.imageOpt === 'N/A') {
    //     this.aiContentGenerationService.setImage(null);
    //     console.log('image option value :', formValues.imageOpt === 'N/A');
    //   } else {
    //     var topicPropmt: string;
    //     if (topic) {
    //       if (imgDesc) {
    //         topicPropmt = `Create an image based on this description "${imgDesc}"`;
    //       } else {
    //         topicPropmt = `Create an image on "${topic}" and image should have white or grey back ground`;
    //       }
    //       this.aiContentGenerationService
    //         .imageGeneration(topicPropmt)
    //         .subscribe({
    //           next: (data) => {
    //             console.log('data', data);
    //             if (this.uploadedImages.length == 0) {
    //               this.aiContentGenerationService.setImage(data[0].url);
    //             }
    //           },
    //           error: (er) => {
    //             console.log('onCreateProject', er);
    //           },
    //         });
    //     }
    //   }
    // }
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '574px',
    //   height: '346px',
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    // if (result) {

    // } else {
    //   console.log('Form submission cancelled');
    // }
    // });
  }

  navigateToForm(): void {
    this.route.navigateByUrl('blog-review');
  }

  aiContentGeneration(prompt: string, type: string): void {
    this.aiContentGenerationService
      .generateContent(this.blogPayload)
      .subscribe({
        next: (data) => {
          if (type == 'Blog Generation') {
            this.aiContentGenerationService.setBlogResponseData(data);
          }
          console.log(`Response from API for ${type}:`, data);
        },
        error: (error) => {
          console.error(`Error occurred for ${type}:`, error);
        },
      });
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

  ngOnInit(): void {
    this.socketConnection.dataSignal.set({});
    const currentDate = new Date();
    this.socialwebsite = this.fb.group({
      taskId: [{ value: this.generateTaskId(), disabled: true }],
      dueDate: [currentDate.toISOString().split('T')[0]],
      topic: [''],
      wordLimit: [''],
      purpose: [''],
      campaign: [''],
      readers: [''],
      Type: [''],
      url: [''],
      imageSize: [''],
      uploadedImage: [''],
      language: [''],
      lang: ['English(US)'],
      additionDetails: [''],
      keywords: [''],
      brand: [''],
      outline: [''],
      format: [''],
      target: [this.audianceData],
      imageOpt: ['N/A'],
      imgDesc: [''],
    });
    this.aiContentGenerationService.setImage(null);
    this.aiContentGenerationService.setBlogResponseData(null);
  }

  generateTaskId(): string {
    const timestamp = Date.now();
    return `BL-2204-${timestamp}`;
  }

  resetForm(): void {
    this.taskForm.reset({
      taskId: { value: '1111', disabled: true },
      dueDate: new Date().toISOString().split('T')[0], // Reset date to current date
    });
    // You may also want to manually reset other fields if needed
    this.taskForm.get('facebook')?.setValue(false);
    this.taskForm.get('instagram')?.setValue(false);
    this.taskForm.get('whatsapp')?.setValue(false);
    this.taskForm.get('x')?.setValue(false);
    this.taskForm.get('linkedin')?.setValue(false);
    this.taskForm.get('pinterest')?.setValue(false);
  }

  triggerFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
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

  updateFormFields(selectedCampaign: string) {
    if (
      selectedCampaign === 'Awareness (brand/ product)' ||
      selectedCampaign === 'Training guides'
    ) {
      this.socialwebsite.patchValue({
        Type: ['Informative', 'Informal'],
      });
    } else if (
      selectedCampaign === 'Sales enablement' ||
      selectedCampaign === 'Thought leadership'
    ) {
      this.socialwebsite.patchValue({
        Type: ['Informal'],
      });
    } else {
      this.socialwebsite.patchValue({
        Type: [],
      });
    }
    var formValues = { ...this.socialwebsite.getRawValue() };

    var audiancePrompt = `Generate 3 audiance name based on the topic "${formValues.topic}" and brand "${formValues.brand} , Consider the purpose "${formValues.purpose}" and the blog format "${formValues.format}". Output only the 3 audiance name in a single string, separated by semicolons (","). Do not include any additional text, explanations, or formatting—just the 4 audiance name for blog in the required format.`;
    this.aiContentGenerationService.generateContent(formValues).subscribe({
      next: (data) => {
        // this.aiContentGenerationService.setSubjectResponseData(data);
        this.aiContentGenerationService.setAudianceResponseData(data);
       },
      error: (error) => {
        console.error(`Error occurred for email subject:`, error);
      },
    });

    this.aiContentGenerationService
      .getAudianceResponseData()
      .subscribe((data) => {
        this.audianceData = data?.content;
        this.socialwebsite.patchValue({
          target: this.audianceData,
        });
        console.log('audiance string 0 : ', this.audianceData);
      });
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files);
      if (files.length) {
        files.forEach((file) => {
          if (file instanceof File) {
            this.previewImage(file);
          } else {
            console.error('Dropped item not a file');
          }
        });
      } else {
        alert('No files dropped');
      }
    }
  }
}
