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
  selector: 'app-virtual-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RadioButtonModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './virtual-form.component.html',
  styleUrl: './virtual-form.component.css',
})
export class VirtualFormComponent {
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

  positonData = ['Center', 'Left', 'Right'];

  selectedToppings: any;
  announcer = inject(LiveAnnouncer);
  imageUrl: null | undefined;
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
    const { url1 } = formValues;
    const { url2 } = formValues;
    const { prompt1 } = formValues;
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
        .submitForm(url1, url2, prompt1, position)
        .subscribe(
          (response) => {
            console.log('Response banner:', response);
            this.imageUrl = response.imageUrl;
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
    this.route.navigateByUrl('banner-reviw');
  }

  onFloatingButtonClick(): void {}

  // constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.socialwebsite = this.fb.group({
      taskId: [{ value: this.generateTaskId(), disabled: true }],
      dueDate: [currentDate.toISOString().split('T')[0]],
      topic: [''],
      url1: [''],
      url2: [''],
      prompt1: [''],
      position: [''],
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
}
