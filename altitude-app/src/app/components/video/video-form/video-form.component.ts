import {
  Component,
  inject,
  signal,
} from '@angular/core';

import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectModule } from 'primeng/select';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { ContentGenerationService } from '../../../services/content-generation.service';
import { Router } from '@angular/router';
import { SocketConnectionService } from '../../../services/socket-connection.service';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-video-form',
  imports: [
    RadioButtonModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
    DrawerModule,
    InputTextModule,
  ],
  templateUrl: './video-form.component.html',
  styleUrl: './video-form.component.css',
})
export class VideoFormComponent {
  taskForm!: FormGroup;
  socialwebsite!: FormGroup;
  //csv
  csvData: { imageUrl: string; attributes: string }[] = [];

  contentTypes = ['social_media'];
  //campaignData: any;
  imageSize = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  uploadedImages: { file: File; preview: string }[] = [];
  // @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  readonly reactiveKeywords = signal([
    'Business Enthusiasts',
    'Working Professionals',
    'College Freshers',
  ]);

  imageOption: string = '';
  imageBox: string = '';

  positonData = ['640x480', '740x1024'];

  formatArray = ['Gif', 'Mp4'];
  fpsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedToppings: any;
  announcer = inject(LiveAnnouncer);
  imageUrl: null | undefined;
  currentDate: any = new Date();
  currentsDate: any = this.currentDate.toISOString().split('T')[0];

  // Properties for upload drawer and image handling
  showUploadDrawer: boolean = false;
  showImageUrlInput: boolean = false;
  videoGenerationModel: string = 'frames-to-video';
  referenceImageUrl: string = '';
  referenceImageFile: File | null = null;
  imagePreviewUrl: string = '';
  uploadedImagePreview: string = '';

  constructor(
    private fb: FormBuilder,

    private route: Router,
    private aiContentGenerationService: ContentGenerationService,
    public socketConnection: SocketConnectionService
  ) { }

  urlImage: any;
  onCreateProject(): void {
    //
    var formValues = { ...this.socialwebsite.getRawValue() };

    const { prompt } = formValues;
    // const { url1 } = formValues;

    this.imageUrl = null;

    // dialogRef.afterClosed().subscribe((result) => {
    // if (result) {
    if (this.socialwebsite.valid) {
      var formValues = { ...this.socialwebsite.getRawValue() };
      console.log('Form Values:', formValues);

      // Set form data first so review screen can access it
      this.aiContentGenerationService.setData(formValues);

      // Create FormData for multipart form data
      const videoFormData = new FormData();

      // Generate session_id and connect socket BEFORE API call
      const sessionId = this.socketConnection.generateSessionId();
      this.socketConnection.clearAgentData(); // Reset all tracking including completion signal
      this.socketConnection.setSessionId(sessionId); // Connect socket with this session
      console.log('🎯 Video form generated session_id:', sessionId);

      videoFormData.append('brief', prompt);
      console.log('Brief added to FormData:', prompt);

      // Append optional reference_image if file is uploaded
      if (this.referenceImageFile) {
        videoFormData.append('reference_image', this.referenceImageFile, this.referenceImageFile.name);
        console.log('Reference image file added to payload:', this.referenceImageFile.name, 'Size:', this.referenceImageFile.size, 'Type:', this.referenceImageFile.type);
      }

      // Append optional reference_image_url if URL is provided
      if (this.referenceImageUrl && this.referenceImageUrl.trim() !== '') {
        videoFormData.append('reference_image_url', this.referenceImageUrl);
        console.log('Reference image URL added to payload:', this.referenceImageUrl);
      }

      // Log FormData contents for debugging
      console.log('FormData entries:');
      videoFormData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`${key}:`, value.name, value.size, value.type);
        } else {
          console.log(`${key}:`, value);
        }
      });

      this.aiContentGenerationService
        .generateVoeVideo(videoFormData, sessionId)
        .subscribe(
          (response: any) => {
            console.log('Response background animation response:', response);
            this.imageUrl = response?.video_url;
            console.log('background image:', this.imageUrl);
            this.aiContentGenerationService.setImage(this.imageUrl);

            // Navigate to review only after getting the response

          },
          (error) => {
            console.error('Error:', error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error details:', error.error);
            // Optionally show error message to user
          }
        );
      this.navigateToForm();
    } else {
      console.log('Form is invalid');
    }
    // } else {
    //   console.log('Form submission cancelled');
    // }
    // });
  }

  navigateToForm(): void {
    this.route.navigateByUrl('video-review');
  }

  onFloatingButtonClick(): void { }

  // constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.socketConnection.dataSignal.set({});
    const currentDate = new Date();
    this.socialwebsite = this.fb.group({
      taskId: [{ value: this.generateTaskId(), disabled: true }],
      dueDate: [currentDate.toISOString().split('T')[0]],
      topic: [''],
      url1: [''],
      prompt: ['', Validators.required],
    });

    this.aiContentGenerationService.setImage(null);
    this.aiContentGenerationService.setSocialResponseData(null);
  }

  generateTaskId(): string {
    const timestamp = Date.now();
    return `PD-2204-${timestamp}`;
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

  get urls(): FormArray {
    return this.socialwebsite.get('urls') as FormArray;
  }

  createUrlField(): FormGroup {
    return this.fb.group({
      url: ['', Validators.required],
    });
  }

  addUrl(): void {
    this.urls.push(this.createUrlField());
  }

  removeUrl(index: number): void {
    this.urls.removeAt(index);
  }

  moveUrlUp(index: number): void {
    if (index > 0) {
      const urls = this.urls.value;
      [urls[index - 1], urls[index]] = [urls[index], urls[index - 1]];
      this.urls.setValue(urls);
    }
  }

  moveUrlDown(index: number): void {
    if (index < this.urls.length - 1) {
      const urls = this.urls.value;
      [urls[index + 1], urls[index]] = [urls[index], urls[index + 1]];
      this.urls.setValue(urls);
    }
  }

  // Trigger file upload from drawer
  triggerFileUpload(): void {
    this.showUploadDrawer = false;
    setTimeout(() => {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }, 100);
  }

  // Switch to image URL input mode
  switchToImageUrlInput(): void {
    this.showUploadDrawer = false;
    this.showImageUrlInput = true;
    this.uploadedImagePreview = '';
    this.referenceImageFile = null;
  }

  // Handle image file selection
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.referenceImageFile = input.files[0];
      console.log('Reference image file selected:', this.referenceImageFile.name);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImagePreview = e.target.result;
      };
      reader.readAsDataURL(this.referenceImageFile);

      // Remove URL input mode and clear URL values when file is uploaded
      this.showImageUrlInput = false;
      this.referenceImageUrl = '';
      this.imagePreviewUrl = '';
    }
  }

  // Handle image URL change
  onImageUrlChange(): void {
    if (this.referenceImageUrl && this.referenceImageUrl.trim() !== '') {
      this.imagePreviewUrl = this.referenceImageUrl;
      // Clear uploaded file when URL is provided
      this.uploadedImagePreview = '';
      this.referenceImageFile = null;
    } else {
      this.imagePreviewUrl = '';
    }
  }

  // Clear input
  clearInput(): void {
    this.showImageUrlInput = false;
    this.referenceImageUrl = '';
    this.imagePreviewUrl = '';
    this.uploadedImagePreview = '';
    this.referenceImageFile = null;
    this.socialwebsite.patchValue({ prompt: '' });
  }

  // Remove reference image (both uploaded and URL)
  removeReferenceImage(): void {
    this.uploadedImagePreview = '';
    this.referenceImageFile = null;
    this.imagePreviewUrl = '';
    this.referenceImageUrl = '';
    this.showImageUrlInput = false;

    // Reset file input to allow re-uploading the same file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
