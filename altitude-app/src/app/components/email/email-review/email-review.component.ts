import {
  Component,
  ElementRef,
  inject,
  input,
  ViewChild,
  effect,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { FormGroup, FormsModule } from '@angular/forms';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { Router, RouterLink } from '@angular/router';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { CommonModule, KeyValue } from '@angular/common';
import { SelectionStore } from '../../../store/campaign.store';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { SocketConnectionService } from '../../../services/socket-connection.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogSuccessComponent } from '../../dialog-success/dialog-success.component';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoaderComponent } from '../../../shared/loader/loader.component';
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
    ProgressSpinnerModule,
    DrawerModule,
    ToastModule,
    LoaderComponent,
  ],
  providers: [MessageService],
  templateUrl: './email-review.component.html',
  styleUrl: './email-review.component.css',
})
export class EmailReviewComponent implements OnDestroy {
  // Subscriptions
  private emailContentSubscription?: Subscription;
  private socialContentSubscription?: Subscription;

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
  loading = true; // Start as true to show loader immediately on navigation, service will update this value
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
  showAgenticWorkflow = false;

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
  socketData: any;
  socketMessage: any = [];
  currentDate: any = new Date();
  currentsDate: any = this.currentDate.toISOString().split('T')[0];

  // Regeneration fields
  contentFeedback: string = '';
  imageFeedback: string = '';
  isRegeneratingContent: boolean = false;
  isRegeneratingImage: boolean = false;
  emailPayload: FormData | null = null;
  clientBack = false;

  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService,
    public socketConnection: SocketConnectionService,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {
    // Watch for chat response from AI chat
    effect(() => {
      const chatResponse = this.aiContentGenerationService.chatResponse();
      if (chatResponse?.result?.generation) {
        this.processChatResponse(chatResponse.result.generation);
      }
    });

    // Watch for socket completion using workflow-aware computed signal
    effect(() => {
      const allCompleted = this.socketConnection.allAgentsCompleted();
      const expected = this.socketConnection.expectedAgentCount();
      const received = this.socketConnection.receivedAgentCount();
      const completed = this.socketConnection.completedAgentCount();

      // Only hide loading when all expected agents are completed
      if (allCompleted && this.loading) {
        console.log(`✅ All ${expected} agents completed (${completed}/${received})`);
        setTimeout(() => {
          this.loading = false;
          this.aiContentGenerationService.setEmailReviewLoading(false);
          this.socketConnection.disconnect();
        }, 500);
      }
    });
  }

  private sessionId: string = ''; // Unique session ID for this component instance

