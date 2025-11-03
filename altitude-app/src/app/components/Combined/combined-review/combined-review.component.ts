import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  input,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { TabsModule } from 'primeng/tabs';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogSuccessComponent } from '../../dialog-success/dialog-success.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SocketConnectionService } from '../../../services/socket-connection.service';

@Component({
  selector: 'app-combined-review',
  imports: [
    TabsModule,
    FormsModule,
    SelectModule,
    ReactiveFormsModule,
    CommonModule,
    CommonModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    AccordionModule,
    FormsModule,
    EditorModule,
    SelectModule,
    HeaderComponent,
    RouterLink,
    MenuModule,
    DialogModule,
    LoaderComponent,
    ToastModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  templateUrl: './combined-review.component.html',
  styleUrl: './combined-review.component.css',
})
export class CombinedReviewComponent implements OnDestroy {
  // Subscriptions
  private socialContentSubscription?: Subscription;
  private blogContentSubscription?: Subscription;

  subjctsEmail: string[] = [];
  selectedSubject: string = '';
  imageContainerHeight = '440px';
  imageContainerWidth = '640px';
  imageHeight = '440px';
  imageWidth = '640px';
  loading = true;
  editorContentEmail: any;
  editorContentSocialMedia: any;
  editorContentSocialMedia1: any;
  existingEmailContent: any;
  editorContentBlog: any;
  isToastVisible = false;
  totalWordCount: any;
  posts: any[] = [];
  video: any = null;
  errorMessage: string | null = null;

  plagiarismCount: string | undefined;
  plagrismCheck: any;

  //soccial media
  characterCount: number = 0;
  selectedSocialPlatforms: string[] = [];

  images: { src: string; checked: boolean }[] = [
    { src: 'assets/car1.png', checked: false },
    { src: 'assets/car1.png', checked: false },
    { src: 'assets/car2.png', checked: false },
    { src: 'assets/car3.png', checked: false },
    { src: 'assets/chair1.png', checked: false },
    { src: 'assets/chair2.png', checked: false },
    { src: 'assets/chair3.png', checked: false },
    { src: 'assets/chair4.png', checked: false },
  ];
  // @ViewChild(MatAccordion)
  // accordion!: MatAccordion;
  @ViewChild('imageElement') imageElement!: ElementRef;
  @ViewChild(EditorComponent) editorComponent!: EditorComponent;
  editorContent: string = 'Hi , this is desc';
  public tinymceConfig: any = {
    plugins: 'wordcount',
    toolbar: 'undo redo | bold italic | alignleft alignright | wordcount',
  };
  emailSubject: string = '';
  emailSalutation: string = '';
  emailBody: string = '';
  emailClosingMark: string = '';
  AiContentResponse: any;
  emailPrompt: any;
  blogPrompt: any;
  commonPrompt: any;
  commoImagePrompt: any;
  isLoading = false;
  contentDisabled = false;
  socialMediaPrompt: any;
  isBlogPromptDisabled = false;
  isSocialMediaPromptDisabled = false;
  isEMailPromptDisabled = false;
  commonPromptIsLoading = false;
  isImageRegenrateDisabled = false;
  isImageRefineDisabled = false;
  translateIsLoading = false;
  private dataLoadedCount = 0;
  private totalDataToLoad = 3; // email, social, blog
  brandLinks: any[] = [];
  brandlogo: any;
  seoTitle: string = '';
  seoDescription: string = '';
  brandlogoTop: string | undefined;
  title = 'AI-FACTORY';
  taskForm!: FormGroup;
  blogContent: any;
  blog_title: any;
  //social media
  hyperUrl: any;
  brand: any;
  existingContent: any;
  showMore: string | undefined;
  projects: string[] = ['Project A', 'Project B', 'Project C'];
  public quillConfig = {
    toolbar: [
      ['undo', 'redo'],
      [{ header: '1' }, { header: '2' }],
      [{ font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ align: [] }],
      ['link', 'image', 'code-block'],
      [{ color: [] }, { background: [] }],
    ],
  };
  imageUrl: any;
  imageOfferUrl: any;
  imageEventUrl: any;
  subjctEmail: any;
  theme: any;
  brandColor: any[] = [];
  darkHexCode: any;
  lightHexCode: any;
  emailHeader: any;
  blogstructure: any;
  editorContentSocialMedia2: any;

  // Regeneration fields for Email tab
  emailContentFeedback: string = '';
  isRegeneratingEmailContent: boolean = false;
  emailPayload: FormData | null = null;

  // Regeneration fields for Social Media tab
  socialContentFeedback: string = '';
  isRegeneratingSocialContent: boolean = false;
  socialPayload: FormData | null = null;

  // Regeneration fields for Blog tab
  blogContentFeedback: string = '';
  isRegeneratingBlogContent: boolean = false;
  blogPayload: FormData | null = null;

  // Image Regeneration fields (shared across tabs)
  imageFeedback: string = '';
  isRegeneratingImage: boolean = false;

  constructor(
    private route: Router,
    private dialog: MatDialog,
    private aiContentGenerationService: ContentGenerationService,
    private chnge: ChangeDetectorRef,
    public socketConnection: SocketConnectionService,
    private messageService: MessageService
  ) { }

  private checkAllDataLoaded(): void {
    this.dataLoadedCount++;
    console.log(`Data loaded count: ${this.dataLoadedCount}/${this.totalDataToLoad}`);
    if (this.dataLoadedCount >= this.totalDataToLoad) {
      this.loading = false;
      console.log('All data loaded, hiding loader');
      this.chnge.detectChanges();
    }
  }

  formData: any;
  ngOnInit(): void {
    // Clear socket data before starting (for combined, only clear once)
    this.socketConnection.clearAgentData();

    this.imageUrl = null;
    this.loading = true;
    this.editorContentEmail = [];
    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
      console.log('datadatadatadatadatadatadatadatadatadatadatadata', data);

      // Get selected social media platforms from campaign2
      if (data?.campaign2) {
        this.selectedSocialPlatforms = Array.isArray(data.campaign2)
          ? data.campaign2
          : data.campaign2.split(',').map((p: string) => p.trim());
        console.log('Selected social platforms:', this.selectedSocialPlatforms);
      }

      // Initialize payloads for regeneration
      this.initializeEmailPayload();
      this.initializeSocialPayload();
      this.initializeBlogPayload();
    });
    //generate image
    this.aiContentGenerationService.getImage().subscribe((data) => {
      console.log('getImagegetImage', data);
      if (data) {
        this.imageUrl = data;
      }
    });

    //event image
    this.aiContentGenerationService.getOfferImage().subscribe((data) => {
      console.log('getOfferImagegetImage', data);
      if (data) {
        this.imageOfferUrl = data;
      }
    });

    //offer image
    this.aiContentGenerationService.getEventImage().subscribe((data) => {
      console.log('getEventImagegetImage', data);
      if (data) {
        this.imageEventUrl = data;
      }
    });
    this.brand = this.formData?.brand?.replace('.com', ' ');
    let brandName = this.formData?.brand?.trim();
    brandName = brandName.replace(/\s+/g, '');
    this.showMore = 'https://www.' + brandName + '.com/';

    //heading and email content - now using new API format
    this.contentDisabled = true;
    this.aiContentGenerationService
      .getEmailHeadResponsetData()
      .subscribe((data) => {
        console.log('get email complete response:', data);

        // Check if data has the new format (result.generation) or old format (content)
        if (data?.result?.generation) {
          // New API format from generateContent
          this.emailHeader = data.result.generation.email_header;
          console.log('email header (new format):', this.emailHeader);

          // Extract email body content
          if (data.result.generation.html) {
            let emailContent =
              typeof data.result.generation.html === 'string'
                ? data.result.generation.html
                : JSON.parse(data.result.generation.html);
            emailContent = emailContent.replace(/"/g, '').trim();
            this.editorContentEmail = emailContent.replace(/\\n\\n/g, '');
            console.log('email body content:', this.editorContentEmail);
            this.existingEmailContent = this.editorContentEmail;
            this.hyperUrl = this.formData?.Hashtags;

            // Function to count words in a string
            const countWords = (emailContent: any) => {
              if (!emailContent) return 0;
              // Normalize spaces and split by space to get words
              return emailContent?.trim().replace(/\s+/g, ' ').split(' ').length;
            };
            // Count words in different parts of the email content
            this.totalWordCount = countWords(this.editorContentEmail);

            this.checkAllDataLoaded(); // Email data loaded
            this.isEMailPromptDisabled = false;
            this.commonPromptIsLoading = false;
            this.translateIsLoading = false;
            this.isImageRegenrateDisabled = false;
            this.isImageRefineDisabled = false;

            this.contentDisabled = false;
            console.log('Total word count:', this.totalWordCount);
            this.chnge.detectChanges();
          }

          // Extract email subjects from new format
          if (data.result.generation.email_subjects) {
            this.subjctsEmail = data.result.generation.email_subjects;
            console.log('email subjects (new format):', this.subjctsEmail);
          }

          // Extract image URL from new format
          if (data.result.generation.image_url) {
            this.imageUrl = data.result.generation.image_url;
            console.log('image URL (new format):', this.imageUrl);
          }
        } else if (data?.content) {
          // Old API format fallback (for backward compatibility)
          let emailContent =
            typeof data.content === 'string'
              ? data.content
              : JSON.parse(data.content);
          this.emailHeader = emailContent;
          console.log('email header (old format):', this.emailHeader);
        }

        let brandName = this.formData?.brand?.trim();
        if (brandName) {
          brandName = brandName.replace(/\s+/g, '');
          this.brandlogoTop =
            brandName !== 'babycheramy.lk'
              ? 'https://img.logo.dev/' +
              brandName +
              '?token=pk_SYZfwlzCQgO7up6SrPOrlw'
              : 'https://www.babycheramy.lk/images/logo.webp';
        }

        //brand logo and links
        this.aiContentGenerationService
          .getBrandData(this.formData?.brand)
          .subscribe({
            next: (response) => {
              // Extracting links and logo
              console.log('brands response', response);
              this.brandLinks = response.links;
              console.log('brands links', this.brandLinks);
              this.brandlogo = response.logos[0]?.formats[0]?.src; // First logo's SVG src
              this.theme = response.logos[0]?.tags.theme;
              console.log('brands logo', this.theme);
              this.brandColor = response.colors;
              console.log('brands logo', this.brandColor);
              console.log('brands logo', this.brandlogo);

              // Example usage
              this.darkHexCode = this.fetchHexCodeByType('dark');
              this.lightHexCode = this.fetchHexCodeByType('accent');

              console.log(this.darkHexCode); // Output: #0a0a5f
              console.log(this.lightHexCode); // Output: #ffcd39
            },
            error: (err) => {
              console.error(err);
            },
          });
      });

    this.aiContentGenerationService
      .getSubjectResponseData()
      .subscribe((data) => {
        //this.isSocialMediaPromptDisabled = false;
        //this.editorContentSocialMedia = data?.content;
        const subjects = data?.content;
        console.log('email sub 0 : ', subjects);

        if (subjects) {
          this.subjctsEmail = subjects
            .split(';')
            .map((subject: string) => subject.replace(/"/g, '').trim())
            .filter((subject: string) => subject !== '');
          console.log('email sub : ', this.subjctsEmail);
        }

        if (this.subjctEmail.length > 0) {
          this.selectedSubject = this.subjctEmail[0]?.replace(/\n/g, '');
          console.log('fetch subject:', this.selectedSubject);
          const replaceSub = this.selectedSubject?.replace(/\n/g, '');
          this.onSubjectChange(replaceSub);
        }
        this.chnge.detectChanges();
      });
    this.chnge.detectChanges();
    //fetch images
    //this.fetchMedia(this.formData?.brand);
    this.blogstructure = this.blogGuideLines();
    //social media
    this.contentDisabled = true;
    this.socialContentSubscription = this.aiContentGenerationService
      .getSocialResponsetData()
      .subscribe((data) => {
        console.log('Social media complete response:', data);
        console.log('Generation object:', data?.result?.generation);

        // Extract Facebook content - check multiple possible structures
        if (data?.result?.generation?.facebook) {
          const fbData = data.result.generation.facebook;
          console.log('Facebook data object:', fbData, 'Type:', typeof fbData);
          // Handle if fbData is a string directly or has content/text properties
          if (typeof fbData === 'string') {
            this.editorContentSocialMedia1 = fbData.replace(/"/g, '').trim();
          } else {
            this.editorContentSocialMedia1 = (fbData.content || fbData.text || '')
              .replace(/"/g, '')
              .trim();
          }
          console.log('Facebook content extracted:', this.editorContentSocialMedia1);
        } else if (data?.result?.generation?.Facebook) {
          const fbData = data.result.generation.Facebook;
          console.log('Facebook data object (uppercase):', fbData, 'Type:', typeof fbData);
          if (typeof fbData === 'string') {
            this.editorContentSocialMedia1 = fbData.replace(/"/g, '').trim();
          } else {
            this.editorContentSocialMedia1 = (fbData.content || fbData.text || '')
              .replace(/"/g, '')
              .trim();
          }
          console.log('Facebook content extracted (uppercase):', this.editorContentSocialMedia1);
        } else if (data?.content) {
          // Old format fallback
          this.editorContentSocialMedia1 = data.content.replace(/"/g, '').trim();
          console.log('Facebook content (old format):', this.editorContentSocialMedia1);
        } else {
          console.warn('No Facebook content found in response!');
        }

        //refine content
        this.characterCount = this.editorContentSocialMedia1?.length || 0;
        this.existingContent = this.editorContentSocialMedia1;
        this.contentDisabled = false;
        // Function to count words in a string
        const countWords = (emailContent: any) => {
          if (!emailContent) return 0;
          // Normalize spaces and split by space to get words
          return emailContent?.trim().replace(/\s+/g, ' ').split(' ').length;
        };
        // Count words in different parts of the email content
        this.totalWordCount = countWords(this.editorContentSocialMedia1);

        //this.isContentLoaded= false;
        this.isEMailPromptDisabled = false;
        this.commonPromptIsLoading = false;
        this.isImageRegenrateDisabled = false;
        this.isImageRefineDisabled = false;

        console.log('Total word count:', this.totalWordCount);
        this.chnge.detectChanges();

        let brandName = this.formData?.brand?.trim();
        if (brandName) {
          brandName = brandName.replace(/\s+/g, '');
          this.brandlogo =
            'https://img.logo.dev/' +
            brandName +
            '.com?token=pk_SYZfwlzCQgO7up6SrPOrlw';
          console.log('logo:', this.brandlogo);
        }


        // Extract Instagram content from the SAME response (not a separate subscription)
        console.log('Extracting Instagram content from same response:', data);
        if (data?.result?.generation?.instagram) {
          const instaData = data.result.generation.instagram;
          console.log('Instagram data object:', instaData);
          if (typeof instaData === 'string') {
            this.editorContentSocialMedia2 = instaData.replace(/"/g, '').trim();
          } else {
            this.editorContentSocialMedia2 = (instaData.content || instaData.text || '')
              .replace(/"/g, '')
              .trim();
          }
          console.log('Instagram content (new format lowercase):', this.editorContentSocialMedia2);
        } else if (data?.result?.generation?.Instagram) {
          const instaData = data.result.generation.Instagram;
          console.log('Instagram data object (uppercase):', instaData);
          if (typeof instaData === 'string') {
            this.editorContentSocialMedia2 = instaData.replace(/"/g, '').trim();
          } else {
            this.editorContentSocialMedia2 = (instaData.content || instaData.text || '')
              .replace(/"/g, '')
              .trim();
          }
          console.log('Instagram content (new format uppercase):', this.editorContentSocialMedia2);
        } else if (data?.content && !this.editorContentSocialMedia2) {
          // Old format fallback - use same content as Facebook if no separate Instagram data
          this.editorContentSocialMedia2 = data.content.replace(/"/g, '').trim();
          console.log('Instagram content (old format fallback):', this.editorContentSocialMedia2);
        }

        this.checkAllDataLoaded(); // Social media data loaded
        this.chnge.detectChanges();
      });

    //blog
    this.blogContentSubscription = this.aiContentGenerationService.getBlogResponsetData().subscribe((data) => {
      console.log('blog response:', data);

      // Check for new API format - expecting data.result.generation.html
      if (data?.result?.generation?.html) {
        this.editorContentSocialMedia = data.result.generation.html;
        console.log('Blog content (new format - html field):', this.editorContentSocialMedia);

        // Extract blog_title if available
        if (data.result.generation.blog_title) {
          this.blog_title = data.result.generation.blog_title;
          console.log('Blog title extracted:', this.blog_title);
        }
      } else if (data?.result?.generation?.blog) {
        this.editorContentSocialMedia = data.result.generation.blog;
        console.log('Blog content (new format - blog field):', this.editorContentSocialMedia);

        // Extract blog_title if available
        if (data.result.generation.blog_title) {
          this.blog_title = data.result.generation.blog_title;
          console.log('Blog title extracted:', this.blog_title);
        }
      } else if (data?.content) {
        // Old format fallback
        this.editorContentSocialMedia = data.content;
        console.log('Blog content (old format):', this.editorContentSocialMedia);
      }

      const cleanedString = this.editorContentSocialMedia
        ?.replace(/^```html/, '')
        .replace(/```$/, '');
      console.log('blog response data after cleaning:', cleanedString);
      this.editorContentSocialMedia = cleanedString;
      this.editorContentSocialMedia = this.editorContentSocialMedia
        ?.replace(/"/g, '')
        .trim();

      // const titlePattern = /(?:<p><b>SEO Title:<\/b>|<b>SEO Title:<\/b>|<b>SEO Title:)(.*?)(?=<\/b>|\n|$)/;
      // const descriptionPattern = /(?:<p><b>SEO Description:<\/b>|<b>SEO Description:<\/b>|<b>SEO Description:)(.*?)(?=<\/b>|\n|$)/;

      const titlePattern =
        /(?:<p><b>SEO Title:\s*<\/b>|<b>SEO Title:\s*<\/b>)(.*?)(?=<\/b>|<\/p>|\n|$)/;
      const descriptionPattern =
        /(?:<p><b>SEO Description:\s*<\/b>|<b>SEO Description:\s*<\/b>)(.*?)(?=<\/b>|<\/p>|\n|$)/;

      const titleMatch = this.editorContentSocialMedia.match(titlePattern);
      const descriptionMatch =
        this.editorContentSocialMedia.match(descriptionPattern);

      if (titleMatch) {
        this.seoTitle = titleMatch[1].trim();
      }

      if (descriptionMatch) {
        this.seoDescription = descriptionMatch[1].trim();
      }

      // Remove head section from original HTML
      this.blogContent = this.editorContentSocialMedia
        .replace(/<title>.*?<\/title>/s, '')
        .trim();
      //this.blogContent = this.blogContent .replace(/<p><b>SEO Title:<\/b>.*?<\/p>/, '').replace(/<p><b>SEO Description:<\/b>.*?<\/p>/, '').trim();
      this.blogContent = this.blogContent
        .replace(titlePattern, '')
        .replace(descriptionPattern, '')
        .trim();
      //refine content
      this.existingContent = this.editorContentSocialMedia;
      this.contentDisabled = false;
      // Function to count words in a string
      const countWords = (emailContent: any) => {
        if (!emailContent) return 0;
        // Normalize spaces and split by space to get words
        return emailContent?.trim().replace(/\s+/g, ' ').split(' ').length;
      };
      // Count words in different parts of the email content
      this.totalWordCount = countWords(this.editorContentSocialMedia);

      //this.isContentLoaded= false;
      this.isEMailPromptDisabled = false;
      this.commonPromptIsLoading = false;
      this.isImageRegenrateDisabled = false;
      this.isImageRefineDisabled = false;

      console.log('Total word count:', this.totalWordCount);
      this.checkAllDataLoaded(); // Blog data loaded
      this.chnge.detectChanges();

      this.chnge.detectChanges();
    });
  }

  //fetch images
  /* fetchMedia(brand: string) {
    this.aiContentGenerationService.getImages(brand).subscribe(
      (response) => {
        this.posts = response.photos; // Get the latest 4 images
        console.error('Email fetching images :', this.posts);
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }*/

  ngAfterViewInit() {
    const img = new Image();
    img.src = this.imageUrl;
    console.log('Image load : ', img.src);
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      if (width === height) {
        this.setImageDimensions('640px', '640px');
      } else if (height > width) {
        this.setImageDimensions('640px', '240px');
      }
    };
  }

  fetchHexCodeByType(type: string) {
    const filteredColor = this.brandColor.find((color) => color.type === type);
    return filteredColor ? filteredColor.hex : null; // Return null if not found
  }
  setImageDimensions(height: string, width: string) {
    this.imageContainerHeight = height;
    this.imageContainerWidth = width;
    this.imageHeight = height;
    this.imageWidth = width;
    console.log(
      'Image load size : ',
      this.imageContainerHeight,
      'X',
      this.imageContainerWidth,
      '  ::  ',
      this.imageHeight,
      'X',
      this.imageWidth
    );
  }

  onSubjectChange(selectedSubject: string) {
    console.log('Selected subject:', selectedSubject);
    this.aiContentGenerationService.setEmailSubResponseData(selectedSubject);
  }

  onEdittoInit(): void {
    if (this.editorContentEmail) {
      console.log('EditorContent2:', this.editorContentEmail);
      this.editorComponent.editor.setContent(this.editorContentEmail);
    }
  }
  onEditSocialMediatoInit() {
    if (this.editorContentSocialMedia) {
      console.log('EditorContent2:', this.editorContentSocialMedia);
      this.editorComponent.editor.setContent(this.editorContentSocialMedia);
    }
  }

  onEditBlogtoInit() {
    if (this.editorContentBlog) {
      console.log('EditorContent2:', this.editorContentBlog);
      this.editorComponent.editor.setContent(this.editorContentBlog);
    }
  }
  onCreateProject() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    this.dialog.open(DialogSuccessComponent, dialogConfig);
  }

  inputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }

  navigateToForm(): void {
    this.route.navigateByUrl('combined-client');

    this.chnge.detectChanges();
  }

  navigateToSave(): void {
    // const dialogRef = this.dialog.open(ReviewDialogComponent, {
    //   width: '574px',
    //   height: '346px',
    // });
  }

  aiContentGeneration1(prompt: string, type: string): void {
    if (type === 'blog') {
      this.isBlogPromptDisabled = true;
      prompt = `$previos response ${this.editorContentBlog}, Refine blog ${prompt}`;
    } else if (type === 'regenerate') {
      // this.imageRegenrate();
      this.isEMailPromptDisabled = true;
      prompt = `Create a mail content based on topic "${this.formData?.topic}". the intended tone of the mail is "${this.formData?.Type}". Some more details to be consider for generating email body is  "${this.formData?.purpose}".The target reader is "$${this.formData?.readers}", the mail content should be exact   "${this.formData?.wordLimit}" words .with all sentences closed properly Structure the email for Angular application. So, email should be created with html tags so it's easy to display except <html> and <code> tag or * or unwanted symbols not on this body. On this email parts which are , first section of Salutation as inside <p> tag then <br/> or next line two time then, second section of Email Body as inside <p> tags and new lines based on the body content then <br/> tag, third section of Closing Remarksin <p> tag and no space / or new line in between closing remarks. whole mail content should start from Salutation and end with Closing Remarks don't show other context other then the email
The html tags are separate and it should not be part of word count`;
      // prompt = `Create a mail content based on topic "${this.formData?.topic}". the intended tone of the mail is "${this.formData?.Type}". Some more details to be consider for generating email body is  "${this.formData?.purpose}".The target reader is "${this.formData?.readers}", the mail content should be  "${this.formData?.wordLimit}" words . Structure the email such that it can be displayed in an Angular application with Subject as Bold, Salutation as Italics, Email Body in next paragraph and Closing Remarks in a separate line. Also can you provide the output in a json object which has four attributes - Subject, Salutation, Body and Closing Remarks.`
      // prompt = `Consider you are a Content Email Marketing Specialist. Create a marketing mail content based on topic "${this.formData?.topic}". Some more details to be consider for generating email body is  "${this.formData?.purpose}". The mail content is to be generated by considering campaign type as "${this.formData?.campaign}" and the intended target audience for the mail is"${this.formData?.Type}".Consider the blog to have a Word Count more than  "${this.formData?.wordLimit}". target reader "${this.formData?.readers}" Structure the email such that it can be displayed in an Angular application with Subject as Bold, Salutation as Italics, Email Body in next paragraph and Closing Remarks in a separate line. Also can you provide the output in a json object which has four attributes - Subject, Salutation, Body and Closing Remarks.`;
    } else if (type === 'social_media') {
      this.isSocialMediaPromptDisabled = true;
      prompt = `$previos response ${this.editorContentSocialMedia}, Refine social_media ${prompt}`;
    } else if (type === 'common_prompt') {
      this.commonPromptIsLoading = true;
      // prompt = `Consider you are a Content Email Marketing Specialist. Create a marketing mail content based on topic "${prompt}".Structure the email such that it can be displayed in an Angular application with Subject as Bold, Salutation as Italics, Email Body in next paragraph and Closing Remarks in a separate line. Also can you provide the output in a json object which has four attributes - Subject, Salutation, Body and Closing Remarks.`;
      prompt = `This is my existing mail "${this.existingEmailContent}" in that don't change whole content from my existing mail, just add the new fact / content without removing existing mail content based on user input and this is the prompt which user want to add in existing mail " ${prompt} ". and this to modify in existing email body and not modify or rephrase whole mail body with all sentences closed properly. Structure the email for Angular application. So, email should be created with html tags so it's easy to display except <html> and <code> tag or * or unwanted symbols not on this body. On this email parts which are , first section of Salutation as inside <p> tag then <br/>, second section of Email Body as inside p tags and new lines based on the body content then <br/> tag, third section of Closing Remarks in <p> tag and no space / or new line in between closing remarks. whole mail content should start from Salutation and end with Closing Remarks don't show other context other then the email.The html tags are separate and it should not be part of word count.`;
    } else if (type === 'Translate') {
      this.translateIsLoading = true;
      prompt = `Create a mail content based on topic ${this.formData?.topic}" . the intended tone of the mail is "${this.formData?.Type}". Some more details to be consider for generating email body is  "${this.formData?.purpose}".The target reader is "${this.formData?.readers} but, don't include in Salutation", the content should be equal  "${this.formData?.wordLimit}" words. Structure the email such that it can be displayed in an Angular application with html tags except <html> or <code> on this email parts which are Subject as Bold and it whole subject and its content inside into <p> tag , Salutation as Italics in next paragraph, Email Body in next paragraph , and Regards in next paragraphe. whole mail content should start from subject.`;
    }

    this.aiContentGenerationService
      .generateOtherContent(prompt, 'emailer')
      .subscribe({
        next: (data) => {
          if (type === 'regenerate') {
            this.aiContentGenerationService.setEmailResponseData(data);
          } else if (type === 'common_prompt') {
            this.aiContentGenerationService.setEmailResponseData(data);
          } else if (type === 'Translate') {
            this.aiContentGenerationService.setEmailResponseData(data);
          }
          console.log(`Response from API for ${type}:`, data);
          this.chnge.detectChanges();
        },
        error: (error) => {
          console.error(`Error occurred for ${type}:`, error);
        },
      });
  }

  imageRegenrate() {
    this.isImageRegenrateDisabled = true;
    var topicPropmt = `Create an image on "${this.formData?.topic}" and image should have white or grey back ground`;
    this.aiContentGenerationService.imageGeneration(topicPropmt).subscribe({
      next: (data) => {
        this.aiContentGenerationService.setImage(data[0].url);
        this.isImageRegenrateDisabled = false;
        //this.loadImage(data[0].url);
      },
      error: (err) => {
        console.error('Error generating image:', err);
      },
    });

    //image offer and event

    var eventImage = `Create an "${this.formData?.brand}" event image on "${this.formData?.topic}"`;
    var offerImage = `Create an "${this.formData?.brand}" offer image on "${this.formData?.topic}"`;
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
  }

  onImageRefine(prompt: string, type: string): void {
    this.isImageRefineDisabled = true;
    /*var topicPropmt =  `This is the existing image topic "${this.formData?.topic}". It should be refine based on the user input in this propt ${prompt} that aligns with Deloitte's brand guidelines. Color palette:
        Use shades of green (primary) and black (secondary) and Don't use text in image.
        Style:Maintain a professional, trustworthy, innovative aesthetic and image size should be width and height as 640 * 640 px`;*/
    var topicPropmt = `This is the existing image url "${this.imageUrl}" and topic "${this.formData?.topic}". It should be refine image based on the user input in this propt "${prompt}". But , not change whole image and image should have white or grey back ground`;
    this.aiContentGenerationService.imageGeneration(topicPropmt).subscribe({
      next: (data) => {
        console.log('image:', data);

        this.aiContentGenerationService.setImage(data[0].url);
        this.isImageRefineDisabled = false;
        //this.loadImage(data[0].url);
      },
      error: (er) => {
        console.log('Error refine image', er);
      },
    });
  }

  // showToast():void{
  //   this.isToastVisible=true;

  // }
  // hideToast():void{
  //   this.isToastVisible=false;
  //   this.navigateToForm();
  // }

  async plagrismContent() {
    this.aiContentGenerationService
      .checkPlagiarism(this.editorContentEmail)
      .subscribe(
        (result) => {
          this.plagiarismCount = result;
          const regex = /<title>(.*?)<\/title>/i;
          const match = this.plagiarismCount.match(regex);

          // If a match is found, return the content inside the <title> tag, otherwise return a default message
          if (match && match[1]) {
            this.plagiarismCount = match[1].trim();
          } else {
            this.plagiarismCount = '0'; // Default if no title tag is found
          }

          this.aiContentGenerationService.setplagrism(this.plagiarismCount);
          console.log('Plagris value :', this.plagiarismCount);
        },
        (error) => {
          console.error('Error checking plagiarism', error);
        }
      );

    this.aiContentGenerationService.getplagrism().subscribe((data) => {
      this.plagrismCheck = data; // Use the data received from the service
      console.log('plagrism data received:', this.plagrismCheck);
    });

    // const dialogRef = this.dialog.open(PlagrismComponent, {
    //   width: '494px',
    //   height: '280px',
    // });
  }
  currentIndex: number = 0;

  // Total number of pages (adjust if you add more content in the HTML)
  totalPages: number = 3;

  goToPreviousPage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToNextPage(): void {
    if (this.currentIndex < this.totalPages - 1) {
      this.currentIndex++;
    }
  }
  aiContentGeneration2(prompt: string, type: string): void {
    if (type === 'regenerate') {
      this.isEMailPromptDisabled = true;
      prompt = `Create a social media post for scocial media platform "${this.formData?.mediaType}" based on topic "${this.formData?.topic}" and should be of language "${this.formData?.lang}" . The intended tone of the post is "${this.formData?.Type}". Some more details to be considered for generating post content is  "${this.formData?.purpose}".The target audience is "${this.formData?.readers}".The content of post having upto "${this.formData?.wordLimit}" characters and all sentences closed properly. Also include socially relevant , trending tags amd emotion | emoji if required on the the post and in last add this link  "${this.formData?.Hashtags}" if link not provide don't show and don't pass into content. don't add additional details like notes or word count. `;
    } else if (type === 'common_prompt') {
      this.commonPromptIsLoading = true;
      prompt = `This is my existing post "${this.existingContent}" in that don't change whole content from my existing post, just add the new fact / content without removing existing post content based on user input or rephrase withput exced the word limit, The content of post should not exceed "${this.formData?.wordLimit}" words limit. and this is the prompt which user want to add in existing post " ${prompt} ". The content of post characters not exceeding "${this.formData?.wordLimit}" limit, with all sentences closed properly. Also include socially relevant tags for the post. Also include emotions if required. only show content and hastags not any type of additional details or notes `;
    }

    this.aiContentGenerationService
      .generateOtherContent(prompt, 'social_media')
      .subscribe({
        next: (data) => {
          if (type === 'regenerate') {
            this.aiContentGenerationService.setSocialResponseData(data);
            this.isEMailPromptDisabled = false;
          } else if (type === 'common_prompt') {
            this.aiContentGenerationService.setSocialResponseData(data);
            this.commonPromptIsLoading = false;
          }
          console.log(`Response from API for ${type}:`, data);
          this.chnge.detectChanges();
        },
        error: (error) => {
          console.error(`Error occurred for ${type}:`, error);
        },
      });
  }

  aiContentGeneration3(prompt: string, type: string): void {
    if (type === 'regenerate') {
      this.isEMailPromptDisabled = true;
      prompt = this.constructPrompt();
    } else if (type === 'common_prompt') {
      this.commonPromptIsLoading = true;
      prompt = `This is my existing blog "${this.existingContent}" in that don't change whole content from my existing blog, just add the new fact / content without removing existing post blog based on user input and this is the prompt which user want to add in existing blog " ${prompt} ". just directly show blog content only don't show addition details.`;
    }

    this.aiContentGenerationService.generateOtherContent(prompt, 'blog').subscribe({
      next: (data) => {
        if (type === 'regenerate') {
          this.aiContentGenerationService.setBlogResponseData(data);
          this.isEMailPromptDisabled = false;
        } else if (type === 'common_prompt') {
          this.aiContentGenerationService.setBlogResponseData(data);
          this.commonPromptIsLoading = false;
        }
        console.log(`Response from API for ${type}:`, data);
        this.chnge.detectChanges();
      },
      error: (error) => {
        console.error(`Error occurred for ${type}:`, error);
      },
    });
  }
  constructPrompt(): string {
    switch (this.formData?.format) {
      case 'SEO-Optimised Longform':
        // return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles.  Body should have Title as <H1><b> and Introduction of Brief overview, keyword integration, sub-headings only as <H2> with 2% keyword density and sub-headings should not more than one in body and don't show the introduction and conclusion title just there body need to show.  Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create an SEO-optimized, long-form blog post in ${this.formData?.format} format of exactly ${this.formData?.wordLimit} words on the topic "${this.formData?.topic}" in "${this.formData?.lang}" language, using a "${this.formData?.Type}" tone. The blog's purpose is "${this.formData?.purpose}" for a "${this.formData?.target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${this.formData?.keywords}". using the following structure:
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
9.Don,t add heading like Title, Subtitle,Body, Introduction, Main Content and Conclusion. just write their body only.    `;

      case 'SEO-Optimised Listicle':
        //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b>, subheadings as <H2>   with Sequential numbering and 2% keyword density. Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create  a blog in ${this.formData?.format} format with exactly ${this.formData?.wordLimit} words on the topic "${this.formData?.topic}" in "${this.formData?.lang}" language, using a "${this.formData?.Type}" tone. The blog's purpose is "${this.formData?.purpose}" for a "${this.formData?.target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${this.formData?.keywords}".. Use the following structure:
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
        return `Create a blog in ${this.formData?.format} format of exactly ${this.formData?.wordLimit} words on the topic "${this.formData?.topic}" in "${this.formData?.lang}" language, using a "${this.formData?.Type}" tone. The blog's purpose is "${this.formData?.purpose}" for a "${this.formData?.target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${this.formData?.keywords}". Follow this structure:
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
        return `Create a blog in ${this.formData?.format} format of exactly ${this.formData?.wordLimit} words on the topic "${this.formData?.topic}" in "${this.formData?.lang}" language, using a "${this.formData?.Type}" tone. The blog's purpose is "${this.formData?.purpose}" for a "${this.formData?.target}" audience. Ensure proper sentence closure and SEO optimization using the keywords: "${this.formData?.keywords}".. Follow this structure:  
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
        return `Create a blog in ${this.formData?.format} format of exactly ${this.formData?.wordLimit} words on the topic "${this.formData?.topic}" in "${this.formData?.lang}" language, using a "${this.formData?.Type}" tone. The blog's purpose is "${this.formData?.purpose}" for a "${this.formData?.target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${this.formData?.keywords}". Follow this structure: 
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

  blogGuideLines(): string {
    switch (this.formData?.format) {
      case 'SEO-Optimised Longform':
        return `<em><b>Title (H1) – </b>Catchy and Should have keywords </em><br>

<em><b>Introduction – </b>Brief overview, keyword integration </em><br>

<em ><b>Table of contents </b></em><br>

<em ><b>Sub-Titles (H2 onwards) – </b>Should have variations of keywords (each should be in Table of Contents) </em><br>

<em ">Body  - content for each sub-title </em><br>

<em >Content Guidelines for Body </em><br>

<em > <b>•</b>Write in Short Paragraphs: Use 2-3 sentence paragraphs to improve readability, especially on mobile devices.</em><br> 

<em> <b>•</b>Use Lists and Bullet Points: Highlight key information with bullets or numbered lists. </em><br>

<em> <b>•</b>Examples and Real-Life Scenarios: Provide relevant examples or case studies for added value.</em> <br>

<em> <b>•</b>Keyword Density: Maintain natural keyword usage without stuffing; aim to include the primary keyword in each main section without overuse.</em> <br>

<em><b>Conclusion<b/></em> <br>

<em><b>Social Sharing buttons -</b> Place social sharing buttons at the beginning or end of the post, and prompt readers to share.</em><br> `;
      //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  subtitles. Body should have Title as <H1><b>, subheadings as <H2> with 2% keyword density. Output in HTML format.`;
      // return `Create a ${format} blog of exact and equal "${wordLimit}" words on topic "${topic}" in language "${lang}" with this tone  "${Type}". The purpose of blog is  "${purpose}" and  target audience is "${readers}" . All sentences closed properly. Blog should be seo optimised of these  “${keywords}”  with keyword also it should have seo title and meta description. Structure the blog first section Title should be <H1> tag and inside <b> tag and then next line <br>, Second section all sub title should be <H2> Tag and have variation of keywords and Keywords density  2% for each keyword. Third  section is body in <p> tag then next line <br> tag then last section conclusion in <p> tag . just directly show blog content only don't show addition details.`;
      // return `Create a website blog for scocial media platform "${mediaType}" based on topic "${topic}" and should be of language "${lang}" . The intended tone of the post is "${Type}". Some more details to be considered for generating post content is  "${purpose}".The target audience is "${readers}" .The content of post should not exceed "${wordLimit}" words , with all sentences closed properly. Also include socially relevant tags for the post. Also include emoticons if required. URL to be included or additional details to be quoted directly in the post are as following "${Hashtags}". do not include any note, want to directly comsume the output.`;
      case 'SEO-Optimised Listicle':
        return `<em><b>Title (H1) –</b> Catchy and Should have keywords </em><br>

<em> <b>Introduction –</b> Brief overview, keyword integration </em><br>

<em> <b>Main List Items (H2 for Each List Item and body) –</b> Sequential numbering, keyword variations - H should have variations of keywords and body should have keywords </em><br>

<em> <b>Conclusion </b> </em><br>

<em> <b>Social Sharing buttons -</b> Place social sharing buttons at the beginning or end of the post, and prompt readers to share. </em><br>

<em>Note – 1. The heading does not have to be worded exactly as above. It could change as per context/topic </em><br>

<em>2. Body should have keywords/variation of keywords </em> `;

      case 'Case Study':
        return `<em> <b>Title (H1) – </b>Catchy and should have keywords </em><br>

<em> <b>Introduction – </b>Brief overview </em><br>

<em> <b>Client/Project Background (H2 and Body) – </b>Describe client, industry, challenges – H should have variations of keywords and body should have keywords </em><br>

<em> <b>Approach and Solution (H3 and Body) – </b> Solution strategy, steps taken, tools and techniques </em> <br>

<em> <b>Implementation process (H4 and Body) –</b> Explain the execution </em><br>

<em> <b>Results and Outcome (H5 and Body) – </b>Key metrics, outcome/success </em><br>

<em> <b>Client testimonial (optional) </b></em><br>

<em> <b>Conclusion</b> </em> <br>

<em>Note – 1. The heading does not have to be worded exactly as above. It could change as per context/topic </em> <br>

<em>2. Body should have keywords/variation of keywords </em>`;
      case 'Fact Sheet':
        return `<em><b>Title (H1) –</b> Catchy and Should have keywords </em> <br>

<em> <b>Introduction – </b>Brief overview, keyword integration </em> <br>

<em> <b>Key Facts and bullet points (H2 and body) -</b> H should have variations of keywords and body should have keywords </em> <br>

<em> <b>In-Depth detail (optional) (H3 and Body) -</b> H should have variations of keywords and body should have keywords </em> <br>

<em> <b>Conclusion </b> </em> <br>

<em>Note –  

1. The heading does not have to be worded exactly as above. It could change as per context/topic</em> <br>

<em>2. Body should have keywords/variation of keywords</em> `;
      case 'Guide':
        return `<em> <b>Title (H1) –</b> Catchy and Should have keywords </em><br>

<em> <b>Introduction – </b>Brief overview, keyword integration </em><br>

<em> <b>Table of contents</b> </em> <br>

<em> <b>Sectioned Steps or Main Parts (H2 and Body) - </b>H should have variations of keywords and body should have keywords </em> <br>

<em> <b>Detailed Explanation for Each Section (H3 and Body) - </b>H should have variations of keywords and body should have keywords </em><br>

<em> <b>Additional Tips, Warnings, or Best Practices (Optional) </b> </em> <br>

<em> <b>Summary and Key Takeaways </b> </em><br>

<em> <b>Social Sharing buttons - </b>Place social sharing buttons at the beginning or end of the post, and prompt readers to share. </em><br>



<em>Note –  

1. The heading does not have to be worded exactly as above. It could change as per context/topic </em><br>

<em>2. Body should have keywords/variation of keywords</em> `;
      default:
        return '';
    }
  }

  // Email Payload Initialization
  initializeEmailPayload(): void {
    if (!this.formData) return;

    this.emailPayload = new FormData();
    const useCase = this.formData?.use_case || 'Email Campaign';
    this.emailPayload.append('use_case', useCase);
    this.emailPayload.append('purpose', this.formData?.purpose || '');
    this.emailPayload.append('brand', this.formData?.brand || '');
    this.emailPayload.append('tone', this.formData?.Type || '');
    this.emailPayload.append('topic', this.formData?.topic || '');
    this.emailPayload.append('word_limit', this.formData?.wordLimit || '');
    this.emailPayload.append('target_reader', this.formData?.readers || '');
    this.emailPayload.append('image_details', this.formData?.imageOpt || '');

    if (this.formData?.imgDesc && this.formData?.imgDesc.trim() !== '') {
      this.emailPayload.append('image_description', this.formData?.imgDesc);
    }

    console.log('Email Payload initialized with word_limit:', this.formData?.wordLimit);
  }

  // Social Media Payload Initialization
  initializeSocialPayload(): void {
    if (!this.formData) return;

    this.socialPayload = new FormData();
    const useCase = this.formData?.use_case || 'Social Media Content';
    this.socialPayload.append('use_case', useCase);
    this.socialPayload.append('brand', this.formData?.brand || '');
    this.socialPayload.append('platform', this.formData?.campaign2 || '');
    this.socialPayload.append('topic', this.formData?.topic || '');
    this.socialPayload.append('purpose', this.formData?.purpose2 || '');
    this.socialPayload.append('tone', this.formData?.Type || '');
    this.socialPayload.append('word_limit', this.formData?.wordLimit2 || '');
    this.socialPayload.append('target_reader', this.formData?.readers2 || '');
    this.socialPayload.append('image_details', this.formData?.imageOpt || '');

    if (this.formData?.imgDesc && this.formData?.imgDesc.trim() !== '') {
      this.socialPayload.append('image_description', this.formData?.imgDesc);
    }
  }

  // Blog Payload Initialization
  initializeBlogPayload(): void {
    if (!this.formData) return;

    this.blogPayload = new FormData();
    const useCase = this.formData?.use_case || 'Website Blog';
    this.blogPayload.append('use_case', useCase);
    this.blogPayload.append('brand', this.formData?.brand || '');
    this.blogPayload.append('format', this.formData?.format || '');
    this.blogPayload.append('topic', this.formData?.topic || '');
    this.blogPayload.append('purpose', this.formData?.purpose3 || '');
    this.blogPayload.append('tone', this.formData?.Type3 || '');
    this.blogPayload.append('word_limit', this.formData?.wordLimit3 || '');
    this.blogPayload.append('target_reader', this.formData?.readers3 || '');
    this.blogPayload.append('keywords', this.formData?.keywords || '');
    this.blogPayload.append('outline', this.formData?.outline || '');
    this.blogPayload.append('image_details', this.formData?.imageOpt || '');

    if (this.formData?.imgDesc && this.formData?.imgDesc.trim() !== '') {
      this.blogPayload.append('image_description', this.formData?.imgDesc);
    }
  }

  // Validate content feedback (word limit check)
  validateContentFeedback(feedback: string): boolean {
    const wordLimitMatch = feedback.match(/\b\d+\b/g);
    if (wordLimitMatch) {
      const extractedWordLimit = parseInt(wordLimitMatch[0], 10);
      if (extractedWordLimit < 50) {
        return false;
      }
    }
    return true;
  }

  // Regenerate Email Content
  regenerateEmailContent(): void {
    if (!this.emailContentFeedback || this.emailContentFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter feedback to regenerate email content',
        life: 3000
      });
      return;
    }

    if (!this.validateContentFeedback(this.emailContentFeedback)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Word Limit',
        detail: 'Word limit should be more than 50 words.',
        life: 5000
      });
      return;
    }

    if (!this.emailPayload) {
      this.initializeEmailPayload();
    }

    this.emailPayload?.append('feedback', this.emailContentFeedback);
    this.emailPayload?.append('regenerate', 'true');

    // Debug: Log payload values
    console.log('Email Regeneration - word_limit in payload:', this.emailPayload?.get('word_limit'));
    console.log('Email Regeneration - formData.wordLimit:', this.formData?.wordLimit);

    this.isRegeneratingEmailContent = true;


    this.aiContentGenerationService.generateContent(this.emailPayload!).subscribe({
      next: (data) => {
        console.log('Email content regenerated:', data);
        this.aiContentGenerationService.setEmailResponseData(data);

        if (data?.result?.generation) {
          // Update email header
          if (data.result.generation.email_header) {
            this.emailHeader = data.result.generation.email_header;
          }

          // Update email content (handle both html and email_body)
          if (data.result.generation.html) {
            let emailContent = typeof data.result.generation.html === 'string'
              ? data.result.generation.html
              : JSON.parse(data.result.generation.html);
            emailContent = emailContent.replace(/"/g, '').trim();
            this.editorContentEmail = emailContent.replace(/\\n\\n/g, '');
          } else if (data.result.generation.email_body) {
            this.editorContentEmail = data.result.generation.email_body;
          }

          // Update image URL if provided
          if (data.result.generation.image_url) {
            this.imageUrl = data.result.generation.image_url;
          }

          // Update email subjects if provided
          if (data.result.generation.email_subjects) {
            this.subjctsEmail = data.result.generation.email_subjects;
          }
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Email content regenerated successfully',
          life: 3000,
          styleClass: 'custom-toast-success'
        });

        this.emailContentFeedback = '';
        this.initializeEmailPayload();
        this.isRegeneratingEmailContent = false;

        this.chnge.detectChanges();
      },
      error: (error) => {
        console.error('Error regenerating email content:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate email content',
          life: 3000
        });
        this.isRegeneratingEmailContent = false;
        this.loading = false;
      }
    });
  }

  // Regenerate Social Media Content
  regenerateSocialContent(): void {
    if (!this.socialContentFeedback || this.socialContentFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter feedback to regenerate social media content',
        life: 3000
      });
      return;
    }

    if (!this.validateContentFeedback(this.socialContentFeedback)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Word Limit',
        detail: 'Word limit should be more than 50 words.',
        life: 5000
      });
      return;
    }

    if (!this.socialPayload) {
      this.initializeSocialPayload();
    }

    this.socialPayload?.append('feedback', this.socialContentFeedback);
    this.socialPayload?.append('regenerate', 'true');

    this.isRegeneratingSocialContent = true;
    // this.loading = true;

    this.aiContentGenerationService.generateContent(this.socialPayload!).subscribe({
      next: (data) => {
        console.log('Social content regenerated:', data);
        this.aiContentGenerationService.setSocialResponseData(data);

        if (data?.result?.generation) {
          // Update posts array with regenerated content
          this.posts = [];

          // Process each platform's content
          this.selectedSocialPlatforms.forEach((platform: string) => {
            const platformKey = platform.toLowerCase();
            const platformData = data.result.generation[platformKey];

            if (platformData) {
              this.posts.push({
                platform: platform,
                content: platformData.content || platformData.text || platformData.caption || '',
                hashtags: platformData.hashtags || '',
                url: platformData.url || ''
              });
            }
          });

          // Update image URL if provided
          if (data.result.generation.image_url) {
            this.imageUrl = data.result.generation.image_url;
          }
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Social media content regenerated successfully',
          life: 3000,
          styleClass: 'custom-toast-success'
        });

        this.socialContentFeedback = '';
        this.initializeSocialPayload();
        this.isRegeneratingSocialContent = false;
        // this.loading = false;
        this.chnge.detectChanges();
      },
      error: (error) => {
        console.error('Error regenerating social content:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate social media content',
          life: 3000
        });
        this.isRegeneratingSocialContent = false;
        this.loading = false;
      }
    });
  }

  // Regenerate Blog Content
  regenerateBlogContent(): void {
    if (!this.blogContentFeedback || this.blogContentFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter feedback to regenerate blog content',
        life: 3000
      });
      return;
    }

    if (!this.validateContentFeedback(this.blogContentFeedback)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Word Limit',
        detail: 'Word limit should be more than 50 words.',
        life: 5000
      });
      return;
    }

    if (!this.blogPayload) {
      this.initializeBlogPayload();
    }

    this.blogPayload?.append('feedback', this.blogContentFeedback);
    this.blogPayload?.append('regenerate', 'true');

    this.isRegeneratingBlogContent = true;
    // this.loading = true;

    this.aiContentGenerationService.generateContent(this.blogPayload!).subscribe({
      next: (data) => {
        console.log('Blog content regenerated:', data);
        this.aiContentGenerationService.setBlogResponseData(data);

        if (data?.result?.generation) {
          this.editorContentBlog = data.result.generation.html || data.result.generation.blog;
          this.blog_title = data.result.generation.blog_title;

          // Update image URL if provided
          if (data.result.generation.image_url) {
            this.imageUrl = data.result.generation.image_url;
          }
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Blog content regenerated successfully',
          life: 3000,
          styleClass: 'custom-toast-success'
        });

        this.blogContentFeedback = '';
        this.initializeBlogPayload();
        this.isRegeneratingBlogContent = false;
        // this.loading = false;
        this.chnge.detectChanges();
      },
      error: (error) => {
        console.error('Error regenerating blog content:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate blog content',
          life: 3000
        });
        this.isRegeneratingBlogContent = false;
        this.loading = false;
      }
    });
  }

  // Regenerate Image (works for all tabs)
  regenerateImage(): void {
    if (!this.imageFeedback || this.imageFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter feedback to regenerate image',
        life: 3000
      });
      return;
    }

    // Create payload with proper field names from form
    const payload = new FormData();
    payload.append('use_case', this.formData?.use_case || 'Email Campaign');
    payload.append('brand', this.formData?.brand || '');
    payload.append('topic', this.formData?.topic || '');
    payload.append('tone', this.formData?.Type || '');
    payload.append('target_reader', this.formData?.readers || '');
    payload.append('image_details', this.formData?.imageOpt || '');

    if (this.formData?.imgDesc && this.formData?.imgDesc.trim() !== '') {
      payload.append('image_description', this.formData?.imgDesc);
    }

    payload.append('image_feedback', this.imageFeedback);
    payload.append('regenerate_image', 'true');

    this.isRegeneratingImage = true;
    // this.loading = true;

    this.aiContentGenerationService.generateContent(payload).subscribe({
      next: (data) => {
        console.log('Image regenerated:', data);

        // Update image URL based on response
        if (data?.result?.generation?.image_url) {
          this.imageUrl = data.result.generation.image_url;
          this.aiContentGenerationService.setImage(this.imageUrl);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image regenerated successfully',
          life: 3000,
          styleClass: 'custom-toast-success'
        });

        this.imageFeedback = '';
        this.isRegeneratingImage = false;
        // this.loading = false;
        this.chnge.detectChanges();
      },
      error: (error) => {
        console.error('Error regenerating image:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate image',
          life: 3000
        });
        this.isRegeneratingImage = false;
        this.loading = false;
      }
    });
  }

  // Append text to email content feedback
  appendToEmailFeedback(text: string): void {
    if (this.emailContentFeedback) {
      this.emailContentFeedback += ' ' + text;
    } else {
      this.emailContentFeedback = text;
    }
  }

  // Append text to social content feedback
  appendToSocialFeedback(text: string): void {
    if (this.socialContentFeedback) {
      this.socialContentFeedback += ' ' + text;
    } else {
      this.socialContentFeedback = text;
    }
  }

  // Append text to blog content feedback
  appendToBlogFeedback(text: string): void {
    if (this.blogContentFeedback) {
      this.blogContentFeedback += ' ' + text;
    } else {
      this.blogContentFeedback = text;
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from observables to prevent memory leaks
    this.socialContentSubscription?.unsubscribe();
    this.blogContentSubscription?.unsubscribe();

    // Clear all data when leaving the review screen to prevent retention
    this.aiContentGenerationService.setData(null);
    this.aiContentGenerationService.setEmailResponseData(null);
    this.aiContentGenerationService.setEmailHeadResponseData(null);
    this.aiContentGenerationService.setSocialResponseData(null);
    this.aiContentGenerationService.setBlogResponseData(null);
    this.aiContentGenerationService.setImage(null);
    this.aiContentGenerationService.setOfferImage(null);
    this.aiContentGenerationService.setEventImage(null);
    this.aiContentGenerationService.setEmailSubResponseData(null);
    this.aiContentGenerationService.setplagrism(null);

    console.log('Combined review component destroyed - all data cleared');
  }
}
