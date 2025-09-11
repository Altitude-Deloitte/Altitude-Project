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
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectModule } from 'primeng/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { Router, RouterLink } from '@angular/router';
import { SelectionStore } from '../../../store/campaign.store';
@Component({
  selector: 'app-social-form',
  imports: [
    RadioButtonModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
    MultiSelectModule,
  ],
  templateUrl: './social-form.component.html',
  styleUrl: './social-form.component.css',
})
export class SocialFormComponent {
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

  languageArrays = [
    'English(US)',
    'English(UK)',
    'Hindi',
    'Korean',
    'French',
    'Spanish',
    'Mexican',
    'Canadian',
  ];

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
  selectedCamp: any;
  facebookLimit: string | undefined;
  instagramLimit: string | undefined;
  facebookFlag: boolean = false;
  instaFlag: boolean = false;
  fbLimit: number | null | undefined;
  inLimit: number | null | undefined;

  constructor(
    private fb: FormBuilder,

    private route: Router,
    private aiContentGenerationService: ContentGenerationService
  ) { }

  urlImage: any;
  onCreateProject(): void {
    var formValues = { ...this.socialwebsite.getRawValue() };
    const { topic } = formValues;
    const { imgDesc } = formValues;
    this.addImageFromURL();
    this.imageUrl = null;
    if (this.uploadedImages.length == 0 && !this.urlImage) {
      console.log('image option :', formValues.imageOpt);
      if (formValues.imageOpt === 'N/A') {
        this.aiContentGenerationService.setImage(null);
        console.log('image option value :', formValues.imageOpt === 'N/A');
      } else {
        var topicPropmt: string;
        if (topic) {
          if (imgDesc) {
            topicPropmt = `Create an image based on this description "${imgDesc}"`;
          } else {
            topicPropmt = `Create an image on "${topic}" and image should have white or grey back ground`;
          }
          this.aiContentGenerationService
            .imageGeneration(topicPropmt)
            .subscribe({
              next: (data) => {
                console.log('data', data);
                if (this.uploadedImages.length == 0) {
                  this.aiContentGenerationService.setImage(data[0].url);
                }
              },
              error: (er) => {
                console.log('onCreateProject', er);
              },
            });
        }
      }
    }
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '574px',
    //   height: '346px',
    // });

    //dialogRef.afterClosed().subscribe((result) => {
    //if (result) {
    if (this.socialwebsite.valid) {
      var formValues = { ...this.socialwebsite.getRawValue() };
      console.log('Form Values:', formValues);

      // Assuming wordLimit is a string like "63206,2200"
      const wordLimitValue = this.socialwebsite.get('wordLimit')?.value;

      if (wordLimitValue) {
        const limitsArray = wordLimitValue.split(','); // Split by comma

        // Assign values separately
        this.fbLimit = limitsArray[0] ? parseInt(limitsArray[0], 10) : null;
        this.inLimit = limitsArray[1] ? parseInt(limitsArray[1], 10) : null;
      }

      if (this.facebookFlag) {
        var audiancePrompt = `Generate Facebook 3 audiance name based on the topic "${formValues.topic}" and brand "${formValues.brand} , Consider the purpose "${formValues.purpose}" and with the Facebook format . Output only the 3 audiance name in a single string, separated by semicolons (","). Do not include any additional text, explanations, or formatting—just the 4 audiance name for blog in the required format.`;
        this.aiContentGenerationService
          .generateContent(audiancePrompt, 'emailer')
          .subscribe({
            next: (data: any) => {
              console.log(`facebook audiance prompt :`, audiancePrompt);
              // this.aiContentGenerationService.setSubjectResponseData(data);
              this.aiContentGenerationService.setAudianceResponseData1(data);
              this.socialwebsite.patchValue({
                target1: data,
              });
              console.log(`facebook audiance from API for :`, data);
            },
            error: (error: any) => {
              console.error(`Error occurred for facebook audiance:`, error);
            },
          });
      }
      if (this.instaFlag) {
        var audiancePrompt = `Generate 3 Instagram audiance name based on the topic "${formValues.topic}" and brand "${formValues.brand} , Consider the purpose "${formValues.purpose}" and with the Instagram format . Output only the 3 audiance name in a single string, separated by semicolons (","). Do not include any additional text, explanations, or formatting—just the 4 audiance name for blog in the required format.`;
        this.aiContentGenerationService
          .generateContent(formValues, 'emailer')
          .subscribe({
            next: (data: any) => {
              console.log(`instagram audiance prompt :`, audiancePrompt);
              // this.aiContentGenerationService.setSubjectResponseData(data);
              this.aiContentGenerationService.setAudianceResponseData2(data);
              this.socialwebsite.patchValue({
                target2: data,
              });
              console.log(`instagram audiance from API for :`, data);
            },
            error: (error: any) => {
              console.error(`Error occurred for instagram audiance:`, error);
            },
          });
      }

      console.log('FB limit: ', this.fbLimit);
      // var facebookPrompt = `Create a social media post for the platform "Facebook" based on the topic "${formValues.topic}" and in the language "${formValues.lang}". The tone of the post should be based on the media post as "${formValues.Type1}". The purpose of the post is "${formValues.purpose}". The intended target audience is "${formValues.target1}". The content should be detailed and informative, with a length of "${this.facebookLimit}" characters. Ensure that all sentences are properly structured and the post flows well. Include relevant, trending hashtags and emojis if appropriate for the context. This is the hyper link "${formValues.Hashtags}" add it at the end of the post which is shown as hyperlink and clickable if there is not link, don't include any links). Only return the post content, no additional notes, word count, or instructions.`;
      var facebookPrompt = `Generate a Facebook post on "${formValues.topic}" in "${formValues.lang}" with a "${formValues.Type1}" tone for "${formValues.target1}". The purpose is "${formValues.purpose}". Keep the post within "${this.fbLimit}" characters, ensuring clarity, engagement, and smooth flow. Use trending hashtags and emojis where relevant. Ensure the response does not exceed the character limit. Return only the post content—no extra text.`;
      this.aiContentGenerationService
        .generateContent(formValues, 'social_media')
        .subscribe({
          next: (data: any) => {
            console.log(`social_media facebook prompt :`, facebookPrompt);
            this.aiContentGenerationService.setSocialResponseData(data);
            console.log(`social_media facebook from API for :`, data);
          },
          error: (error: any) => {
            console.error(`Error occurred for :social_media`, error);
          },
        });

      console.log('Insta limit: ', this.inLimit);
      // var instaPrompt = `Create a social media post for the platform "Instagram" based on the topic "${formValues.topic}" and in the language "${formValues.lang}". The tone of the post should be based on the media post as "${formValues.Type2}" and intractive description and caption. The purpose of the post is "${formValues.purpose}". The intended target audience is "${formValues.target2}". The content should be detailed and informative, with a maximum length of "${this.facebookLimit}" characters. Ensure that all sentences are properly structured and the post flows well. Include relevant, trending hashtags and emojis if appropriate for the context. If a link "${formValues.Hashtags}" is provided, add it at the end of the post (otherwise, don't include any links). Only return the post content, no additional notes, word count, or instructions.`;
      var instaPrompt = `Generate a Instagram post on "${formValues.topic}" in "${formValues.lang}" with a "${formValues.Type2}" tone for "${formValues.target2}". The purpose is "${formValues.purpose}". Keep the post within "${this.inLimit}" characters, ensuring clarity, engagement, and smooth flow. Use trending hashtags and emojis where relevant.Ensure the response does not exceed the character limit. Return only the post content—no extra text.`;
      // this.aiContentGenerationService
      //   .generateContent(instaPrompt, 'social_media')
      //   .subscribe({
      //     next: (data: any) => {
      //       console.log(`social_media insta prompt :`, instaPrompt);
      //       this.aiContentGenerationService.setSocialResponseData1(data);
      //       console.log(`social_media insta from API for :`, data);
      //     },
      //     error: (error: any) => {
      //       console.error(`Error occurred for :social_media`, error);
      //     },
      //   });
      if (this.uploadedIamges) {
        this.aiContentGenerationService.setImage(this.uploadedIamges);
      }
      if (this.urlImage) {
        this.aiContentGenerationService.setImage(this.urlImage);
      }
      if (formValues.imageOpt === 'N/A') {
        this.aiContentGenerationService.setImage(null);
      }

      this.aiContentGenerationService.setData(formValues);
      this.navigateToForm();
    } else {
      console.log('Form is invalid');
    }
    //} else {
    //console.log('Form submission cancelled');
    //}
    //});
  }