  ngOnInit() {
    // Set workflow type for proper agent count tracking
    this.socketConnection.setWorkflowType('email');

    console.log('ngOnInit - Initial loading state:', this.loading);

    // Subscribe to loading state from service (set by form component)
    this.aiContentGenerationService.getEmailReviewLoading().subscribe(isLoading => {
      this.loading = isLoading;
      console.log('📊 Email review loading state updated from service:', isLoading);
    });

    // Check if user is returning from client screen

    this.aiContentGenerationService.getIsBack().subscribe(isBack => {
      this.clientBack = isBack;
      if (isBack) {
        console.log('🔄 Returning from client - loading saved data instantly');
        this.loading = false;

        // Reset isBack flag immediately
        // this.aiContentGenerationService.setIsBack(false);

        // Load saved review data instantly (no waiting for getData)
        this.aiContentGenerationService.getSavedEmailReviewData().subscribe(savedData => {
          if (savedData) {
            console.log('📥 Restoring saved email review data:', savedData);
            this.emailHeader = savedData.emailHeader;
            this.imageUrl = savedData.imageUrl;
            this.subjctEmail = savedData.subjctEmail;
            this.editorContentEmail = savedData.editorContentEmail;
            this.existingEmailContent = savedData.existingEmailContent;
            this.totalWordCount = savedData.totalWordCount;
            this.formData = savedData.formData;
            this.brand = savedData.brand;
            this.showMore = savedData.showMore;
            this.brandlogoTop = savedData.brandlogoTop;
            this.imageOfferUrl = savedData.imageOfferUrl;
            this.imageEventUrl = savedData.imageEventUrl;
            this.contentDisabled = false;
            this.isEMailPromptDisabled = false;
            this.isImageRegenrateDisabled = false;
            this.isImageRefineDisabled = false;

            // Initialize payload with saved form data
            this.initializeEmailPayload();

            // Force change detection to show content

            this.contentDisabled = false;

          }
        }).unsubscribe();

        return; // Exit early, don't run rest of ngOnInit
      }
    }).unsubscribe();

    // NEW GENERATION - Only executed when coming from form
    console.log('🆕 Starting NEW generation from form');

    // Clear socket data before starting new generation - NO, already cleared in form component!
    // this.socketConnection.clearAgentData(); // Don't call here - already called in form before API

    // Set loading for new generation

    // Get form data from service
    this.aiContentGenerationService.getData().subscribe((data) => {

      this.formData = data;
      // Add session_id to formData for API calls
      // this.formData.session_id = this.sessionId;

      if (this.clientBack) {
        console.log('🔄 Returning from client - loading saved data instantly');
        this.loading = false;
      } else {
        this.loading = true;

      }

      console.log("form data", this.formData);

      // Initialize email payload from form data
      this.initializeEmailPayload();
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

    console.log('Brand logo URL:', this.brandlogoTop);
    console.log('Show more URL:', this.showMore);

    //event image
    this.aiContentGenerationService.getOfferImage().subscribe((data) => {
      if (data) {
        this.imageOfferUrl = data;
      }
    });

    //offer image
    this.aiContentGenerationService.getEventImage().subscribe((data) => {
      if (data) {
        this.imageEventUrl = data;
      }
    });

    // Subscribe to email head response data (new generation and regeneration)
    this.contentDisabled = true;
    this.isLoading = true;
    this.aiContentGenerationService
      .getEmailHeadResponsetData()
      .subscribe((data) => {
        if (data && data.result && data.result.generation) {

          this.contentDisabled = false;
          this.emailHeader = data.result.generation.email_header;
          this.imageUrl = data.result.generation.image_url;
          this.subjctEmail = data.result.generation.email_subjects;

          if (data.result.generation.html) {
            let emailContent =
              typeof data.result.generation.html === 'string'
                ? data.result.generation.html
                : JSON.parse(data.result.generation.html);
            emailContent = emailContent.replace(/"/g, '').trim();
            this.editorContentEmail = emailContent.replace(/\\n\\n/g, '');
            this.existingEmailContent = this.editorContentEmail;

            const countWords = (emailContent: any) => {
              if (!emailContent) return 0;
              return emailContent?.trim().replace(/\s+/g, ' ').split(' ')
                .length;
            };

            this.totalWordCount = countWords(this.editorContentEmail);

            // Don't set loading to false here - wait for socket completion signal
            // this.loading = false;
            // this.aiContentGenerationService.setEmailReviewLoading(false);

            this.isEMailPromptDisabled = false;
            this.commonPromptIsLoading = false;
            this.translateIsLoading = false;
            this.isImageRegenrateDisabled = false;
            this.isImageRefineDisabled = false;

            // SAVE DATA IMMEDIATELY for instant retrieval when navigating back
            this.saveCurrentEmailReviewData();

            // Don't disconnect socket yet - wait for all agents to complete
            // Disconnect will happen when completion signal triggers
            // this.socketConnection.disconnect();
          }
        }
      });

    this.emailContentSubscription = this.aiContentGenerationService
      .getEmailResponsetData()
      .subscribe((data) => {
        this.aiContentGenerationService
          .getBrandData(this.formData?.brand)
          .subscribe({
            next: (response) => {
              this.brandLinks = response.links;
              this.brandlogo = response.logos[0]?.formats[0]?.src; // First logo's SVG src
              this.theme = response.logos[0]?.tags.theme;
              this.brandColor = response.colors;

              // Example usage
              this.darkHexCode = this.fetchHexCodeByType('dark');
              this.lightHexCode = this.fetchHexCodeByType('accent');
            },
            error: (err) => {
              console.error(err);
            },
          });
      });

    this.socialContentSubscription = this.aiContentGenerationService
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
      });
  }

  onCreateProject() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '400px';
    this.dialog.open(DialogSuccessComponent, dialogConfig);
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

  inputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }

  navigateToForm(): void {
    this.route.navigateByUrl('client-remark');
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

    this.aiContentGenerationService.generateContent(prompt).subscribe({
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
        this.imageUrl = data[0].url; // Update local variable
        this.isImageRegenrateDisabled = false;

        // SAVE DATA IMMEDIATELY after image regeneration
        this.saveCurrentEmailReviewData();
      },
      error: (err) => {
        console.error('Error generating image:', err);
      },
    });

