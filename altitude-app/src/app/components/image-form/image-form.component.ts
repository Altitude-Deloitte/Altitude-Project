import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
  viewChild,
} from '@angular/core';

import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule, DatePipe } from '@angular/common';
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

import { ContentGenerationService } from '../../services/content-generation.service';
import { Router, RouterLink } from '@angular/router';
import { SelectionStore } from '../../store/campaign.store';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-image-form',
  imports: [
    SelectModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RadioButtonModule,
  ],
  templateUrl: './image-form.component.html',
  styleUrl: './image-form.component.css',
})
export class ImageFormComponent {
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
  constructor(
    private fb: FormBuilder,

    private route: Router,
    private aiContentGenerationService: ContentGenerationService,
    // private datePipe: DatePipe,
    private http: HttpClient
  ) {}

  urlImage: any;
  onCreateProject(): void {
    //
    var formValues = { ...this.socialwebsite.getRawValue() };

    const urlData = [
      formValues.url1,
      formValues.url2,
      formValues.url3,
      formValues.url4,
    ].filter((url) => url && url.trim() !== '');
    const { format } = formValues;
    const { fps } = formValues;
    const { position } = formValues;

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

      this.aiContentGenerationService
        .createAnimation(urlData, format, fps, position)
        .subscribe(
          (response) => {
            console.log('Response banner:', response);
            this.imageUrl = response.s3Url;
            console.log('banner image:', this.imageUrl);
            this.aiContentGenerationService.setImage(this.imageUrl);
            // Handle the response, maybe navigate to another component to display the image
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      this.aiContentGenerationService.setData(formValues);
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
    this.route.navigateByUrl('gif-reviw');
  }

  onFloatingButtonClick(): void {}

  // constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.socialwebsite = this.fb.group({
      taskId: [{ value: this.generateTaskId(), disabled: true }],
      dueDate: [currentDate.toISOString().split('T')[0]],
      topic: [''],
      url1: ['', Validators.required],
      url2: ['', Validators.required],
      url3: [''],
      url4: [''],
      format: ['', Validators.required],
      fps: ['', Validators.required],
      position: ['', Validators.required],
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

  oonCreateProject(): void {
    if (this.socialwebsite.valid) {
      const formValues = { ...this.socialwebsite.getRawValue() };
      const urlData = formValues.urls.map((u: { url: string }) => u.url);
      const { format, fps, position } = formValues;

      this.aiContentGenerationService
        .createAnimation(urlData, format, fps, position)
        .subscribe(
          (response) => {
            console.log('Response:', response);
            this.aiContentGenerationService.setImage(response.s3Url);
            this.route.navigateByUrl('gif-review');
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }
}
