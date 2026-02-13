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
  csvData: { imageUrl: string; attributes: string }[] = [];

  contentTypes = ['social_media'];
  imageSize = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  uploadedImages: { file: File; preview: string }[] = [];
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
  aspectRatioOptions = [
    { label: '16:9', value: '16:9' },
    { label: '9:16', value: '9:16' }
  ];
  selectedAspectRatio: string = '16:9';

  platformOptions = [
    { label: 'Instagram Reels', value: 'Instagram Reels' },
    { label: 'YouTube Shorts', value: 'YouTube Shorts' },
    { label: 'LinkedIn', value: 'LinkedIn' },
    { label: 'Multi-platform', value: 'Multi-platform' }
  ];
  selectedPlatform: string = '';

  formatStyleOptions = [
    { label: 'Cinematic', value: 'Cinematic' },
    { label: 'Talking Head', value: 'Talking Head' },
    { label: 'Motion Graphic', value: 'Motion Graphic' },
    { label: 'Fast-cut Montage', value: 'Fast-cut Montage' }
  ];
  selectedFormatStyle: string = '';

  toneOptions = [
    { label: 'Bold', value: 'Bold' },
    { label: 'Premium', value: 'Premium' },
    { label: 'Playful', value: 'Playful' },
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Informative', value: 'Informative' }
  ];
  selectedTone: string = '';
  selectedToppings: any;
  announcer = inject(LiveAnnouncer);
  imageUrl: null | undefined;
  currentDate: any = new Date();
  currentsDate: any = this.currentDate.toISOString().split('T')[0];

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

  buildConstructedPrompt(userPrompt: string): string {
    let prompt = userPrompt?.trim() || '';
    const settings: string[] = [];
    if (this.selectedTone) settings.push(`with ${this.selectedTone.toLowerCase()} tone`);
    if (this.selectedFormatStyle) settings.push(`in ${this.selectedFormatStyle.toLowerCase()} format style`);
    if (settings.length > 0) {
      prompt = prompt ? `${prompt} ${settings.join(', ')}` : settings.join(', ');
    }
    return prompt;
  }

  onCreateProject(): void {
    var formValues = { ...this.socialwebsite.getRawValue() };

    const { prompt } = formValues;

    this.imageUrl = null;

    if (this.socialwebsite.valid) {
      var formValues = { ...this.socialwebsite.getRawValue() };

      const constructedPrompt = this.buildConstructedPrompt(formValues.prompt);

      formValues.prompt = constructedPrompt;
      formValues.platform = this.selectedPlatform;
      formValues.aspectRatio = this.selectedAspectRatio;
      formValues.formatStyle = this.selectedFormatStyle;
      formValues.tone = this.selectedTone;

      this.aiContentGenerationService.setData(formValues);

      const videoFormData = new FormData();

      const sessionId = this.socketConnection.generateSessionId();
      this.socketConnection.clearAgentData();
      this.socketConnection.setSessionId(sessionId);

      videoFormData.append('brief', constructedPrompt);

      if (this.referenceImageFile) {
        videoFormData.append('reference_image', this.referenceImageFile, this.referenceImageFile.name);
      }

      if (this.referenceImageUrl && this.referenceImageUrl.trim() !== '') {
        videoFormData.append('reference_image_url', this.referenceImageUrl);
      }

      this.aiContentGenerationService
        .generateVoeVideo(videoFormData, sessionId, this.selectedAspectRatio)
        .subscribe(
          (response: any) => {
            this.imageUrl = response?.video_url;
            this.aiContentGenerationService.setImage(this.imageUrl);
          },
          (error) => {
          }
        );
      this.navigateToForm();
    } else {
    }
  }

  navigateToForm(): void {
    this.route.navigateByUrl('video-review');
  }

  onFloatingButtonClick(): void { }

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
      dueDate: new Date().toISOString().split('T')[0],
    });
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

  triggerFileUpload(): void {
    this.showUploadDrawer = false;
    setTimeout(() => {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }, 100);
  }

  switchToImageUrlInput(): void {
    this.showUploadDrawer = false;
    this.showImageUrlInput = true;
    this.uploadedImagePreview = '';
    this.referenceImageFile = null;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.referenceImageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImagePreview = e.target.result;
      };
      reader.readAsDataURL(this.referenceImageFile);

      this.showImageUrlInput = false;
      this.referenceImageUrl = '';
      this.imagePreviewUrl = '';
    }
  }

  onImageUrlChange(): void {
    if (this.referenceImageUrl && this.referenceImageUrl.trim() !== '') {
      this.imagePreviewUrl = this.referenceImageUrl;
      this.uploadedImagePreview = '';
      this.referenceImageFile = null;
    } else {
      this.imagePreviewUrl = '';
    }
  }

  clearInput(): void {
    this.showImageUrlInput = false;
    this.referenceImageUrl = '';
    this.imagePreviewUrl = '';
    this.uploadedImagePreview = '';
    this.referenceImageFile = null;
    this.socialwebsite.patchValue({ prompt: '' });
  }

  removeReferenceImage(): void {
    this.uploadedImagePreview = '';
    this.referenceImageFile = null;
    this.imagePreviewUrl = '';
    this.referenceImageUrl = '';
    this.showImageUrlInput = false;

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
