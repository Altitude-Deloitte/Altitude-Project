import {
  ChangeDetectorRef,
  Component,
  inject,
  ViewChild,
  effect,
} from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ButtonModule } from 'primeng/button';

import { TextareaModule } from 'primeng/textarea';

import {
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { EditorComponent } from '@tinymce/tinymce-angular';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-client-remark',
  imports: [
    HeaderComponent,
    ButtonModule,
    CommonModule,
    SelectModule,
    OverlayPanelModule,
    TextareaModule,
    FormsModule,
  ],
  templateUrl: './client-remark.component.html',
  styleUrl: './client-remark.component.css',
})
export class ClientRemarkComponent {
  commentBox = '';
  loading = true;
  brandlogo: string | undefined;
  brandlogoTop: any;
  brandLinks: any[] = [];
  imageContainerHeight = '440px';
  imageContainerWidth = '640px';
  imageHeight = '440px';
  imageWidth = '640px';
  editorContentEmail: any;
  editorContentSocialMedia: any;
  editorContentBlog: any;
  isToastVisible = false;
  totalWordCount: any;
  currentDate: any = new Date();
  currentsDate: any = this.currentDate.toISOString().split('T')[0];
  ispublisLoaderDisabled = false;
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

  @ViewChild(EditorComponent) editorComponent!: EditorComponent;
  editorContent: string = 'Hi , this is desc';
  public tinymceConfig: any = {
    plugins: 'wordcount',
    toolbar: 'undo redo | bold italic | alignleft alignright | wordcount',
  };
  selectedSubject: string = '';
  emailSubject: string = '';
  emailSalutation: string = '';
  emailBody: string = '';
  emailClosingMark: string = '';
  AiContentResponse: any;
  emailPrompt: any;
  blogPrompt: any;
  commonPrompt: any;
  isLoading = false;
  socialMediaPrompt: any;
  isBlogPromptDisabled = false;
  isSocialMediaPromptDisabled = false;
  isEMailPromptDisabled = false;
  commonPromptIsLoading = false;
  theme: any;
  brandColor: any[] = [];
  darkHexCode: any;
  tableHTML: string = '';
  lightHexCode: any;
  title = 'AI-FACTORY';
  taskForm!: FormGroup;
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
  imageUrlS3: any;
  imageOfferUrlS3: any;
  imageEventUrlS3: any;
  contentWithImage: any;
  subjctEmail: any;
  emailHeader: any;
  showMore: string | undefined;
  brandLogoUrlS3: any;
  brand: any;
  route = inject(Router);
  @ViewChild('commentPanel') commentPanel!: OverlayPanel;
  commentText: string = '';
  panelStyle: any = {};
  clickEvent?: MouseEvent;
  constructor(
    private aiContentGenerationService: ContentGenerationService,

    private chnge: ChangeDetectorRef
  ) {
    // Watch for chat response from AI chat
    effect(() => {
      const chatResponse = this.aiContentGenerationService.chatResponse();
      if (chatResponse?.result?.generation) {
        this.processChatResponse(chatResponse.result.generation);
      }
    });
  }

