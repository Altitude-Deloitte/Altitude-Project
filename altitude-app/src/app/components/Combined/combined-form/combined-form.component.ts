import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-combined-form',
  imports: [
    SelectModule,
    MultiSelectModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    RadioButtonModule,
  ],
  templateUrl: './combined-form.component.html',
  styleUrl: './combined-form.component.css',
})
export class CombinedFormComponent {
  readonly panelOpenState = signal(false);
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

  showMore: string | undefined;

  // contentTypes and contentType2 arrays removed - now using FormData payloads directly
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

  socialPurposeArray = [
    'Brand Awareness',
    'Lead Generation and Sales',
    'Polls',
    'Tips / Hacks',
    'Audience Engagement',
    'Caption',
  ];
  socialCampaignData = ['Facebook', 'Instagram', 'X', 'LinkedIn'];
  platformWordLimits = {
    Facebook: '63206',
    Instagram: '2200',
    X: '25000',
    LinkedIn: '3000',
  };
  languageArrays = ['English(US)', 'English(UK)'];
  englishArrays = ['US', 'UK'];
  vocabularyArrays = ['Simple', 'Complex'];
  //blog
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
  blogPurposeArray = [
    'Awareness (brand/ product)',
    'Sales enablement',
    'Lead generation',
    'Thought leadership',
    'Training guides',
  ];

  //campaignData =["Send Campaign"];
  campaignData = ['Brand Campaign', 'Marketing Campaign'];
  selectedToppings: any;
  selectedTone: any;
  announcer = inject(LiveAnnouncer);
  imageUrl!: null;
  audianceData: any;
  selectedCamp: any;
  facebookLimit: string | undefined;
  instagramLimit: string | undefined;
  uploadedIamges: any;
  constructor(
    private fb: FormBuilder,

    private route: Router,
    private aiContentGenerationService: ContentGenerationService
  ) { }