  navigateToForm(): void {
    this.route.navigateByUrl('social-review');
  }

  // aiContentGeneration(prompt: string, type: string): void {
  //   this.aiContentGenerationService.generateContent(prompt, type).subscribe({
  //     next: (data: any) => {
  //       if (type == 'social_media') {
  //         this.aiContentGenerationService.setSocialResponseData(data);
  //       }
  //       console.log(`Response from API for ${type}:`, data);
  //     },
  //     error: (error: any) => {
  //       console.error(`Error occurred for ${type}:`, error);
  //     },
  //   });
  // }

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

  onFloatingButtonClick(): void { }

  // constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.socialwebsite = this.fb.group({
      taskId: [{ value: this.generateTaskId(), disabled: true }],
      dueDate: [currentDate.toISOString().split('T')[0]],
      topic: [''],
      wordLimit: [''],
      purpose: [''],
      campaign: [''],
      readers: [''],
      Type1: [''],
      Type2: [''],
      url: [''],
      target1: [''],
      target2: [''],
      imageSize: [''],
      uploadedImage: [''],
      language: [''],
      lang: ['English(US)'],
      Hashtags: [''],
      brand: [''],
      imageOpt: ['N/A'],
      imgDesc: [''],
    });
    this.aiContentGenerationService.setImage(null);
    this.aiContentGenerationService.setSocialResponseData(null);
  }

  /*onPlatformChange(selectedPlatform: keyof typeof this.platformWordLimits):void{
  
    const wordLimit = this.platformWordLimits[selectedPlatform] || '';
    
    this.socialwebsite.patchValue({wordLimit:wordLimit});
  }*/
  selectedPlatforms: string[] = []; // Stores selected platforms

  otherPlatformLimits: Record<string, string> = {}; // Stores limits for other platforms
  combinedLimit: string = ''; // Comma-separated combined limits for the form field

  onPlatformChange(
    selectedPlatforms: (keyof typeof this.platformWordLimits)[]
  ): void {
    this.selectedPlatforms = selectedPlatforms;

    // Reset individual limits
    this.facebookLimit = '';
    this.instagramLimit = '';
    this.otherPlatformLimits = {};

    // Update limits for selected platforms
    selectedPlatforms.forEach(
      (platform: keyof typeof this.platformWordLimits) => {
        const limit = this.platformWordLimits[platform]; // TypeScript now knows platform is a valid key
        if (platform === 'Facebook') {
          this.facebookLimit = limit;
          this.facebookFlag = true;
        } else if (platform === 'Instagram') {
          this.instagramLimit = limit;
          this.instaFlag = true;
        } else {
          this.otherPlatformLimits[platform] = limit;
        }
      }
    );

    // Combine limits into a comma-separated string
    this.combinedLimit = [
      this.facebookLimit,
      this.instagramLimit,
      ...Object.values(this.otherPlatformLimits),
    ]
      .filter((limit) => limit) // Remove empty values
      .join(',');

    // Update the form field with the combined limit
    this.socialwebsite.patchValue({ wordLimit: this.combinedLimit });
    this.socialwebsite.get('wordLimit')?.enable();
  }

  generateTaskId(): string {
    const timestamp = Date.now();
    return `SP-2204-${timestamp}`;
  }

  constructPrompt(formValues: any, contentType: string): string {
    const {
      topic,
      purpose,
      readers,
      Type,
      wordLimit,
      mediaType,
      campaign,
      lang,
      Hashtags,
    } = formValues;
    switch (contentType) {
      case 'social_media':
        return `Create a social media post for the platform "${mediaType}" based on the topic "${topic}" and in the language "${lang}". The tone of the post should be based on the media post as "${mediaType}". The purpose of the post is "${purpose}". The intended target audience is "${mediaType}". The content should be detailed and informative, with a maximum length of "${wordLimit}" characters. Ensure that all sentences are properly structured and the post flows well. Include relevant, trending hashtags and emojis if appropriate for the context. This is the hyper link "${Hashtags}" add it at the end of the post which is shown as hyperlink and clickable if there is not link, don't include any links). Only return the post content, no additional notes, word count, or instructions.`;
      default:
        return '';
    }
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

  // triggerFileInput(): void {
  //   if (this.fileInput && this.fileInput.nativeElement) {
  //     this.fileInput.nativeElement.click();
  //   }
  // }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      debugger;
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
      selectedCampaign === 'Brand Awareness' ||
      selectedCampaign === 'Audience Engagement'
    ) {
      this.socialwebsite.patchValue({
        Type1: ['Informative', 'Formal'],
        Type2: ['Informative'],
      });
    } else if (
      selectedCampaign === 'Caption' ||
      selectedCampaign === 'Tips / Hacks'
    ) {
      this.socialwebsite.patchValue({
        Type: ['Informal'],
        Type2: ['Narrative'],
      });
    } else if (
      selectedCampaign === 'Lead Generation and Sales' ||
      selectedCampaign === 'Polls'
    ) {
      this.socialwebsite.patchValue({
        Type1: ['Informative'],
        Type2: ['Informative'],
      });
    } else {
      this.socialwebsite.patchValue({
        Type: [],
      });
    }
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
