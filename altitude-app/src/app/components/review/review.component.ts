import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { FormGroup, FormsModule } from '@angular/forms';
import { ContentGenerationService } from '../../services/content-generation.service';
import { Router, RouterLink } from '@angular/router';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { CommonModule } from '@angular/common';
import { SelectionStore } from '../../store/campaign.store';
import { EmailReviewComponent } from '../email-review/email-review.component';
import { SocialReviewComponent } from '../social-review/social-review.component';

import { Tabs, TabsModule } from 'primeng/tabs';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { BlogReviewComponent } from '../blog-review/blog-review.component';
@Component({
  selector: 'app-review',
  imports: [
    HeaderComponent,
    SelectModule,
    InputTextModule,
    ButtonModule,
    AccordionModule,
    FormsModule,
    CommonModule,
    RouterLink,
    EmailReviewComponent,
    SocialReviewComponent,
    TabsModule,
    TabViewModule,
    ProductReviewComponent,
    BlogReviewComponent,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent {
  activeTabIndex: WritableSignal<number> = signal(0);
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
  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService,
    // private dialog: MatDialog,
    private chnge: ChangeDetectorRef
  ) {}

  formData: any;
  ngOnInit(): void {
    this.selection = this.store.campaignType();
    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
      console.log('datadatadatadatadatadatadatadatadatadatadatadata', data);
    });
  }
  navigateToForm(): void {
    this.route.navigateByUrl('client-remark');

    // this.chnge.detectChanges();
  }
}