    var eventImage = `Create an "${this.formData?.brand}" event image on "${this.formData?.topic}"`;
    var offerImage = `Create an "${this.formData?.brand}" offer image on "${this.formData?.topic}"`;
    console.log('event prompt : ', eventImage);
    console.log('offer prompt : ', offerImage);
    this.aiContentGenerationService.eventImageGeneration(eventImage).subscribe({
      next: (data) => {
        this.aiContentGenerationService.setEventImage(data[0].url);
      },
      error: (er) => {
        console.log('onCreateProject', er);
      },
    });
    this.aiContentGenerationService.offerImageGeneration(offerImage).subscribe({
      next: (data) => {
        this.aiContentGenerationService.setOfferImage(data[0].url);
      },
      error: (er) => {
        console.log('onCreateProject', er);
      },
    });
  }

  onImageRefine(prompt: string, type: string): void {
    this.isImageRefineDisabled = true;
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
  keepOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0; // Or implement custom sorting logic if needed
  };

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

  // Process chat response data
  processChatResponse(generationData: any) {
    console.log('Processing chat response:', generationData);

    // Update component data based on chat response
    if (generationData.email_header) {
      this.emailHeader = generationData.email_header;
    }

    if (generationData.image_url) {
      this.imageUrl = generationData.image_url;
    }

    if (generationData.email_subjects) {
      this.subjctEmail = generationData.email_subjects;

      // Parse subjects if it's a semicolon-separated string
      if (typeof this.subjctEmail === 'string') {
        this.subjctsEmail = this.subjctEmail
          .split(';')
          .map((subject: string) => subject.replace(/"/g, '').trim())
          .filter((subject: string) => subject !== '');

        if (this.subjctsEmail.length > 0) {
          this.selectedSubject = this.subjctsEmail[0]?.replace(/\n/g, '');
          this.onSubjectChange(this.selectedSubject);
        }
      }
    }

    if (generationData.html) {
      let emailContent = typeof generationData.html === 'string'
        ? generationData.html
        : JSON.parse(generationData.html);

      emailContent = emailContent.replace(/"/g, '').trim();
      this.editorContentEmail = emailContent.replace(/\\n\\n/g, '');
      this.existingEmailContent = this.editorContentEmail;

      // Calculate word count
      const countWords = (emailContent: any) => {
        if (!emailContent) return 0;
        return emailContent?.trim().replace(/\s+/g, ' ').split(' ').length;
      };

      this.totalWordCount = countWords(this.editorContentEmail);

      // Update editor content

      if (this.editorComponent) {
        this.editorComponent.editor.setContent(this.editorContentEmail);
      }

    }

    // Set loading states
    this.loading = false;
    // Update loading state in service
    this.aiContentGenerationService.setEmailReviewLoading(false);
    this.contentDisabled = false;
    this.isLoading = false;
    this.isEMailPromptDisabled = false;
    this.commonPromptIsLoading = false;
    this.translateIsLoading = false;
    this.isImageRegenrateDisabled = false;
    this.isImageRefineDisabled = false;

    // SAVE DATA IMMEDIATELY after regeneration
    this.saveCurrentEmailReviewData();

    // Share email content with client-remark screen
    this.aiContentGenerationService.setEmailContent({
      imageUrl: this.imageUrl,
      editorContentEmail: this.editorContentEmail,
      emailHeader: this.emailHeader,
      subjctEmail: this.subjctEmail,
      selectedSubject: this.selectedSubject,
      totalWordCount: this.totalWordCount
    });

    // Clear chat response after processing
    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 500);
  }

  // Agentic Workflow Helper Methods
  getWorkflowAgents(): Array<{ name: string; status: string }> {
    const socketData = this.socketConnection.dataSignal();

    // Define all agents in the correct order
    const agentOrder = [
      'Extraction Agent',
      'prompt generation agent',
      'content generation agent',
      'reviewer agent'
    ];

    // Map agents with their current status from socket data or default to 'PENDING'
    return agentOrder.map(agentName => {
      // Try case-insensitive matching to handle "Reviewer Agent" vs "reviewer agent"
      const normalizedName = agentName.toLowerCase();
      const matchingKey = Object.keys(socketData).find(key => key.toLowerCase() === normalizedName);
      const agentData = matchingKey ? socketData[matchingKey] : null;

      return {
        name: agentName,
        status: agentData?.status || 'PENDING'
      };
    });
  } getLineColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#22c55e'; // Green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#eab308'; // Yellow
      case 'FAILED':
        return '#ef4444'; // Red
      case 'PENDING':
      default:
        return '#6b7280'; // Gray
    }
  }

  getMarkerUrl(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'url(#arrowGreen)';
      case 'IN_PROGRESS':
      case 'STARTED':
        return 'url(#arrowYellow)';
      case 'PENDING':
      default:
        return 'url(#arrowGray)';
    }
  }

  getNodeColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#1e3a2e'; // Dark green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#3a2e1e'; // Dark yellow/orange
      case 'FAILED':
        return '#3a1e1e'; // Dark red
      case 'PENDING':
      default:
        return '#1e1e1e'; // Dark gray
    }
  }

  getStatusIconColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#22c55e'; // Green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#eab308'; // Yellow
      case 'FAILED':
        return '#ef4444'; // Red
      case 'PENDING':
      default:
        return '#6b7280'; // Gray
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#86efac'; // Light green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#fde047'; // Light yellow
      case 'FAILED':
        return '#fca5a5'; // Light red
      case 'PENDING':
      default:
        return '#d1d5db'; // Light gray
    }
  }

  // Initialize email payload from form data or collected data from chat-app
  initializeEmailPayload(): void {
    if (!this.formData) return;

    this.emailPayload = new FormData();

    // Use collected data structure (from chat-app) if available, otherwise use formData (from email-form)
    const useCase = this.formData?.use_case || 'Email Campaign';
    const purpose = this.formData?.purpose || '';
    const brand = this.formData?.brand || '';
    const tone = this.formData?.tone || this.formData?.Type || '';
    const topic = this.formData?.topic || '';
    const wordLimit = this.formData?.word_limit || this.formData?.wordLimit || '';
    const targetReader = this.formData?.target_reader || this.formData?.readers || '';
    const imageDetails = this.formData?.image_details || this.formData?.imageOpt || '';
    const imageDescription = this.formData?.image_description || this.formData?.imgDesc || '';
    const platform = this.formData?.campaign || '';
    this.emailPayload.append('use_case', useCase);
    this.emailPayload.append('purpose', purpose);
    this.emailPayload.append('brand', brand);
    this.emailPayload.append('tone', tone);
    this.emailPayload.append('topic', topic);
    this.emailPayload.append('word_limit', wordLimit);
    this.emailPayload.append('target_reader', targetReader);
    this.emailPayload.append('image_details', imageDetails);
    this.emailPayload.append('platform_campaign', platform)

    if (imageDescription && imageDescription.trim() !== '') {
      this.emailPayload.append('image_description', imageDescription);
    }
    if (this.formData?.additional && this.formData?.additional.trim() !== '') {
      this.emailPayload.append('additional_details', this.formData?.additional);
    }
  }

  // Validate content feedback input
  validateContentFeedback(feedback: string): boolean {
    const lowerFeedback = feedback.toLowerCase().trim();

    // Check if feedback mentions word count/limit
    const hasWordKeyword = lowerFeedback.includes('word count') ||
      lowerFeedback.includes('word limit') ||
      lowerFeedback.includes('words');

    // If word count/limit is mentioned, extract the number and validate it's >= 50
    if (hasWordKeyword) {
      const numbers = feedback.match(/\b\d+\b/g);
      if (numbers && numbers.length > 0) {
        const wordLimit = parseInt(numbers[0], 10);
        if (wordLimit < 50) {
          return false; // Invalid: word limit less than 50
        }
      }
    }

    return true; // Valid feedback
  }


  // Regenerate content based on feedback
  regenerateContent(): void {
    if (!this.contentFeedback || this.contentFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter feedback to regenerate content',
        life: 3000
      });
      return;
    }

    // Validate word limit is at least 50
    if (!this.validateContentFeedback(this.contentFeedback)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Word Limit',
        detail: 'Word limit should be more than 50 words.',
        life: 5000,
        icon: 'pi pi-exclamation-triangle'
      });
      return;
    }

    if (!this.emailPayload) {
      this.initializeEmailPayload();
    }

    // Add feedback and regenerate flag to payload
    this.emailPayload?.append('feedback', this.contentFeedback);
    this.emailPayload?.append('regenerate', 'true');

    this.isRegeneratingContent = true;
    // Don't set loading = true for regeneration (keep loader hidden)

    this.aiContentGenerationService.generateContent(this.emailPayload!, this.sessionId).subscribe({
      next: (data) => {
        console.log('Content regenerated:', data);
        this.aiContentGenerationService.setEmailResponseData(data);

        // Process the regenerated content
        if (data?.result?.generation) {
          this.processChatResponse(data.result.generation);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Content regenerated successfully',
          life: 3000,
          styleClass: 'custom-toast-success'
        });

        // Clear feedback input
        this.contentFeedback = '';

        // Reinitialize payload for next regeneration
        this.initializeEmailPayload();
      },
      error: (error) => {
        console.error('Error regenerating content:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate content. Please try again.',
          life: 3000
        });
        this.isRegeneratingContent = false;
        // Don't set loading = false (it wasn't set to true)
      },
      complete: () => {
        this.isRegeneratingContent = false;
        // Don't set loading = false (it wasn't set to true)
      }
    });
  }

  // Regenerate image based on feedback
  regenerateImage(): void {
    if (!this.imageFeedback || this.imageFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter image feedback to regenerate',
        life: 3000
      });
      return;
    }

    // Reinitialize payload to ensure all form data is fresh
    this.initializeEmailPayload();

    // Add image feedback and regenerate flag to payload
    this.emailPayload?.append('image_feedback', this.imageFeedback);
    this.emailPayload?.append('regenerate', 'true');
    console.log('regenerate image payload', this.emailPayload);
    this.isRegeneratingImage = true;
    // Don't set loading = true for regeneration (keep loader hidden)

    this.aiContentGenerationService.generateContent(this.emailPayload!, this.sessionId).subscribe({
      next: (data) => {
        console.log('Image regenerated:', data);

        // Process the regenerated response using the same handler as content
        if (data?.result?.generation) {
          this.processChatResponse(data.result.generation);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image regenerated successfully',
          life: 3000,
          styleClass: 'custom-toast-success'
        });

        // Clear feedback input
        this.imageFeedback = '';

        // Reinitialize payload for next regeneration
        this.initializeEmailPayload();
      },
      error: (error) => {
        console.error('Error regenerating image:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate image. Please try again.',
          life: 3000
        });
        this.isRegeneratingImage = false;
        // Don't set loading = false (it wasn't set to true)
      },
      complete: () => {
        this.isRegeneratingImage = false;
        // Don't set loading = false (it wasn't set to true)
      }
    });
  }

  appendToContentFeedback(text: string): void {
    if (this.contentFeedback) {
      this.contentFeedback += ' ' + text;
    } else {
      this.contentFeedback = text;
    }
  }

  // Reload existing content from service when returning from client
  reloadExistingEmailContent(): void {
    console.log('🔄 Reloading existing email content from service...');

    this.emailContentSubscription = this.aiContentGenerationService
      .getEmailResponsetData()
      .subscribe((data) => {
        if (!data || !data.result) {
          console.log('⚠️ No existing email data found in service');
          return;
        }

        console.log('📥 Reloading existing email data:', data);

        // Process the email content
        if (data.result.generation) {
          let emailContent = '';
          if (typeof data.result.generation.html === 'string') {
            emailContent = data.result.generation.html;
          } else if (typeof data.result.generation.content === 'string') {
            emailContent = data.result.generation.content;
          } else if (typeof data.result.generation.email === 'string') {
            emailContent = data.result.generation.email;
          } else if (typeof data.result.generation === 'string') {
            emailContent = data.result.generation;
          }

          if (emailContent) {
            this.editorContentEmail = emailContent.replace(/\\n\\n/g, '');
            this.existingEmailContent = this.editorContentEmail;

            const countWords = (content: any) => {
              if (!content) return 0;
              return content.trim().replace(/\s+/g, ' ').split(' ').length;
            };
            this.totalWordCount = countWords(this.editorContentEmail);
          }

          // Handle image URLs
          if (data.result.generation.image_url) {
            this.imageUrl = data.result.generation.image_url;
          }
          if (data.result.generation.offer_image_url) {
            this.imageOfferUrl = data.result.generation.offer_image_url;
          }
          if (data.result.generation.event_image_url) {
            this.imageEventUrl = data.result.generation.event_image_url;
          }
        }

        console.log('✅ Email content reloaded successfully');
        this.loading = false;
      });
  }

  // Save current email review data for instant retrieval
  saveCurrentEmailReviewData(): void {
    const savedData = {
      emailHeader: this.emailHeader,
      imageUrl: this.imageUrl,
      subjctEmail: this.subjctEmail,
      editorContentEmail: this.editorContentEmail,
      existingEmailContent: this.existingEmailContent,
      totalWordCount: this.totalWordCount,
      formData: this.formData,
      brand: this.brand,
      showMore: this.showMore,
      brandlogoTop: this.brandlogoTop,
      imageOfferUrl: this.imageOfferUrl,
      imageEventUrl: this.imageEventUrl
    };

    this.aiContentGenerationService.setSavedEmailReviewData(savedData);
    console.log('💾 Email review data saved for instant retrieval');
  }

  ngOnDestroy(): void {
    // Clear session ID to stop receiving socket messages
    this.socketConnection.clearSessionId();
    console.log('🧹 Email review session ended:', this.sessionId);

    // Unsubscribe from observables to prevent memory leaks
    this.emailContentSubscription?.unsubscribe();
    this.socialContentSubscription?.unsubscribe();
  }
}