  imageOption: string = '';
  imageBox: string = '';
  ngOnInit(): void {
    const currentDate = new Date();
    this.socialwebsite = this.fb.group({
      taskId: [{ value: this.generateTaskId(), disabled: true }],
      dueDate: [currentDate.toISOString().split('T')[0]],
      topic: [''],
      wordLimit: [''],
      wordLimit2: [''],
      wordLimit3: [''],
      purpose: [''],
      purpose2: [''],
      purpose3: [''],
      campaign: [''],
      campaign2: [''],
      Hashtags: [''],
      readers: [''],
      readers2: [''],
      readers3: [''],
      format: [''], //blog
      outline: [''], //blog
      keywords: [''],
      target: [''],
      target3: [''],
      reader: [''],
      Type: [''],
      Type3: [''],
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

  urlImage: any;
  emailPayload: any;
  socialMediaPayload: any;
  blogPayload: any;

  onCreateProject(): void {
    var formValues = { ...this.socialwebsite.getRawValue() };
    const { topic, imgDesc } = formValues;

    console.log('Combined Form - Email wordLimit value:', formValues?.wordLimit);

    // ========== CREATE EMAIL PAYLOAD ==========
    this.emailPayload = new FormData();
    this.emailPayload.append('use_case', 'Email Campaign');
    this.emailPayload.append('purpose', formValues?.purpose || '');
    this.emailPayload.append('brand', formValues?.brand || '');
    this.emailPayload.append('tone', formValues?.Type || '');
    this.emailPayload.append('topic', formValues?.topic || '');
    this.emailPayload.append('word_limit', formValues?.wordLimit || '');
    this.emailPayload.append('target_reader', formValues?.readers || '');
    this.emailPayload.append('image_details', formValues?.imageOpt || '');
    if (formValues?.imgDesc) {
      this.emailPayload.append('image_description', formValues?.imgDesc || '');
    }
    if (formValues?.additional && formValues?.additional.trim() !== '') {
      this.emailPayload.append('additional_details', formValues?.additional);
    }

    // ========== CREATE SOCIAL MEDIA PAYLOAD ==========
    this.socialMediaPayload = new FormData();
    this.socialMediaPayload.append('use_case', 'Social Media Posting');
    this.socialMediaPayload.append('purpose', formValues?.purpose2 || '');
    this.socialMediaPayload.append('brand', formValues?.brand || '');

    // Handle platform_campaign - convert array to comma-separated string if it's an array (from p-multiselect)
    const platformCampaign = Array.isArray(formValues?.campaign2)
      ? formValues.campaign2.join(',')
      : (formValues?.campaign2 || '');
    this.socialMediaPayload.append('platform_campaign', platformCampaign);

    this.socialMediaPayload.append('topic', topic || '');
    this.socialMediaPayload.append('word_limit', formValues?.wordLimit2 || '');
    this.socialMediaPayload.append('image_details', formValues?.imageOpt || '');
    if (formValues?.imgDesc) {
      this.socialMediaPayload.append('image_description', formValues?.imgDesc || '');
    }
    if (formValues?.additional && formValues?.additional.trim() !== '') {
      this.socialMediaPayload.append('additional_details', formValues?.additional);
    }

    // ========== CREATE BLOG PAYLOAD ==========
    this.blogPayload = new FormData();
    this.blogPayload.append('use_case', 'Blog Generation');
    this.blogPayload.append('purpose', formValues?.purpose3 || '');
    this.blogPayload.append('outline', formValues?.topic || '');
    this.blogPayload.append('format', formValues?.format || '');
    this.blogPayload.append('primary_keywords', formValues?.keywords || '');
    this.blogPayload.append('word_limit', formValues?.wordLimit3 || '');
    this.blogPayload.append('target_reader', formValues?.target3 || '');
    this.blogPayload.append('tone', formValues?.Type3 || '');
    this.blogPayload.append('image_details', formValues?.imageOpt || '');
    this.blogPayload.append('brand', formValues?.brand || '');
    if (formValues?.imgDesc) {
      this.blogPayload.append('image_description', formValues?.imgDesc || '');
    }
    if (formValues?.additional && formValues?.additional.trim() !== '') {
      this.blogPayload.append('additional_details', formValues?.additional);
    }

    this.addImageFromURL();
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

    if (this.socialwebsite.valid) {
      var formValues = { ...this.socialwebsite.getRawValue() };
      console.log('Form Values:', formValues);

      // ========== EMAIL CONTENT GENERATION ==========
      // Single API call returns: email_header, image_url, email_subjects, and html content
      this.aiContentGenerationService.generateContent(this.emailPayload).subscribe({
        next: (data) => {
          console.log('Email complete response:', data);
          // Store the complete email response which includes header, subjects, and body
          this.aiContentGenerationService.setEmailHeadResponseData(data);
          // Also set it for backward compatibility if review screen checks getEmailResponsetData
          this.aiContentGenerationService.setEmailResponseData(data);
        },
        error: (error) => {
          console.error(`Error occurred for email content:`, error);
        },
      });

      // ========== SOCIAL MEDIA CONTENT GENERATION ==========
      // Single API call returns content for all selected platforms (Facebook, Instagram, etc.)
      this.aiContentGenerationService
        .generateContent(this.socialMediaPayload)
        .subscribe({
          next: (data) => {
            console.log(`Social media content response:`, data);
            // Store the complete social media response which includes all platforms
            this.aiContentGenerationService.setSocialResponseData(data);
          },
          error: (error) => {
            console.error(`Error occurred for social media:`, error);
          },
        });

      // ========== BLOG CONTENT GENERATION ==========
      this.aiContentGenerationService.generateContent(this.blogPayload).subscribe({
        next: (data) => {
          console.log('Blog content response:', data);
          this.aiContentGenerationService.setBlogResponseData(data);
        },
        error: (error) => {
          console.error(`Error occurred for blog:`, error);
        },
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

      // Map campaign2 to campaign for social media platforms (used by review screen)
      if (formValues.campaign2) {
        formValues.campaign = formValues.campaign2;
      }

      this.aiContentGenerationService.setData(formValues);
      this.navigateToReview();
    } else {
      console.log('Form is invalid');
    }
  }

  // Old prompt methods no longer needed - using FormData payloads instead
  constructPrompt2(formValues: any, contentType: string): string {
    const {
      topic,
      purpose,
      readers,
      Type,
      wordLimit,
      mediaType,
      campaign,
      lang,
      additionDetails,
      keywords,
      format,
      target,
    } = formValues;
    switch (format) {
      case 'SEO-Optimised Longform':
        // return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles.  Body should have Title as <H1><b> and Introduction of Brief overview, keyword integration, sub-headings only as <H2> with 2% keyword density and sub-headings should not more than one in body and don't show the introduction and conclusion title just there body need to show.  Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create an SEO-optimized, long-form blog post in ${format} format of exactly ${wordLimit} words on the topic "${topic}" in "${lang}" language, using a "${Type}" tone. The blog's purpose is "${purpose}" for a "${target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${keywords}". using the following structure:
1.  Title (H1):  Catchy title with the main keyword.
2.  Sub Title:  Engaging subtitle with relevant keywords.
3.  Table of Contents:  List H2 and H3 headings.
4.  Introduction:  Brief overview with main keyword integration.
5.  Body: 
 - Use Table of Contents H2/H3 headings points with keyword variations.
 - Write in short paragraphs for Table of Contents list points (2-3 sentences each).
 - Use bullet points or lists for key points.
 - Include examples or case studies for added value.
 - Ensure natural keyword usage without stuffing.
6.  Conclusion:  Summarize key points with a call-to-action.
7. Output the entire blog in HTML format.
8. Additionally, after the main content, include:
  - A <p> tag with "<b>SEO Title:</b> " followed by the main title.
  - A <p> tag with "<b>SEO Description:</b> " followed by a description relevant to the purpose and audience.
9.Don,t add heading like Title, Subtitle,Body, Introduction, Main Content and Conclusion. just write their body only.    
10. Do not add heading labels like "Title," "Subtitle," "Body," "Introduction," or "Conclusion." Just write their respective content.`;
      case 'SEO-Optimised Listicle':
        //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b>, subheadings as <H2>   with Sequential numbering and 2% keyword density. Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create  a blog in ${format} format with exactly ${wordLimit} words on the topic "${topic}" in "${lang}" language, using a "${Type}" tone. The blog's purpose is "${purpose}" for a "${target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${keywords}".. Use the following structure:
1.  Title (H1):  Include catchy phrasing with main keywords.
2.  Subtitle:  Integrate keyword variations.
3.  Table of Contents:  Provide a structured overview.
Introduction:  Write a brief introduction, including the main keywords naturally.
Main Content:  Create a numbered list with H2 headings for each item. Use keyword variations in H2 headings and incorporate main keywords in the body of each item.
Conclusion:  Summarize the blog with a strong call-to-action, using keyword variations.
4. Output the entire blog in HTML format.
5. Additionally, after the main content, include:
  - A <p> tag with "<b>SEO Title:</b> " followed by the main title.
  - A <p> tag with "<b>SEO Description:</b> " followed by a description relevant to the purpose and audience.
6. Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only.    `;

      case 'Case Study':
        // return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b> but, don't mansion "case study:", Background as <H2> Describe client, industry, challenges  with 2% keyword density. Approach and Solution as <H2> Solution strategy, steps taken, tools and techniques. Implementation process as <H2> Explain the execution Results and Outcome as <H2> Key metrics, outcome/success Client testimonial (optional) as <H2>. Conclusion as <H2>
        // Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create a blog in ${format} format of exactly ${wordLimit} words on the topic "${topic}" in "${lang}" language, using a "${Type}" tone. The blog's purpose is "${purpose}" for a "${target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${keywords}". Follow this structure:
1.  Title (H1):  Craft a catchy, keyword-rich title.
2.  Sub Title:  Include a relevant sub title with keywords.
3.  Introduction:  Write a brief overview of the topic.
4.  Client/Project Background (H2):  Describe the client, industry, and challenges faced. Use variations of the topic keywords.
5.  Approach and Solution (H3):  Outline the strategy, steps taken, and tools used.
6.  Implementation Process (H4):  Provide a detailed explanation of the execution process.
7.  Results and Outcome (H5):  Highlight key metrics and successful outcomes.
8.  Conclusion:  Summarize the case study and its impact.
Note:  Use variations of the topic keywords naturally throughout the blog.
9. Output the entire blog in HTML format.
10. Additionally, after the main content, include:
  - A <p> tag with "<b>SEO Title:</b> " followed by the main title.
  - A <p> tag with "<b>SEO Description:</b> " followed by a description relevant to the purpose and audience.
11.Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only.   `;

      case 'Fact Sheet':
        //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b> but, don't mansion "case study:", Key Facts and bullet points  as <H2>   with 2% keyword density. In-Depth detail (optional)  as <H2> .Conclusion as <H2> Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create a blog in ${format} format of exactly ${wordLimit} words on the topic "${topic}" in "${lang}" language, using a "${Type}" tone. The blog's purpose is "${purpose}" for a "${target}" audience. Ensure proper sentence closure and SEO optimization using the keywords: "${keywords}".. Follow this structure:  
1. Create a  catchy title (H1)  that includes the main keyword(s).
2. Write a  brief introduction  providing an overview of the topic with keyword integration.
3. Include a section of  key facts and bullet points (H2)  with variations of the main keyword(s). Use bullets and short sentences.
4. Add an  in-depth detail section (H3)  for more comprehensive information. Use keyword variations.
5. Write a  conclusion  summarizing the key points.
Ensure keyword integration throughout, use variations where applicable, and maintain an engaging and informative tone.
6. Output the entire blog in HTML format.
7. Additionally, after the main content, include:
  - A <p> tag with "<b>SEO Title:</b> " followed by the main title.
  - A <p> tag with "<b>SEO Description:</b> " followed by a description relevant to the purpose and audience.
8.Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only.    `;

      case 'Guide':
        //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b>, Sectioned Steps or Main Parts   as <H2>   with 2% keyword density. Detailed Explanation for Each Section  as <H2> .Additional Tips, Warnings, or Best Practices (Optional) as <H2>. Summary and Key Takeaways as <H2>
        //  Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create a blog in ${format} format of exactly ${wordLimit} words on the topic "${topic}" in "${lang}" language, using a "${Type}" tone. The blog's purpose is "${purpose}" for a "${target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${keywords}". Follow this structure: 
- Title (H1): Create a catchy title with primary keywords.
- Subtitle: Include a relevant keyword variation.
-  Table of Contents:  Provide a clear outline.
-  Introduction:  Brief overview using main keywords.
-  Main Sections (H2 & Body):  Use H2 headings with keyword variations. Provide detailed content, integrating keywords naturally.
-  Detailed Explanations (H3 & Body):  Include H3 subheadings with keyword variations. Add in-depth content using keywords.
-  Additional Tips & Best Practices:  (Optional)
-  Summary & Key Takeaways:  Provide a concise wrap-up.
-  Hyperlink Keywords:  Link relevant keywords to landing pages or related blogs.
-  Call-to-Action (CTA):  Suggest related blogs or additional resources.
-  Social Sharing Prompt:  Add social sharing buttons at the beginning or end.
Ensure keyword integration feels natural, and content is engaging and informative.
Output the entire blog in HTML format, followed by:
- A <p> tag containing "<b>SEO Title:</b> " with the blog's main title.
- A <p> tag containing "<b>SEO Description:</b> " with a description relevant to the blog's purpose and target audience.
-Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only. `;

      default:
        return '';
    }
  }

  // Old methods removed - now calling generateContent directly with FormData payloads

  generateTaskId(): string {
    const timestamp = Date.now();
    return `DA-2203-${timestamp}`;
  }

  resetForm(): void {
    this.socialwebsite.reset();
    this.uploadedImages = [];
    this.socialwebsite.controls['taskId'].setValue(this.generateTaskId());
  }

  navigateToReview(): void {
    this.route.navigateByUrl('combined-review');
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

  onFloatingButtonClick(): void { }

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

  //social media
  /* onPlatformChange(selectedPlatform: keyof typeof this.platformWordLimits):void{
    const wordLimit = this.platformWordLimits[selectedPlatform] || '';
    this.socialwebsite.patchValue({wordLimit2:wordLimit});
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
        } else if (platform === 'Instagram') {
          this.instagramLimit = limit;
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
    this.socialwebsite.patchValue({ wordLimit2: this.combinedLimit });
  }

  updateFormFields3(selectedCampaign: string) {
    var formValues = { ...this.socialwebsite.getRawValue() };

    var audiancePrompt = `Generate 3 audiance name based on the topic "${formValues.topic}" and brand "${formValues.brand} , Consider the purpose "${formValues.purpose}" and the blog format "${formValues.format}". Output only the 3 audiance name in a single string, separated by semicolons (","). Do not include any additional text, explanations, or formatting—just the 4 audiance name for blog in the required format.`;
    this.aiContentGenerationService
      .generateOtherContent(audiancePrompt, 'emailer')
      .subscribe({
        next: (data) => {
          console.log(`email subject prompt :`, audiancePrompt);
          // this.aiContentGenerationService.setSubjectResponseData(data);
          this.aiContentGenerationService.setAudianceResponseData(data);
          console.log(`email subject from API for :`, data);
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
          target3: this.audianceData,
        });
        if (
          selectedCampaign === 'Awareness (brand/ product)' ||
          selectedCampaign === 'Training guides'
        ) {
          this.socialwebsite.patchValue({
            Type3: ['Informative', 'Informal'],
          });
        } else if (
          selectedCampaign === 'Sales enablement' ||
          selectedCampaign === 'Thought leadership'
        ) {
          this.socialwebsite.patchValue({
            Type3: ['Informal'],
          });
        } else {
          this.socialwebsite.patchValue({
            Type3: [],
          });
        }
        console.log('audiance string 0 : ', this.audianceData);
      });
  }
}
