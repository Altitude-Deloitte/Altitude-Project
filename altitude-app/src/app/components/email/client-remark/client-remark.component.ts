import {
  ChangeDetectorRef,
  Component,
  inject,
  ViewChild,
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
    RouterLink,
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
  ) {}

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

    let brandNames = this.formData?.brand?.trim();
    brandNames = brandNames?.replace(/\s+/g, '');
    this.showMore = 'https://www.' + brandNames + '/';

    //heading

    this.aiContentGenerationService
      .getEmailHeadResponsetData()
      .subscribe((data) => {
        this.emailSubject =  data.result.generation.email_subjects[0]?.replace(/\n/g, '');  
        this.emailHeader = data.result.generation.email_header;
       const emailContent =
            typeof  data.result.generation.html === 'string'
              ? data.result.generation.html
              : JSON.parse(data.result.generation.html);

          this.editorContentEmail = emailContent.replace(/\\n\\n/g, '<br>');
        this.imageUrl = data.result.generation.image_url;
        this.subjctEmail =  data.result.generation.email_subjects[0]?.replace(/\n/g, '');
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

    let brandName = this.formData?.brand?.trim();
    this.brand = this.formData?.brand.replace('.com', ' ');
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
          
        if ( data.result.generation.html) {
          // Determine if the content is a string or JSON and parse accordingly
          const emailContent =
            typeof  data.result.generation.html === 'string'
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

    const emailhtmlUrl: string = `http://18.116.64.253:3434/send-email?to=masoomithakar@gmail.com,mthakar@deloitte.com,shrirangp@gmail.com,mandeepsingh.1998@outlook.com&subject=${this.emailSubject}`;
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
                                            <tr><table _ngcontent-ng-c3086008022="" id="Button" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="mktoModule" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; border-collapse: collapse;"><tbody _ngcontent-ng-c3086008022=""><tr _ngcontent-ng-c3086008022=""><td _ngcontent-ng-c3086008022="" bgcolor="#E9E9E9" style="background-color: #E9E9E9;"><table _ngcontent-ng-c3086008022="" align="center" border="0" cellpadding="0" cellspacing="0" width="600" class="inner_table" style="width: 600px; margin: 0 auto; text-align: center; border-collapse: collapse;"><tbody _ngcontent-ng-c3086008022=""><tr _ngcontent-ng-c3086008022=""><td _ngcontent-ng-c3086008022="" height="20" style="line-height: 1px; font-size: 1px;">&nbsp;</td></tr><tr _ngcontent-ng-c3086008022=""><td _ngcontent-ng-c3086008022="" valign="top"><div _ngcontent-ng-c3086008022="" id="banner-button1" class="mktoText"><table _ngcontent-ng-c3086008022="" width="auto" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tbody _ngcontent-ng-c3086008022=""><tr _ngcontent-ng-c3086008022=""><td _ngcontent-ng-c3086008022="" valign="middle" style="background-color: #000000; border: 1px solid #026160; border-radius: 20px; font-family: Arial,Helvetica,sans-serif; font-size: 16px; mso-line-height-rule: exactly; line-height: 22px; text-align: center; vertical-align: middle; color: #000000; display: block; padding: 9px 40px 8px;"><a _ngcontent-ng-c3086008022="" target="_blank" style="text-decoration: none; color: #000000 !important; outline: none;" href="https://www.${this.formData?.brand}/"><span _ngcontent-ng-c3086008022="" style="color: #FFF;">Know More</span></a></td></tr></tbody></table></div></td></tr><tr _ngcontent-ng-c3086008022=""><td _ngcontent-ng-c3086008022="" height="20" style="line-height: 1px; font-size: 1px;">&nbsp;</td></tr></tbody></table></td></tr></tbody></table></tr>
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
          this.ispublisLoaderDisabled = false;
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
  saveComment() {}
  
}