  formData: any;
  ngOnInit(): void {
    this.loading = true;
    this.editorContentEmail = [];
    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
      console.log('datadatadatadatadatadatadatadatadatadatadatadata', data);
    });

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
    this.showMore = 'https://www.' + brandName + '/';

    // Set brandlogoTop using normalized brandName
    this.brandlogoTop = brandName !== 'babycheramy.lk'
      ? 'https://img.logo.dev/' + brandName + '?token=pk_SYZfwlzCQgO7up6SrPOrlw'
      : 'https://www.babycheramy.lk/images/logo.webp';

    console.log('Brand logo URL:', this.brandlogoTop);
    console.log('Show more URL:', this.showMore);

    // Subscribe to shared email content from review screen (if coming from chat)
    this.aiContentGenerationService.getEmailContent().subscribe((emailData) => {
      if (emailData) {
        console.log('Received shared email content:', emailData);

        // Use shared data if available (from chat flow)
        if (emailData.imageUrl) {
          this.imageUrl = emailData.imageUrl;
        }
        if (emailData.editorContentEmail) {
          this.editorContentEmail = emailData.editorContentEmail;
        }
        if (emailData.emailHeader) {
          this.emailHeader = emailData.emailHeader;
        }
        if (emailData.subjctEmail) {
          this.subjctEmail = emailData.subjctEmail;
        }
        if (emailData.selectedSubject) {
          this.emailSubject = emailData.selectedSubject;
        }
        if (emailData.totalWordCount) {
          this.totalWordCount = emailData.totalWordCount;
        }

        // Update contentWithImage if we have the data
        if (this.imageUrl && this.editorContentEmail && this.subjctEmail) {
          this.contentWithImage = `
    <div  style="padding:40px;">
    <div><b>${this.subjctEmail}</b></div>
    <div style="text-align: center; padding:40px;">
      <img class="size-image" alt="" src="${this.imageUrl}" />
    </div><br/>
    <div>${this.editorContentEmail}</div>
    </div>
  `;
        }

        this.loading = false;
      }
    });

    //heading

    this.aiContentGenerationService
      .getEmailHeadResponsetData()
      .subscribe((data) => {
        this.emailSubject = data.result.generation.email_subjects[0]?.replace(/\n/g, '');
        this.emailHeader = data.result.generation.email_header;
        const emailContent =
          typeof data.result.generation.html === 'string'
            ? data.result.generation.html
            : JSON.parse(data.result.generation.html);

        this.editorContentEmail = emailContent.replace(/\\n\\n/g, '<br>');
        this.imageUrl = data.result.generation.image_url;
        this.subjctEmail = data.result.generation.email_subjects[0]?.replace(/\n/g, '');
        this.contentWithImage = `
    <div  style="padding:40px;">
    <div><b>${this.subjctEmail}</b></div>
    <div style="text-align: center; padding:40px;">
      <img class="size-image" alt="" src="${data.result.generation.image_url}" />
    </div><br/>
    <div>${this.editorContentEmail}</div>
    </div>
  `;
      });

    //fetch subject
    this.aiContentGenerationService
      .getEmailSubResponsetData()
      .subscribe((subject) => {
        this.selectedSubject = subject;
        console.log('selected get email sub :', this.selectedSubject);
      });

    this.ispublisLoaderDisabled = false;

    // brandName and brandlogoTop already set above - no need to redeclare

    //brand logo and links
    this.aiContentGenerationService
      .getBrandData(this.formData?.brand)
      .subscribe({
        next: (response) => {
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

    this.aiContentGenerationService
      .getEmailResponsetData()
      .subscribe((data) => {

        if (data.result.generation.html) {
          // Determine if the content is a string or JSON and parse accordingly
          const emailContent =
            typeof data.result.generation.html === 'string'
              ? data.result.generation.html
              : JSON.parse(data.result.generation.html);

          this.editorContentEmail = emailContent.replace(/\\n\\n/g, '<br>');

          this.contentWithImage = `
    <div  style="padding:40px;">
    <div><b>${this.selectedSubject}</b></div>
    <div style="text-align: center; padding:40px;">
      <img class="size-image" alt="" src="${this.imageUrl}" />
    </div><br/>
    <div>${this.editorContentEmail}</div>
    </div>
  `;

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

          console.log('Total word count:', this.totalWordCount);
          this.chnge.detectChanges();
        }
      });

    this.aiContentGenerationService
      .getSocialResponsetData()
      .subscribe((data) => {

        this.isSocialMediaPromptDisabled = false;
        this.editorContentSocialMedia = data?.content;
        this.chnge.detectChanges();
      });
    this.chnge.detectChanges();

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
    //logo
    this.aiContentGenerationService.storeImage(this.brandlogoTop).subscribe(
      (response) => {
        console.log('Response brand logo:', response);
        this.brandLogoUrlS3 = response.s3Url;
        console.log('brand logo image:', this.imageEventUrlS3);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  fetchHexCodeByType(type: string) {
    const filteredColor = this.brandColor.find((color) => color.type === type);
    return filteredColor ? filteredColor.hex : null; // Return null if not found
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

  inputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }

  navigateToForm(): void {
    this.route.navigateByUrl('client-remark');
    this.chnge.detectChanges();
  }

  aiContentGeneration(prompt: string, type: string): void {
    if (type === 'blog') {
      this.isBlogPromptDisabled = true;
      prompt = `$previos response ${this.editorContentBlog}, Refine blog ${prompt}`;
    } else if (type === 'regenerate') {
      this.isEMailPromptDisabled = true;
      prompt = `Consider you are a Content Email Marketing Specialist. Create a marketing mail content based on topic "${this.formData?.topic}". Some more details to be consider for generating email body is  "${this.formData?.purpose}". The mail content is to be generated by considering campaign type as "${this.formData?.campaign}" and the intended target audience for the mail is"${this.formData?.Type}".Consider the blog to have a Word Limit of "${this.formData?.wordLimit}". target reader "${this.formData?.readers}" Structure the email such that it can be displayed in an Angular application with Subject as Bold, Salutation as Italics, Email Body in next paragraph and Closing Remarks in a separate line. Also can you provide the output in a json object which has four attributes - Subject, Salutation, Body and Closing Remarks.`;
    } else if (type === 'social_media') {
      this.isSocialMediaPromptDisabled = true;
      prompt = `$previos response ${this.editorContentSocialMedia}, Refine social_media ${prompt}`;
    } else if (type === 'common_prompt') {
      this.commonPromptIsLoading = true;
      prompt = `Consider you are a Content Email Marketing Specialist. Create a marketing mail content based on topic "${prompt}".Structure the email such that it can be displayed in an Angular application with Subject as Bold, Salutation as Italics, Email Body in next paragraph and Closing Remarks in a separate line. Also can you provide the output in a json object which has four attributes - Subject, Salutation, Body and Closing Remarks.`;
    }

    this.aiContentGenerationService
      .generateContent(prompt)
      .subscribe({
        next: (data) => {
          if (type === 'blog') {
            this.aiContentGenerationService.setBlogResponseData(data);
            this.chnge.detectChanges();
          } else if (type === 'regenerate') {
            this.aiContentGenerationService.setEmailResponseData(data);
          } else if (type === 'social_media') {
            this.aiContentGenerationService.setSocialResponseData(data);
          } else if (type === 'common_prompt') {
            this.aiContentGenerationService.setEmailResponseData(data);
          }
          console.log(`Response from API for ${type}:`, data);
        },
        error: (error) => {
          console.error(`Error occurred for ${type}:`, error);
        },
      });
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

  publishContent() {
    this.ispublisLoaderDisabled = true;
    var contentWithImages = this.contentWithImage.replace(/\n+/g, '').trim();
    contentWithImages?.replace(/\\n/g, '<br>');

    /* this.aiContentGenerationService     
      .publishContent(contentWithImages, '2093', 'FreeTextContent')
      .subscribe({
        next: (data) => {
          this.ispublisLoaderDisabled = false;
          if (data) {
            const dialogRef = this.dialog.open(EmailConfirmationComponent, {
              width: '574px',
              height: '346px',
            });
          }
          console.log('publishContentpublishContent', data);
        },
        error: (error) => {
          console.error(`Error occurred for publishContent:`, error);
        },
      });*/

    //html format content
    var subjectEmail = this.selectedSubject.replace(/"/g, '');
    console.log('email body client :', this.editorContentEmail);
    console.log('baner body :', this.emailHeader);
    console.log('subject mail :', subjectEmail);

    const newEmail = `<html lang="en">
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
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; margin: 0 auto; border-collapse: collapse;">
        <tbody>
            <!-- Header Section -->
            <tr>
                <td width="70" valign="top" align="center">
                    <div style="padding: 15px; background-color: #f8f8f8;">
                        <img border="0" alt="Brand Logo" style="width: 65px; height: 65px; object-fit: cover; margin-bottom: 15px;" src="${this.brandlogoTop}">
                    </div>
                </td>
            </tr>
            <tr>
                <td style="background:black; padding: 30px 20px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 28px; font-family: Arial, sans-serif;line-height: 1.2;">
                        <span style="font-weight: bold;">${this.emailHeader || ''}</span>
                    </h1>
                </td>
            </tr>
            
            ${(this.imageUrl || this.imageOfferUrl) ? `
            <tr>
                <td style="text-align: center; background-color: #ffffff;">
                    <img src="${this.imageUrl ? this.imageUrl : this.imageOfferUrl}" alt="banner" style="max-width: 100%; height: auto;" />
                </td>
            </tr>
            ` : ''}

            <!-- Content Section -->
            <tr>
                <td style="background-color: #ffffff; padding: 30px 20px;">
                    <div style="padding: 15px; color:#333333; font-family: 'Open Sans', sans-serif;">${this.editorContentEmail || ''}</div>
                </td>
            </tr>

            <!-- Call to Action Section -->
            <tr>
                <td style="background-color: #f8f8f8; padding: 30px 20px; text-align: center;">
                    <a href="${this.showMore}" target="_blank" style="display: inline-block; padding: 12px 30px; background: black; color: #ffffff; text-decoration: none; font-family: Arial, sans-serif; font-weight: bold; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">
                        Know More
                    </a>
                </td>
            </tr>

            <!-- Footer Section -->
            <tr>
                <td style="background-color: #333333; padding: 30px 20px; text-align: center; color: #ffffff;">
                    <p style="margin: 0 0 15px 0; font-family: Arial, sans-serif; font-size: 14px;">
                        www.${this.formData?.brand} | INFO${'@' + this.formData?.brand}
                    </p>
                    <p style="margin: 0 0 15px 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #cccccc;">
                        As a valued subscriber, we greatly appreciate your time. Thank you for your continued attention to our company news. You may unsubscribe from our email updates at any time.
                    </p>
                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #999999;">
                        Copyright © 2025 ${this.formData?.brand} All Rights Reserved.
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`;
    const emailhtmlUrl: string = `
http://18.116.64.253:3434/send-email?to=masoomithakar@gmail.com,mthakar@deloitte.com,achintyadhingra00@gmail.com,shrirangp@gmail.com,mandeepsingh.1998@outlook.com&subject=${subjectEmail}`;

    this.aiContentGenerationService
      .sendHtmlEmail(emailhtmlUrl, newEmail)
      .subscribe({
        next: (response) => {
          console.log(this.emailHeader);
          console.log(newEmail);
          console.log('Email sent successfully:', response);
        },
        error: (error) => {
          this.ispublisLoaderDisabled = false;
          this.navigateToSuccess();
        },
        complete: () => {
          this.navigateToSuccess();
        },
      });
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

  navigateBack(): void {
    this.aiContentGenerationService.setIsBack(true);
    this.route.navigateByUrl('/email-review');
  }

  // Process chat response data
  processChatResponse(generationData: any) {
    console.log('Processing chat response in client:', generationData);

    // Update component data based on chat response
    if (generationData.email_header) {
      this.emailHeader = generationData.email_header;
    }

    if (generationData.image_url) {
      this.imageUrl = generationData.image_url;
    }

    if (generationData.email_subjects) {
      this.subjctEmail = generationData.email_subjects;
    }

    if (generationData.html) {
      let emailContent = typeof generationData.html === 'string'
        ? generationData.html
        : JSON.parse(generationData.html);

      emailContent = emailContent.replace(/"/g, '').trim();
      this.editorContentEmail = emailContent.replace(/\\n\\n/g, '');

      // Calculate word count
      const countWords = (emailContent: any) => {
        if (!emailContent) return 0;
        return emailContent?.trim().replace(/\s+/g, ' ').split(' ').length;
      };

      this.totalWordCount = countWords(this.editorContentEmail);
    }

    // Update contentWithImage if we have all the data
    if (this.imageUrl && this.editorContentEmail && this.subjctEmail) {
      this.contentWithImage = `
    <div  style="padding:40px;">
    <div><b>${this.subjctEmail}</b></div>
    <div style="text-align: center; padding:40px;">
      <img class="size-image" alt="" src="${this.imageUrl}" />
    </div><br/>
    <div>${this.editorContentEmail}</div>
    </div>
  `;
    }

    // Set loading states
    this.loading = false;

    // Clear chat response after processing
    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 1000);
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
