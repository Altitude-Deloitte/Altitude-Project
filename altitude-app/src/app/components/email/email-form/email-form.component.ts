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

import { ContentGenerationService } from '../../../services/content-generation.service';
import { Router, RouterLink } from '@angular/router';
import { SelectionStore } from '../../../store/campaign.store';

@Component({
  selector: 'app-email-form',
  imports: [
    RadioButtonModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.css',
})
export class EmailFormComponent {
  fb = inject(FormBuilder);
  socialwebsite!: FormGroup;
  taskID: any = ''; // Initialize with an empty string
  currentDate: any = new Date();
  dueDate: any = this.currentDate.toISOString().split('T')[0];
  urlImage: any = '';
  imageSize = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  route = inject(Router);
  fileInput = viewChild('fileInput');
  uploadedImages: { file: File; preview: string }[] = [];
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
  showMore: string | undefined;

  contentTypes = ['emailer', 'social_media'];
  readonly reactiveKeywords = signal([
    'Business Enthusiasts',
    'Working Professionals',
    'College Freshers',
  ]);
  toppingList = [
    'Gen Alpha',
    'Millenial',
    'Existing Customer',
    'New Customer',
    'Prospect',
    'Lead',
    'At-risk Customer',
  ];
  purposeArray = [
    'Sales and Promotion',
    'Newsletter',
    'Announcement',
    'Event invitation',
    'Sharing new content',
    'Important updates',
  ];
  languageArrays = ['English(US)', 'English(UK)'];
  englishArrays = ['US', 'UK'];
  vocabularyArrays = ['Simple', 'Complex'];

  //campaignData =["Send Campaign"];
  campaignData = ['Brand Campaign', 'Marketing Campaign'];
  selectedToppings: any;
  selectedTone: any;
  announcer = inject(LiveAnnouncer);
  imageUrl!: null;
  store = inject(SelectionStore);
  imageOption: string = '';
  imageBox: string = '';
  constructor(private aiContentGenerationService: ContentGenerationService) {}
  ngOnInit(): void {
    console.log('store: ', this.store.campaignType());
    const currentDate = new Date();
    this.socialwebsite = this.fb.group({
      taskId: [{ value: this.generateTaskId(), disabled: true }],
      dueDate: [currentDate.toISOString().split('T')[0]],
      topic: ['', Validators.required],
      wordLimit: [''],
      purpose: ['', Validators.required],
      campaign: ['', Validators.required],
      readers: ['', Validators.required],
      reader: [''],
      Type: ['', Validators.required],
      url: [''],
      imageSize: [''],
      uploadedImage: [''],
      language: [''],
      lang: ['English(US)'],
      brand: [''],
      imageOpt: ['N/A'],
      imgDesc: [''],
    });
    //this.fetchCampaignData();
    this.aiContentGenerationService.setImage(null);
    this.aiContentGenerationService.setEmailResponseData(null);
  }

  onCreateProject(): void {
    var formValues = { ...this.socialwebsite.getRawValue() };
    const { topic } = formValues;
    const { imgDesc } = formValues;

    this.addImageFromURL();
    // this.imageUrl=null;
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
                console.log('image data', data);
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

    //image offer and event

    var eventImage = `Create an "${formValues.brand}" event image on "${formValues.topic}"`;
    var offerImage = `Create an "${formValues.brand}" offer image on "${formValues.topic}"`;
    console.log('event prompt : ', eventImage);
    console.log('offer prompt : ', offerImage);
    this.aiContentGenerationService.eventImageGeneration(eventImage).subscribe({
      next: (data) => {
        console.log('event image : ', data);

        this.aiContentGenerationService.setEventImage(data[0].url);
      },
      error: (er) => {
        console.log('onCreateProject', er);
      },
    });
    this.aiContentGenerationService.offerImageGeneration(offerImage).subscribe({
      next: (data) => {
        console.log('offer image : ', data);

        this.aiContentGenerationService.setOfferImage(data[0].url);
      },
      error: (er) => {
        console.log('onCreateProject', er);
      },
    });

    var offerImage = `Create an "${formValues.brand}" brand offer/quote heading for a "${formValues.topic}" with an attractive, short, and brand-aligned title in an <h1> tag and a subtitle in an <h2> tag. Ensure the output includes only the <h1> and <h2> tags with the content. Avoid adding extra HTML or markdown. The font style and color should align with Nike's branding.`;
    this.aiContentGenerationService
      .generateContent(offerImage, 'emailer')
      .subscribe({
        next: (data) => {
          console.log(`email heading prompt :`, offerImage);
          this.aiContentGenerationService.setEmailHeadResponseData(data);

          console.log(`email heading from API for :`, data);
        },
        error: (error) => {
          console.error(`Error occurred for heading:`, error);
        },
      });

    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '574px',
    //   height: '346px',
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    // if (result) {
    if (this.socialwebsite.valid) {
      var formValues = { ...this.socialwebsite.getRawValue() };
      console.log('Form Values:', formValues);

      this.contentTypes.forEach((contentType) => {
        const prompt = this.constructPrompt(formValues, contentType);
        console.log('Prompt :', prompt);
        this.aiContentGeneration(prompt, contentType);
      });
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
      this.navigateToReview();
    } else {
      console.log('Form is invalid');
    }
    // } else {
    //   console.log('Form submission cancelled');
    // }
    // });
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
    } = formValues;
    switch (contentType) {
      /*case 'emailSubject':
        return `Create a mail content based on topic "${topic}" and should be "${lang}" english. the intended tone of the mail is "${Type}". Some more details to be consider for generating email body is  "${purpose}".The target reader is "${readers}", the mail content should be more than "${wordLimit}" words . 
Structure the email subject such that it can be easy to displayed in an Angular application. So, email subject should be in string and after each subject it separated with ";" so i can fetch each subject for dropdown.`;
*/
      case 'emailer':
        return `Create a mail content based on topic "${topic}" and should be "${lang}" . the intended tone of the mail is "${Type}". Some more details to be consider for generating email body is  "${purpose}".The target reader is "${readers}" but, don't include in Salutation, the mail body content should be  "${wordLimit}" words .with all sentences closed properly Structure the email for Angular application. So, email should be created with html tags so it's easy to display except <html> and <code> tag or * or unwanted symbols not on this body. On this email parts which are , first section of Salutation as inside <p> tag then <br/> or next line two time then, second section of Email Body as inside <p> tags and new lines based on the body content then <br/> tag, third section of Closing Remarks in <p>  tag and  no space / or new line in between closing remarks . whole mail content should start from Salutation and end with Closing Remarks don't show other context other then the email
The html tags are separate and it should not be part of word count`;
      // return `Create a mail content based on topic "${topic}" and should be "${lang}" english. the intended tone of the mail is "${Type}". Some more details to be consider for generating email body is  "${purpose}".The target reader is "${readers}", the mail content should be  "${wordLimit}" words . Structure the email such that it can be displayed in an Angular application with html tags except <html> or <code> on this email parts which are Subject as whole subject body should inside into <b> tag then <br/> tag, Salutation as inside <i> tag in next paragraph then <br/> tag,  Email Body in next paragraph then <br/> tag, and Regards in next paragraphe then <br/> tag. whole mail content should start from subject.`;
      // return `Create a mail content based on topic "${topic}". the intended tone of the mail is "${Type}". Some more details to be consider for generating email body is  "${purpose}".The target reader is "${readers}", the mail content should be  "${wordLimit}" words . Structure the email such that it can be displayed in an Angular application with Subject as Bold, Salutation as Italics, Email Body in next paragraph and Closing Remarks in a separate line. Also can you provide the output in a json object which has four attributes - Subject, Salutation, Body and Closing Remarks.`

      case 'social_media':
        return `Generate 4 email subjects based on the topic "${formValues.topic}". The email subjects should be in "${formValues.lang}" (English) and use a "${formValues.Type}" tone. Consider the purpose "${formValues.purpose}" and the target readers "${formValues.readers}". Output only the 4 email subjects in a single string, separated by semicolons (";"). Do not include any additional text, explanations, or formatting—just the 4 email subjects in the required format.`;

      default:
        return '';
    }
  }

  generateTaskId(): string {
    const timestamp = Date.now();
    this.taskID = `EM-2203-${timestamp}`;
    return `EM-2203-${timestamp}`;
  }

  aiContentGeneration(prompt: string, type: string): void {
    this.aiContentGenerationService.generateContent(prompt, type).subscribe({
      next: (data) => {
        /*if (type === 'emailer') {
          this.aiContentGenerationService.setEmailResponseData(data);
          console.log("email body : ",data);
        } else if (type === 'emailSubject') {
          this.aiContentGenerationService.setEmailSubResponseData(data);
          console.log("email subject : ",data);
        }*/
        if (type === 'emailer') {
          this.aiContentGenerationService.setEmailResponseData(data);
          console.log('email content : ', data);
        } else if (type === 'social_media') {
          this.aiContentGenerationService.setSocialResponseData(data);
        }
        console.log(`Response from API for ${type}:`, data);
      },
      error: (error) => {
        console.error(`Error occurred for ${type}:`, error);
      },
    });
  }

  resetForm(): void {
    this.socialwebsite.reset();
    this.uploadedImages = [];
    this.socialwebsite.controls['taskId'].setValue(this.generateTaskId());
  }

  navigateToReview(): void {
    this.route.navigateByUrl('email-review');
  }

  fetchCampaignData(): void {
    this.aiContentGenerationService.fetchCampaignData().subscribe(
      (data) => {
        this.campaignData = data.result;
        console.log('Campaign data fetched:', this.campaignData);
      },
      (error) => {
        console.error('Error fetching campaign data:', error);
      }
    );
  }

  onFilesDropped(files: File[]): void {
    if (files.length) {
      files.forEach((file) => {
        if (file instanceof File) {
          this.previewImage(file);
        } else {
          console.error('Dropped item is not a File:', file);
        }
      });
    } else {
      alert('No files were dropped.');
    }
  }

  triggerFileInput(): void {
    // if (this.fileInput && this.fileInput.nativeElement) {
    //   this.fileInput.nativeElement.click();
    // }
  }

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

  deleteImage(index: number): void {
    this.imageBox = '';
    this.uploadedIamges.splice(index, 1);
  }

  onFileOver(event: any): void {
    console.log('File Over', event);
  }

  onFileLeave(event: any): void {
    console.log('File Leave', event);
  }

  removeReactiveKeyword(keyword: string) {
    this.reactiveKeywords.update((keywords) => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword} from reactive form`);
      return [...keywords];
    });
  }

  // addReactiveKeyword(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();
  //   if (value) {
  //     this.reactiveKeywords.update((keywords: any) => [...keywords, value]);
  //     this.announcer.announce(`added ${value} to reactive form`);
  //   }
  //   event.chipInput!.clear();
  // }

  onFloatingButtonClick(): void {}

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
    if (selectedCampaign === 'Brand Campaign') {
      this.socialwebsite.patchValue({
        readers: ['Gen Alpha'],
        Type: ['Informative', 'Informal'],
      });
    } else if (selectedCampaign === 'Marketing Campaign') {
      this.socialwebsite.patchValue({
        readers: ['New Customer', 'Prospect'],
        Type: ['Formal'],
      });
    } else {
      this.socialwebsite.patchValue({
        readers: [],
        Type: [],
      });
    }
  }
}
