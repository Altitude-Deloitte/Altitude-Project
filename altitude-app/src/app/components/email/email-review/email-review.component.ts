import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';

import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { FormGroup, FormsModule } from '@angular/forms';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { Router, RouterLink } from '@angular/router';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { CommonModule } from '@angular/common';
import { SelectionStore } from '../../../store/campaign.store';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-email-review',
  imports: [
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
  templateUrl: './email-review.component.html',
  styleUrl: './email-review.component.css',
})
export class EmailReviewComponent {
  typographyOptions = [
    { label: 'Inter', value: 'Inter' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Montserrat', value: 'Montserrat' },
  ];
  fontSizeOptions = [
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
  ];
  selectedTypography = 'Inter';
  selectedFontSize = '16px';
  clientScreen = input();
  subjctsEmail: string[] = [];
  selectedSubject: string = '';
  imageContainerHeight = '440px';
  imageContainerWidth = '640px';
  imageHeight = '440px';
  imageWidth = '640px';
  loading = true;
  editorContentEmail: any;
  editorContentSocialMedia: any;
  existingEmailContent: any;
  editorContentBlog: any;
  isToastVisible = false;
  totalWordCount: any;
  posts: any[] = [];
  video: any = null;
  errorMessage: string | null = null;
  brand: any;
  showComments = false;

  commentsList = [
    {
      name: 'Max Lebedev',
      avatar: 'assets/images/profile.png', // Use your avatar path
      time: '21m ago',
      text: 'Need changes in template design also need to rework on the colours part of the email campaign.',
    },
    {
      name: 'Max Lebedev',
      avatar: 'assets/images/profile.png', // Use your avatar path
      time: '21m ago',
      text: 'Need changes in template design also need to rework on the colours part of the email campaign.',
    },
    {
      name: 'Max Lebedev',
      avatar: 'assets/images/profile.png', // Use your avatar path
      time: '21m ago',
      text: 'Need changes in template design also need to rework on the colours part of the email campaign.',
    },
  ];

  plagiarismCount: string | undefined;
  plagrismCheck: any;

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
  brandlogoTop: string | undefined;
  title = 'AI-FACTORY';
  taskForm!: FormGroup;
  store = inject(SelectionStore);
  selection: any;
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
  formData: any;
  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService // private dialog: MatDialog,
  ) { }
  ngOnInit() {
    this.imageUrl = null;
    this.loading = true;
    this.editorContentEmail = [];
    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
      console.log('datadatadatadatadatadatadatadatadatadatadatadata', data);
    });

    console.log(this.brand);
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
    console.log('brand', this.brand);
    let brandName = this.formData?.brand?.trim();
    brandName = brandName?.replace(/\s+/g, '');
    this.showMore = 'https://www.' + brandName;

    //heading
    this.contentDisabled = true;
    this.aiContentGenerationService
      .getEmailHeadResponsetData()
      .subscribe((data) => {
        console.log('get headering for email ', data);
        this.contentDisabled = false;
        this.loading = false;
        let emailContent =
          typeof data.result.generation.content === 'string'
            ? data.result.generation.content
            : JSON.parse(data.result.generation.content);
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
          this.contentDisabled = false;
          let emailContent =
            typeof data.result.generation.content === 'string'
              ? data.result.generation.content
              : JSON.parse(data.result.generation.content);
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
          // this.chnge.detectChanges();
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
          console.log('logo:', this.brandlogoTop);
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

    /* this.aiContentGenerationService.getLatestPosts()
    .subscribe(
      posts => {
        this.posts = this.aiContentGenerationService.filterPosts(posts);
      },
      error => (this.errorMessage = error.message)
);*/

    /* this.aiContentGenerationService.getBlogResponsetData().subscribe((data) => {
    // Extract content from the response
    this.editorContentBlog = data?.content;
    // Format the content
    if (this.editorContentBlog) {
      this.isBlogPromptDisabled = false;
      const updatedContent = this.editorContentBlog?.replace(/<\/?p>/g, '');
      const parts = updatedContent.split(':');

      let formattedContent: string;

      if (parts.length > 2) {
        const title = parts[0].trim();
        const heading = parts[1].trim();
        const body = parts.slice(2).join(':').trim();
        formattedContent = `<strong>${title}:</strong> ${heading}<p>${body}</p>`;
      } else {
        formattedContent = `<p>${this.editorContentBlog}</p>`;
      }
      this.editorContentBlog = formattedContent;
    }

    this.chnge.detectChanges();
  });
*/

    this.aiContentGenerationService
      .getSocialResponsetData()
      .subscribe((data) => {
        this.isSocialMediaPromptDisabled = false;
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

        if (this.subjctEmail?.length > 0) {
          this.selectedSubject = this.subjctEmail[0]?.replace(/\n/g, '');
          console.log('fetch subject:', this.selectedSubject);
          const replaceSub = this.selectedSubject?.replace(/\n/g, '');
          this.onSubjectChange(replaceSub);
        }
        // this.chnge.detectChanges();
      });
    // this.chnge.detectChanges();
    //fetch images
    //this.fetchMedia(this.formData?.brand);
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
    this.route.navigateByUrl('client-remark');

    // this.chnge.detectChanges();
  }

  navigateToSave(): void {
    // const dialogRef = this.dialog.open(ReviewDialogComponent, {
    //   width: '574px',
    //   height: '346px',
    // });
  }

  aiContentGeneration(prompt: string, type: string): void {
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
      prompt = `This is my existing mail "${this.existingEmailContent}" in that don't change whole content from my existing mail, just add the new fact / content without removing existing mail content based on user input and this is the prompt which user want to add in existing mail " ${prompt} ". and this to modify in existing email body and not modify or rephrase whole mail body with all sentences closed properly. Structure the email for Angular application. So, email should be created with html tags so it's easy to display except <html> and <code> tag or * or unwanted symbols not on this body. On this email parts which are , first section of Salutation as inside <p> tag then <br/> or next line two time then, second section of Email Body as inside <p> tags and new lines based on the body content then <br/> tag, third section of Closing Remarks in <p>  tag and  no space / or new line in between closing remarks . whole mail content should start from Salutation and end with Closing Remarks don't show other context other then the email
The html tags are separate and it should not be part of word count.`;
    } else if (type === 'Translate') {
      this.translateIsLoading = true;
      prompt = `Create a mail content based on topic ${this.formData?.topic}" . the intended tone of the mail is "${this.formData?.Type}". Some more details to be consider for generating email body is  "${this.formData?.purpose}".The target reader is "${this.formData?.readers} but, don't include in Salutation", the content should be equal  "${this.formData?.wordLimit}" words. Structure the email such that it can be displayed in an Angular application with html tags except <html> or <code> on this email parts which are Subject as Bold and it whole subject and its content inside into <p> tag , Salutation as Italics in next paragraph, Email Body in next paragraph , and Regards in next paragraphe. whole mail content should start from subject.`;
    }

    this.aiContentGenerationService
      .generateContent(prompt, 'emailer')
      .subscribe({
        next: (data) => {
          if (type === 'blog') {
            this.aiContentGenerationService.setBlogResponseData(data);
            // this.chnge.detectChanges();
          } else if (type === 'regenerate') {
            this.aiContentGenerationService.setEmailResponseData(data);
          } else if (type === 'social_media') {
            this.aiContentGenerationService.setSocialResponseData(data);
          } else if (type === 'common_prompt') {
            this.aiContentGenerationService.setEmailResponseData(data);
          } else if (type === 'Translate') {
            this.aiContentGenerationService.setEmailResponseData(data);
          }
          console.log(`Response from API for ${type}:`, data);
          // this.chnge.detectChanges();
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

  // async plagrismContent() {
  //   this.aiContentGenerationService
  //     .checkPlagiarism(this.editorContentEmail)
  //     .subscribe(
  //       (result) => {
  //         this.plagiarismCount = result;
  //         const regex = /<title>(.*?)<\/title>/i;
  //         const match = this.plagiarismCount.match(regex);

  //         // If a match is found, return the content inside the <title> tag, otherwise return a default message
  //         if (match && match[1]) {
  //           this.plagiarismCount = match[1].trim();
  //         } else {
  //           this.plagiarismCount = '0'; // Default if no title tag is found
  //         }

  //         this.aiContentGenerationService.setplagrism(this.plagiarismCount);
  //         console.log('Plagris value :', this.plagiarismCount);
  //       },
  //       (error) => {
  //         console.error('Error checking plagiarism', error);
  //       }
  //     );

  //   this.aiContentGenerationService.getplagrism().subscribe((data) => {
  //     this.plagrismCheck = data; // Use the data received from the service
  //     console.log('plagrism data received:', this.plagrismCheck);
  //   });

  //   const dialogRef = this.dialog.open(PlagrismComponent, {
  //     width: '494px',
  //     height: '280px',
  //   });
  // }
  onTypographyChange(event: any) {
    this.selectedTypography = event.value;
    this.applyChanges();
  }

  onFontSizeChange(event: any) {
    this.selectedFontSize = event.value;
    this.applyChanges();
  }

  applyChanges() {
    const body = document.body;
    body.style.fontFamily = this.selectedTypography;
    body.style.fontSize = this.selectedFontSize;
  }
}
