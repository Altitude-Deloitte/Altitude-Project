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
  ],
  templateUrl: './combined-review.component.html',
  styleUrl: './combined-review.component.css',
})
export class CombinedReviewComponent {
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
  brandlogoTop: string | undefined;
  title = 'AI-FACTORY';
  taskForm!: FormGroup;
  blogContent: any;
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
    this.brand = this.formData?.brand?.replace('.com', ' ');
    let brandName = this.formData?.brand?.trim();
    brandName = brandName.replace(/\s+/g, '');
    this.showMore = 'https://www.' + brandName + '.com/';

    //heading
    this.contentDisabled = true;
    this.aiContentGenerationService
      .getEmailHeadResponsetData()
      .subscribe((data) => {
        console.log('get headering for email ', data);

        let emailContent =
          typeof data.content === 'string'
            ? data.content
            : JSON.parse(data.content);
        console.log('get header email heading content', emailContent);
        this.emailHeader = emailContent;
        console.log('get email header', this.emailHeader);
      });

    this.contentDisabled = true;
    this.aiContentGenerationService
      .getEmailResponsetData()
      .subscribe((data) => {
        if (data?.content) {
          // Determine if the content is a string or JSON and parse accordingly
          let emailContent =
            typeof data.content === 'string'
              ? data.content
              : JSON.parse(data.content);
          emailContent = emailContent.replace(/"/g, '').trim();
          this.editorContentEmail = emailContent.replace(/\\n\\n/g, '');
          console.log('email para : ', this.editorContentEmail);
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
    this.aiContentGenerationService
      .getSocialResponsetData()
      .subscribe((data) => {
        console.log('social media response:', data?.content);
        this.editorContentSocialMedia1 = data?.content;
        this.editorContentSocialMedia1 = this.editorContentSocialMedia1
          .replace(/"/g, '')
          .trim();
        //refine content
        this.characterCount = this.editorContentSocialMedia1.length;
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

        this.chnge.detectChanges();
      });
    this.aiContentGenerationService
      .getSocialResponsetData1()
      .subscribe((data) => {
        this.editorContentSocialMedia2 = data?.content;
        this.editorContentSocialMedia2 = this.editorContentSocialMedia2
          .replace(/"/g, '')
          .trim();
        //refine content
        this.characterCount = this.editorContentSocialMedia1.length;
        this.existingContent = this.editorContentSocialMedia2;
        this.contentDisabled = false;
        // Function to count words in a string
        const countWords = (emailContent: any) => {
          if (!emailContent) return 0;
          // Normalize spaces and split by space to get words
          return emailContent?.trim().replace(/\s+/g, ' ').split(' ').length;
        };
        // Count words in different parts of the email content
        this.totalWordCount = countWords(this.editorContentSocialMedia2);

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

        this.chnge.detectChanges();
      });

    //blog
    this.aiContentGenerationService.getBlogResponsetData().subscribe((data) => {
      this.editorContentSocialMedia = data?.content;
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
}
