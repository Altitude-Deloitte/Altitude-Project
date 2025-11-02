import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  input,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-combined-client',
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
    OverlayPanelModule,
  ],
  templateUrl: './combined-client.component.html',
  styleUrl: './combined-client.component.css',
})
export class CombinedClientComponent {
  clickEvent?: MouseEvent;
  @ViewChild('commentPanel') commentPanel!: OverlayPanel;
  commentText: string = '';
  panelStyle: any = {};
  commentBox = '';
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
  brandLinks: any[] = [];
  brandlogo: any;
  seoTitle: string = '';
  seoDescription: string = '';
  //brandlogoTop: string | undefined;
  title = 'AI-FACTORY';
  taskForm!: FormGroup;
  blogContent: any;
  blog_title: any;
  ispublisLoaderDisabled = false;
  contentWithImage: any;
  brandlogoTop: any;
  imageUrlS3: any;
  imageOfferUrlS3: any;
  imageEventUrlS3: any;
  //social media
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
  brand: any;
  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService,

    private chnge: ChangeDetectorRef
  ) { }

  formData: any;
  ngOnInit(): void {
    this.imageUrl = null;
    this.loading = true;
    this.editorContentEmail = [];
    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
      console.log('datadatadatadatadatadatadatadatadatadatadatadata', data);
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

    // Normalize brand name once - single source of truth
    let brandName = this.formData?.brand?.trim();
    if (brandName) {
      brandName = brandName.replace(/\s+/g, '');
      // Add .com if it doesn't contain domain extension
      if (!brandName.includes('.com') && !brandName.includes('.lk')) {
        brandName = brandName + '.com';
      }
    }

    console.log("Normalized brand name:", brandName);

    // Set brand display name (without .com)
    this.brand = brandName?.replace('.com', '').replace('.lk', '');

    // Use normalized brandName for all variables
    this.showMore = 'https://www.' + brandName;

    // Set brandlogoTop using normalized brandName
    this.brandlogoTop = brandName !== 'babycheramy.lk'
      ? 'https://img.logo.dev/' + brandName + '?token=pk_SYZfwlzCQgO7up6SrPOrlw'
      : 'https://www.babycheramy.lk/images/logo.webp';

    // Set brandlogo for social media section (same as brandlogoTop)
    this.brandlogo = this.brandlogoTop;

    console.log('Brand logo URL:', this.brandlogoTop);
    console.log('Show more URL:', this.showMore);

    //heading
    this.contentDisabled = true;
    this.aiContentGenerationService
      .getEmailHeadResponsetData()
      .subscribe((data) => {
        console.log('get headering for email ', data);

        // Check for new API format
        if (data?.result?.generation) {
          this.emailHeader = data.result.generation.email_header;
          this.subjctsEmail = data.result.generation.email_subjects || [];
          this.imageUrl = data.result.generation.image_url;
          console.log('Email header (new format):', this.emailHeader);
          console.log('Email subjects:', this.subjctsEmail);
        } else if (data?.content) {
          // Old format fallback
          let emailContent =
            typeof data.content === 'string'
              ? data.content
              : JSON.parse(data.content);
          console.log('get header email heading content', emailContent);
          this.emailHeader = emailContent;
          console.log('get email header', this.emailHeader);
        }
      });

    this.ispublisLoaderDisabled = false;
    this.blogstructure = this.blogGuideLines();
    this.contentDisabled = true;
    this.aiContentGenerationService
      .getEmailResponsetData()
      .subscribe((data) => {
        console.log('Email body response:', data);

        // Check for new API format
        if (data?.result?.generation?.html) {
          this.editorContentEmail = data.result.generation.html;
          console.log('Email content (new format - html):', this.editorContentEmail);
          this.existingEmailContent = this.editorContentEmail;
        } else if (data?.content) {
          // Old format fallback
          // Determine if the content is a string or JSON and parse accordingly
          let emailContent =
            typeof data.content === 'string'
              ? data.content
              : JSON.parse(data.content);
          emailContent = emailContent.replace(/"/g, '').trim();
          this.editorContentEmail = emailContent.replace(/\\n\\n/g, '');
          console.log('email para : ', this.editorContentEmail);
          this.existingEmailContent = this.editorContentEmail;
          // Function to count words in a string
          const countWords = (emailContent: any) => {
            if (!emailContent) return 0;
            // Normalize spaces and split by space to get words
            return emailContent?.trim().replace(/\s+/g, ' ').split(' ').length;
          };
          // Count words in different parts of the email content
          this.totalWordCount = countWords(this.editorContentEmail);

          this.loading = false;
          this.isEMailPromptDisabled = false;
          this.commonPromptIsLoading = false;
          this.translateIsLoading = false;
          this.isImageRegenrateDisabled = false;
          this.isImageRefineDisabled = false;

          this.contentDisabled = false;
          console.log('Total word count:', this.totalWordCount);
          this.chnge.detectChanges();
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

    this.chnge.detectChanges();
    //fetch images
    //this.fetchMedia(this.formData?.brand);

    //social media
    this.contentDisabled = true;
    this.aiContentGenerationService
      .getSocialResponsetData()
      .subscribe((data) => {
        console.log('social media complete response:', data);
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

        // Extract Instagram content from the SAME response
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

        this.chnge.detectChanges();
      });

    //blog
    this.aiContentGenerationService.getBlogResponsetData().subscribe((data) => {
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
        .replace(/^```html/, '')
        .replace(/```$/, '');
      console.log('blog response data:', cleanedString);
      this.editorContentSocialMedia = cleanedString;
      this.editorContentSocialMedia = this.editorContentSocialMedia
        .replace(/"/g, '')
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
      this.chnge.detectChanges();

      this.chnge.detectChanges();
    });

    //fetch images url

    this.aiContentGenerationService.storeImage(this.imageUrl).subscribe(
      (response) => {
        console.log('Response banner:', response);
        this.imageUrlS3 = response.s3Url;
        console.log('bammer image:', this.imageUrlS3);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.aiContentGenerationService.storeImage(this.imageOfferUrl).subscribe(
      (response) => {
        console.log('Response offer:', response);
        this.imageOfferUrlS3 = response.s3Url;

        console.log('offer image:', this.imageOfferUrlS3);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.aiContentGenerationService.storeImage(this.imageEventUrl).subscribe(
      (response) => {
        console.log('Response event:', response);
        this.imageEventUrlS3 = response.s3Url;
        console.log('event image:', this.imageEventUrlS3);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    //fetch subject
    this.aiContentGenerationService
      .getEmailSubResponsetData()
      .subscribe((subject) => {
        this.selectedSubject = subject;
        console.log('selected get email sub :', this.selectedSubject);
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

  navigateToDashboard(): void {
    this.route.navigateByUrl('dashboard');
    this.chnge.detectChanges();
  }
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
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '400px';
    // this.dialog.open(SuccessDialogComponent, dialogConfig);
  }

  inputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }

  navigateToForm(): void {
    this.route.navigateByUrl('client-remark');

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

  publishContent1() {
    this.ispublisLoaderDisabled = true;
    var contentWithImages = this.contentWithImage.replace(/\n+/g, '').trim();
    contentWithImages?.replace(/\\n/g, '<br>');

    //html format content
    var subjectEmail = this.selectedSubject.replace(/"/g, '');
    console.log('email body client :', this.editorContentEmail);
    console.log('baner body :', this.emailHeader);
    console.log('subject mail :', subjectEmail);
    const emailhtmlUrl: string = `http://18.116.64.253:3434/send-email?to=masoomithakar@gmail.com,mthakar@deloitte.com,shrirangp@gmail.com,altitudebycba@gmail.com,mandeepsingh.1998@outlook.com&subject=${subjectEmail}`;
    const emailHtmlBody: string = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
      body {
          margin: 0;
          padding: 0;
          font-family: Arial, Helvetica, sans-serif;
      }
      table {
          border-spacing: 0;
          border-collapse: collapse;
          margin: 0 auto;
      }
      img {
          display: block;
          max-width: 100%;
          height: auto;
      }
  </style>
</head>
<body>
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 auto;">
      <tbody>
          <tr>
              <td valign="top" style="word-break: break-word; hyphens: none; border-collapse: collapse;">
                  <table width="640" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tbody>
                          <tr>
                              <td style="background-color: #fff;">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="margin: 0 auto; width: 600px;">
                                      <tbody>
                                          <tr>
                                              <td height="15" style="line-height: 1px; font-size: 1px;">&nbsp;</td>
                                          </tr>
                                          <tr>
                                              <td width="70" valign="top" align="center">
                                                  <div>
                                                      <img border="0" alt="Nike Logo" style="width: 65px; height: 65px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;" src="${this.brandlogoTop}">
                                                  </div>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                  <table width="640" align="center" id="boxing" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; min-width: 640px;">
                      <tbody>
                          <tr>
                              <td style="word-break: break-word; hyphens: none; border-collapse: collapse;">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                      <tbody>
                                          <tr>
                                              <td bgcolor="#ffff" style="background-color: #ffff;">
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 640px; margin: 0 auto; text-align: center; border-collapse: collapse;">
                                                      <tbody>
                                                          <tr>
                                                              <td align="center" style="font-size: 1px; line-height: 1px; height: 440px; width: 640px;">
                                                                  <div>
                                                                      <img border="0" alt="Banner Image" src="${this.imageUrlS3}" style="height: 440px; width: 640px;">
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td height="20" style="line-height: 1px; font-size: 1px;">&nbsp;</td>
                                                          </tr>
                                                        
                                                           <tr>
                                                              <td style="text-align:left;">
                                                                  <div style="padding: 15px; background-color: rgb(233 233 233 / 15%); font-family: 'Open Sans', sans-serif;"  [innerHTML]=${this.editorContentEmail}
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td>
                                                                  <div style="padding: 15px; background-color: #e9ecef; font-family: 'Open Sans', sans-serif;"  [innerHTML]=${this.emailHeader} 
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff; padding-top: 20px;">
                                                      <tbody>
                                                          <tr>
                                                              <td align="center" style="padding: 10px;">
                                                                  <a href="https://www.nike.com/in/t/air-max-dn-shoes-FtLNfm/DV3337-010" target="_blank" style="text-decoration: none;">
                                                                      <img alt="Product 1" width="300" src="${this.imageOfferUrlS3}">
                                                                  </a>
                                                              </td>
                                                              <td align="center" style="padding: 10px;">
                                                                  <a href="https://www.nike.com/in/t/al8-shoes-Xs723b/FJ3794-002" target="_blank" style="text-decoration: none;">
                                                                      <img alt="Product 2" width="300" src="${this.imageEventUrlS3}">
                                                                  </a>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
                                          <tr><table _ngcontent-ng-c3086008022="" id="Button" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="mktoModule" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; border-collapse: collapse;"><tbody _ngcontent-ng-c3086008022=""><tr _ngcontent-ng-c3086008022=""><td _ngcontent-ng-c3086008022="" bgcolor="#E9E9E9" style="background-color: #E9E9E9;"><table _ngcontent-ng-c3086008022="" align="center" border="0" cellpadding="0" cellspacing="0" width="600" class="inner_table" style="width: 600px; margin: 0 auto; text-align: center; border-collapse: collapse;"><tbody _ngcontent-ng-c3086008022=""><tr _ngcontent-ng-c3086008022=""><td _ngcontent-ng-c3086008022="" height="20" style="line-height: 1px; font-size: 1px;">&nbsp;</td></tr><tr _ngcontent-ng-c3086008022=""><td _ngcontent-ng-c3086008022="" valign="top"><div _ngcontent-ng-c3086008022="" id="banner-button1" class="mktoText"><table _ngcontent-ng-c3086008022="" width="auto" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tbody _ngcontent-ng-c3086008022=""><tr _ngcontent-ng-c3086008022=""><td _ngcontent-ng-c3086008022="" valign="middle" style="background-color: #000000; border: 1px solid #026160; border-radius: 20px; font-family: Arial,Helvetica,sans-serif; font-size: 16px; mso-line-height-rule: exactly; line-height: 22px; text-align: center; vertical-align: middle; color: #000000; display: block; padding: 9px 40px 8px;"><a _ngcontent-ng-c3086008022="" target="_blank" style="text-decoration: none; color: #000000 !important; outline: none;" href="https://www.${this.formData?.brand}.com/"><span _ngcontent-ng-c3086008022="" style="color: #FFF;">Know More</span></a></td></tr></tbody></table></div></td></tr><tr _ngcontent-ng-c3086008022=""><td _ngcontent-ng-c3086008022="" height="20" style="line-height: 1px; font-size: 1px;">&nbsp;</td></tr></tbody></table></td></tr></tbody></table></tr>
                                          <tr>
                                              <td style="background-color: #000000; color: #FFFFFF; text-align: center; font-size: 12px; padding: 20px;">
                                                  <p>© 2024. ${this.formData?.brand} All Right Reserved</p>
                                                  <a href="https://www.facebook.com/${this.formData?.brand}/" target="_blank">Facebook</a> |
                                                  <a href="https://x.com/${this.formData?.brand}" target="_blank">Twitter</a> |
                                                  <a href="https://www.instagram.com/${this.formData?.brand}/?hl=en" target="_blank">Instagram</a>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
      </tbody>
  </table>
  
</body>
</html>
`;

    this.aiContentGenerationService
      .sendHtmlEmail(emailhtmlUrl, emailHtmlBody)
      .subscribe({
        next: (response) => {
          console.log('Email sent successfully:', response);
          if (response) {
            this.ispublisLoaderDisabled = false;
            // const dialogRef = this.dialog.open(EmailConfirmationComponent, {
            //   width: '574px',
            //   height: '346px',
            // });
          }
        },
        error: (error) => {
          console.error('Error sending email:', error);
        },
      });
    this.navigateToSuccess();
  }

  async publishContent2() {
    this.ispublisLoaderDisabled = true;
    const link = this.formData?.Hashtags;

    this.aiContentGenerationService.postFacebook(
      this.imageUrl,
      this.editorContentSocialMedia,
      link
    );
    // const dialogRef = this.dialog.open(EmailConfirmationComponent2, {
    //   width: '574px',
    //   height: '346px',
    // });
    this.ispublisLoaderDisabled = false;
    console.log('successfully');
    this.navigateToSuccess();
  }

  async publishContent3() {
    this.ispublisLoaderDisabled = true;
    const timestamp = Date.now();

    const titleMatch =
      this.editorContentSocialMedia.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1] : ''; // Get the title if matched
    console.log('tilte of blog', title);

    // const body = this.editorContentSocialMedia.replace(/<h1>.*?<\/h1>/, '').trim();
    const body = this.blogContent;
    console.log('content of blog', body);

    if (this.imageUrl) {
      console.log('Blog created image url:', this.imageUrl);
      this.aiContentGenerationService
        .createPost1(title, body, this.imageUrl)
        .subscribe(
          (response) => {
            console.log('Blog Created link : ', response.link);
            this.aiContentGenerationService.setpublish(response.link);
            console.log('Blog created:', response);

            // const dialogRef = this.dialog.open(EmailConfirmationComponent1, {
            //   width: '574px',
            //   height: '346px',
            // });
          },
          (error) => {
            console.error('Error creating post:', error);
          }
        );
    } else {
      this.aiContentGenerationService.createPost2(title, body).subscribe(
        (response) => {
          console.log('Blog Created link : ', response.link);
          this.aiContentGenerationService.setpublish(response.link);
          console.log('Blog created:', response);
          // const dialogRef = this.dialog.open(EmailConfirmationComponent, {
          //   width: '574px',
          //   height: '346px',
          // });
        },
        (error) => {
          console.error('Error creating post:', error);
        }
      );
    }
    this.navigateToSuccess();
    this.ispublisLoaderDisabled = false;
    console.log('successfully');
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
  navigateToSuccess(): void {
    this.route
      .navigate(['/success-page'])
      .then(() => {
        console.log('Navigation to success page completed');
      })
      .catch((error) => {
        console.error('Navigation error:', error);
      });
  }
  onPanelClick(event: MouseEvent) {
    this.clickEvent = event;
    this.commentPanel.show(event);
  }
  positionPanel(event: any) {
    if (this.clickEvent) {
      this.panelStyle = {
        'left.px': this.clickEvent.clientX,
        'top.px': this.clickEvent.clientY,
      };
    }
  }
  saveComment() { }
}
